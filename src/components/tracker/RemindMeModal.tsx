import React, { useState, useEffect } from 'react';
import { ApplicationJourney, PublicService, JourneyReminder } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  generateGoogleCalendarUrl,
  generateIcsContent,
  downloadIcsFile,
  CalendarEventPayload,
} from '../../utils/calendarUtils';
import {
  Calendar,
  Clock,
  Bell,
  X,
  CheckCircle2,
  Download,
  ExternalLink,
  Trash2,
  AlertCircle,
  FileText,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

interface RemindMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: ApplicationJourney | null;
  service?: PublicService | null;
}

export const RemindMeModal: React.FC<RemindMeModalProps> = ({
  isOpen,
  onClose,
  journey,
  service,
}) => {
  const { saveJourneyReminder, removeJourneyReminder, showToast } = useApp();

  if (!isOpen || !journey) return null;

  // Calculate default dates
  const today = new Date().toISOString().split('T')[0];
  const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const in14Days = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  const slaDays = service?.processingTimeDays || 21;
  const inSlaDays = new Date(Date.now() + slaDays * 86400000).toISOString().split('T')[0];

  // Existing reminder or smart defaults
  const existing = journey.reminderDeadline;

  const [reminderType, setReminderType] = useState<JourneyReminder['type']>(
    existing?.type || 'document_submission'
  );

  const [title, setTitle] = useState(
    existing?.title || `Submit Documents for ${journey.serviceName}`
  );
  const [date, setDate] = useState(existing?.date || in7Days);
  const [time, setTime] = useState(existing?.time || '10:00');
  const [location, setLocation] = useState(
    service?.department ? `${service.department} / Citizen Portal` : 'Official Portal / Tahsil Office'
  );
  const [notes, setNotes] = useState(
    existing?.notes ||
      (journey.referenceNumber
        ? `Application Ack Docket ID: ${journey.referenceNumber}. Review missing document proofs before deadline.`
        : 'Ensure all photocopies and attested documents are ready for submission.')
  );

  // Sync if journey changes
  useEffect(() => {
    if (journey) {
      if (journey.reminderDeadline) {
        setReminderType(journey.reminderDeadline.type);
        setTitle(journey.reminderDeadline.title);
        setDate(journey.reminderDeadline.date);
        setTime(journey.reminderDeadline.time || '10:00');
        setNotes(journey.reminderDeadline.notes || '');
      } else {
        setReminderType('document_submission');
        setTitle(`Submit Documents for ${journey.serviceName}`);
        setDate(in7Days);
        setTime('10:00');
        setNotes(
          journey.referenceNumber
            ? `Application Ack Docket ID: ${journey.referenceNumber}. Complete physical submission or portal document upload.`
            : 'Prepare mandatory identity, address, and income certificates before submission.'
        );
      }
    }
  }, [journey?.id, journey?.reminderDeadline]);

  // Handle Quick Milestone Presets
  const handleSelectPreset = (
    type: JourneyReminder['type']
  ) => {
    setReminderType(type);
    if (type === 'document_submission') {
      setTitle(`Submit Required Proofs & Documents: ${journey.serviceName}`);
      setDate(in7Days);
      setTime('10:00');
      setNotes(
        journey.referenceNumber
          ? `Ack No: ${journey.referenceNumber}. Upload missing documents on official portal or visit Seva Kendra.`
          : 'Gather certified copies and affidavits before the portal closing date.'
      );
    } else if (type === 'field_inquiry') {
      setTitle(`Field Inquiry & Inspection: ${journey.serviceName}`);
      setDate(in14Days);
      setTime('11:00');
      setNotes('Revenue Inspector / Lekhpal field inquiry appointment. Keep original documents ready for physical verification.');
    } else if (type === 'resolution_sla') {
      setTitle(`Expected Portal Resolution (${slaDays}-Day SLA): ${journey.serviceName}`);
      setDate(inSlaDays);
      setTime('16:00');
      setNotes(
        `Statutory processing SLA (${slaDays} days). Check application status on official portal or download digital certificate.`
      );
    } else {
      setTitle(`Custom Deadline: ${journey.serviceName}`);
      setDate(today);
      setTime('09:30');
    }
  };

  // Build calendar payload
  const buildPayload = (): CalendarEventPayload => {
    let descriptionText = `Citizen Application: ${journey.serviceName}\nCategory: ${journey.category}\nState/Department: ${journey.state}`;
    if (journey.referenceNumber) {
      descriptionText += `\nReference / Docket No: ${journey.referenceNumber}`;
    }
    if (notes) {
      descriptionText += `\n\nNotes & Checkpoints:\n${notes}`;
    }

    return {
      title,
      description: descriptionText,
      location,
      startDate: date,
      startTime: time,
      durationMinutes: 60,
      portalUrl: service?.officialPortalUrl || journey.reminderDeadline?.portalUrl,
    };
  };

  // Add directly to Google Calendar
  const handleAddToGoogleCalendar = () => {
    const payload = buildPayload();
    const googleUrl = generateGoogleCalendarUrl(payload);

    // Save reminder in tracker state as well
    const reminderData: JourneyReminder = {
      title,
      date,
      time,
      type: reminderType,
      notes,
      portalUrl: service?.officialPortalUrl,
    };
    saveJourneyReminder(journey.id, reminderData);

    // Open Google Calendar in new tab
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening Google Calendar & saved to your tracker!');
    onClose();
  };

  // Download .ICS calendar file
  const handleDownloadIcs = () => {
    const payload = buildPayload();
    const icsContent = generateIcsContent(payload);
    const filename = `${journey.serviceName.slice(0, 25)}_deadline_${date}`;

    // Trigger local calendar file download
    downloadIcsFile(filename, icsContent);

    // Save reminder in tracker state as well
    const reminderData: JourneyReminder = {
      title,
      date,
      time,
      type: reminderType,
      notes,
      portalUrl: service?.officialPortalUrl,
    };
    saveJourneyReminder(journey.id, reminderData);

    showToast('Downloaded .ICS file! Open it to add to Apple Calendar, Outlook, or Phone.');
    onClose();
  };

  // Save to tracker only
  const handleSaveToTrackerOnly = () => {
    const reminderData: JourneyReminder = {
      title,
      date,
      time,
      type: reminderType,
      notes,
      portalUrl: service?.officialPortalUrl,
    };
    saveJourneyReminder(journey.id, reminderData);
    onClose();
  };

  // Remove existing reminder
  const handleRemoveReminder = () => {
    removeJourneyReminder(journey.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-800/80 border border-blue-700 text-blue-200 text-[11px] font-semibold mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Remind Me & Calendar Export</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Set Key Application Deadline</span>
            </h2>
            <p className="text-xs text-blue-200 mt-1">
              Add submission deadlines & portal dates directly to Google Calendar or your device.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Target Service Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 font-medium">Service Application</div>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {journey.serviceName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-600">
                <span className="font-semibold text-blue-900">{journey.category}</span>
                <span>•</span>
                <span>{journey.state}</span>
                {journey.referenceNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold text-slate-800">
                      Docket: {journey.referenceNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Choose Milestone Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('document_submission')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  reminderType === 'document_submission'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px] font-bold">📄 Document Submission</span>
                <span className={`text-[10px] mt-1 ${reminderType === 'document_submission' ? 'text-blue-200' : 'text-slate-500'}`}>
                  +7 Days Target
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('field_inquiry')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  reminderType === 'field_inquiry'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px] font-bold">🔍 Field Verification</span>
                <span className={`text-[10px] mt-1 ${reminderType === 'field_inquiry' ? 'text-blue-200' : 'text-slate-500'}`}>
                  +14 Days Target
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('resolution_sla')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  reminderType === 'resolution_sla'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px] font-bold">⏱️ Portal SLA Date</span>
                <span className={`text-[10px] mt-1 ${reminderType === 'resolution_sla' ? 'text-blue-200' : 'text-slate-500'}`}>
                  +{slaDays} Days Turnaround
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('custom')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  reminderType === 'custom'
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px] font-bold">🔔 Custom Alert</span>
                <span className={`text-[10px] mt-1 ${reminderType === 'custom' ? 'text-blue-200' : 'text-slate-500'}`}>
                  Citizen Choice
                </span>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Calendar Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Submit Income Affidavit at Tahsil Office"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-900" />
                  <span>Deadline Date *</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-900" />
                  <span>Reminder Time *</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-900" />
                <span>Portal / Submission Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. e-District Uttar Pradesh Portal or Local Seva Kendra"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Citizen Notes & Documents Checklist
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key documents to bring, verification officer contacts, etc."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Alarm Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Smart Calendar Alerts Included:</strong> Exported reminders contain automatic popup alarms <strong>1 day prior</strong> and <strong>2 hours prior</strong> to the scheduled time so you never miss a submission window.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {existing ? (
            <button
              type="button"
              onClick={handleRemoveReminder}
              className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Reminder</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveToTrackerOnly}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition text-center cursor-pointer"
            >
              Save in Tracker Only
            </button>
          )}

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:ml-auto">
            {/* Google Calendar Action */}
            <button
              type="button"
              onClick={handleAddToGoogleCalendar}
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Add to Google Calendar</span>
            </button>

            {/* ICS File Download Action */}
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              title="Download standard RFC 5545 iCalendar file for Apple Calendar, Outlook, or Android"
            >
              <Download className="w-4 h-4" />
              <span>Download .ICS File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
