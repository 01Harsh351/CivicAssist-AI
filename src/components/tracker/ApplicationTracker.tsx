import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApplicationJourney, ApplicationStage, PublicService } from '../../types';
import { RemindMeModal } from './RemindMeModal';
import {
  generateGoogleCalendarUrl,
  generateIcsContent,
  downloadIcsFile,
} from '../../utils/calendarUtils';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Building2,
  Trash2,
  Bell,
  Download,
  CalendarCheck,
} from 'lucide-react';

const STAGES: { stage: ApplicationStage; label: string }[] = [
  { stage: 'service_identified', label: 'Service Identified' },
  { stage: 'eligibility_checked', label: 'Eligibility Checked' },
  { stage: 'documents_prepared', label: 'Documents Prepared' },
  { stage: 'application_pending', label: 'Application Submitted / Pending' },
  { stage: 'verification', label: 'Field Verification' },
  { stage: 'completed', label: 'Certificate / Service Issued' },
];

export const ApplicationTracker: React.FC = () => {
  const {
    applicationJourneys,
    updateJourneyStage,
    deleteApplicationJourney,
    services,
    setSelectedService,
    setActiveTab,
  } = useApp();
  const { t } = useLanguage();

  const [editingRefId, setEditingRefId] = useState<string | null>(null);
  const [refInput, setRefInput] = useState('');

  // Remind Me Modal State
  const [remindModalOpen, setRemindModalOpen] = useState(false);
  const [selectedJourneyForReminder, setSelectedJourneyForReminder] = useState<ApplicationJourney | null>(null);
  const [selectedServiceForReminder, setSelectedServiceForReminder] = useState<PublicService | null>(null);

  const getStageIndex = (stage: ApplicationStage) =>
    STAGES.findIndex((s) => s.stage === stage);

  const handleOpenReminder = (journey: ApplicationJourney, svc?: PublicService) => {
    setSelectedJourneyForReminder(journey);
    setSelectedServiceForReminder(svc || null);
    setRemindModalOpen(true);
  };

  const getDaysDiffText = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
  };

  const handleUpdateRef = (journeyId: string) => {
    if (refInput.trim()) {
      const journey = applicationJourneys.find((j) => j.id === journeyId);
      if (journey) {
        updateJourneyStage(journeyId, journey.currentStage, refInput.trim());
      }
    }
    setEditingRefId(null);
    setRefInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-900" />
            <span>{t('my_applications')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your citizen service applications, document checklists, and submission progress.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find_service')}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
        >
          <span>Find Another Service</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reminder Banner (Requirement #11) */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong className="font-bold block mb-0.5">
            {t('reminders_banner')}
          </strong>
          <span>
            Income Certificate application journey requires valid income affidavit before final field inquiry. Review your active applications below.
          </span>
        </div>
      </div>

      {/* Applications List */}
      {applicationJourneys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active applications yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Search for a service or browse our catalog, check your eligibility, and click "Save to My Applications" to initiate your journey.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-950 transition cursor-pointer"
          >
            Start Service Discovery
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {applicationJourneys.map((journey) => {
            const currentIdx = getStageIndex(journey.currentStage);
            const fullService = services.find((s) => s.id === journey.serviceId);

            return (
              <div
                key={journey.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900">
                        {journey.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {journey.state}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {journey.serviceName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Initiated: {new Date(journey.createdDate).toLocaleDateString()}</span>
                      {journey.referenceNumber && (
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold">
                          Ack No: {journey.referenceNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Action */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenReminder(journey, fullService)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        journey.reminderDeadline
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                      }`}
                      title="Set key deadline reminder and add to Google Calendar or export .ICS"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{journey.reminderDeadline ? 'Reminder Set' : 'Remind Me'}</span>
                    </button>

                    {fullService && (
                      <button
                        onClick={() => setSelectedService(fullService)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        View Full Service
                      </button>
                    )}
                    {fullService?.officialPortalUrl && (
                      <a
                        href={fullService.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Remove "${journey.serviceName}" from your applications?`)) {
                          deleteApplicationJourney(journey.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
                      title="Delete application from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 6-STAGE WORKFLOW STEPPER */}
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Application Journey Stages
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {STAGES.map((st, idx) => {
                      const isCompleted = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <button
                          key={st.stage}
                          onClick={() => updateJourneyStage(journey.id, st.stage)}
                          className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[75px] cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : isCurrent
                              ? 'bg-blue-900 border-blue-900 text-white shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                          title={`Click to mark stage as ${st.label}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold">
                              Step {idx + 1}
                            </span>
                            {isCompleted && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            )}
                          </div>
                          <span className="text-xs font-semibold leading-tight mt-1">
                            {st.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reference Number & Status Bar */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <span>
                      {editingRefId === journey.id ? (
                        <span className="inline-flex items-center gap-2">
                          <input
                            type="text"
                            value={refInput}
                            onChange={(e) => setRefInput(e.target.value)}
                            placeholder="Enter portal reference or docket ID"
                            className="px-2 py-1 border border-slate-300 rounded bg-white text-xs font-mono"
                          />
                          <button
                            onClick={() => handleUpdateRef(journey.id)}
                            className="px-2 py-1 bg-blue-900 text-white rounded font-bold"
                          >
                            Save
                          </button>
                        </span>
                      ) : (
                        <span>
                          Reference Docket ID:{' '}
                          <strong className="font-mono text-slate-800">
                            {journey.referenceNumber || 'Not recorded'}
                          </strong>{' '}
                          <button
                            onClick={() => {
                              setEditingRefId(journey.id);
                              setRefInput(journey.referenceNumber || '');
                            }}
                            className="text-blue-700 hover:underline ml-1 font-semibold"
                          >
                            [Edit ID]
                          </button>
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="text-slate-500 text-[11px]">
                    Current Stage: <strong className="text-blue-950 uppercase">{STAGES[currentIdx]?.label}</strong>
                  </div>
                </div>

                {journey.notes && (
                  <p className="text-xs text-slate-600 italic">
                    Note: {journey.notes}
                  </p>
                )}

                {/* Key Deadline Reminder Banner (Google Cal & .ICS export) */}
                {journey.reminderDeadline ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border border-amber-300 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                          <CalendarCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                              Scheduled Milestone Deadline
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-bold">
                              {getDaysDiffText(journey.reminderDeadline.date)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                            {journey.reminderDeadline.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-blue-900" />
                              <span>
                                {new Date(journey.reminderDeadline.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>
                            {journey.reminderDeadline.time && (
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-blue-900" />
                                <span>{journey.reminderDeadline.time} hrs</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick 1-Click Export Actions */}
                      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                        {/* Google Calendar Web Link */}
                        <button
                          onClick={() => {
                            const url = generateGoogleCalendarUrl({
                              title: journey.reminderDeadline!.title,
                              description:
                                journey.reminderDeadline!.notes ||
                                `Key deadline for ${journey.serviceName}`,
                              startDate: journey.reminderDeadline!.date,
                              startTime: journey.reminderDeadline!.time,
                              portalUrl:
                                journey.reminderDeadline!.portalUrl || fullService?.officialPortalUrl,
                            });
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                          title="Open Google Calendar with prefilled deadline details"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                          <span>Google Cal</span>
                        </button>

                        {/* Local Calendar .ICS Download */}
                        <button
                          onClick={() => {
                            const ics = generateIcsContent({
                              title: journey.reminderDeadline!.title,
                              description:
                                journey.reminderDeadline!.notes ||
                                `Key deadline for ${journey.serviceName}`,
                              startDate: journey.reminderDeadline!.date,
                              startTime: journey.reminderDeadline!.time,
                              portalUrl:
                                journey.reminderDeadline!.portalUrl || fullService?.officialPortalUrl,
                            });
                            downloadIcsFile(`${journey.serviceName}_deadline`, ics);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                          title="Download RFC 5545 .ICS file for Apple Calendar, Outlook, or Phone"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.ICS File</span>
                        </button>

                        <button
                          onClick={() => handleOpenReminder(journey, fullService)}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition cursor-pointer"
                        >
                          Modify
                        </button>
                      </div>
                    </div>

                    {journey.reminderDeadline.notes && (
                      <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed font-normal">
                        <strong>Notes:</strong> {journey.reminderDeadline.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-slate-400" />
                      <span>No calendar reminder set for this application yet.</span>
                    </span>
                    <button
                      onClick={() => handleOpenReminder(journey, fullService)}
                      className="text-xs font-bold text-blue-900 hover:text-blue-950 underline cursor-pointer"
                    >
                      + Add Key Deadline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Simulated Tracking Disclaimer Note */}
      <div className="p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
        <p className="font-medium">
          {t('simulated_tracking_note')}
        </p>
      </div>

      {/* Remind Me & Calendar Modal */}
      <RemindMeModal
        isOpen={remindModalOpen}
        onClose={() => setRemindModalOpen(false)}
        journey={selectedJourneyForReminder}
        service={selectedServiceForReminder}
      />
    </div>
  );
};
