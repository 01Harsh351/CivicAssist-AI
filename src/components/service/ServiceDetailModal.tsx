import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { EligibilityEngine } from './EligibilityEngine';
import { DocumentReadinessEngine } from './DocumentReadinessEngine';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  BadgeIndianRupee,
  FileCheck2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Share2,
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const {
    selectedService,
    setSelectedService,
    startApplicationJourney,
    toggleSaveService,
    isServiceSaved,
    showToast,
  } = useApp();
  const { t } = useLanguage();

  if (!selectedService) return null;

  const saved = isServiceSaved(selectedService.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `CivicAssist AI Guide for ${selectedService.serviceName}: ${selectedService.officialPortalUrl}`
      );
      showToast('Service details copied to clipboard.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Relevant Public Service</span>
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-900 text-blue-200">
                {selectedService.category}
              </span>
              <span className="text-xs text-slate-400">
                {selectedService.state}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {selectedService.serviceName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {selectedService.department}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Share service guide"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedService(null)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Section: Why This Service & Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t('why_this_service')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedService.description}
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Processing Time</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  ~{selectedService.processingTimeDays} Days
                </strong>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Statutory Fee</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                  <BadgeIndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  {selectedService.statutoryFeeText.split(' ')[0]}
                </strong>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Admin Department</span>
                <strong className="text-slate-900 font-bold block truncate mt-0.5">
                  {selectedService.source}
                </strong>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Last Verified</span>
                <strong className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {selectedService.lastVerified}
                </strong>
              </div>
            </div>
          </div>

          {/* Section: Eligibility Engine */}
          <div>
            <EligibilityEngine service={selectedService} />
          </div>

          {/* Section: Document Readiness Engine */}
          <div>
            <DocumentReadinessEngine service={selectedService} />
          </div>

          {/* Section: Application Steps */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-900" />
              <span>{t('application_steps')} (5-Stage Public Flow)</span>
            </h4>

            <div className="space-y-3">
              {selectedService.applicationSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-extrabold flex items-center justify-center flex-shrink-0 text-xs">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-sm">{step.title}</strong>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Est: {step.estimatedTime}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Official Information & Link (Requirement #8) */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-blue-300 block">
                  {t('official_portal')}
                </span>
                <h5 className="font-bold text-base text-white">
                  {selectedService.source}
                </h5>
                <p className="text-xs text-slate-300 mt-0.5">
                  Direct official portal. Never submit documents or pay through unverified agents.
                </p>
              </div>

              {selectedService.isVerified && selectedService.officialPortalUrl ? (
                <a
                  href={selectedService.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer flex-shrink-0"
                >
                  <span>{t('visit_official_portal')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                  {t('official_link_unverified')}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Verified statutory link: <code className="text-blue-200">{selectedService.officialPortalUrl}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveService(selectedService.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                saved
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                  <span>Saved in Profile</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save for Later</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedService(null)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              {t('close')}
            </button>
            <button
              onClick={() => {
                startApplicationJourney(selectedService);
                setSelectedService(null);
              }}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t('save_to_applications')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
