import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PublicService } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ListChecks,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  FileCheck2,
  HelpCircle,
  Clock,
  Building2,
  ArrowDownCircle,
} from 'lucide-react';

export const AIServiceDiscovery: React.FC = () => {
  const {
    aiResult,
    setSelectedService,
    startApplicationJourney,
    toggleSaveService,
    isServiceSaved,
    resetSearch,
  } = useApp();
  const { t } = useLanguage();

  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Direct the user towards the result with a smooth scroll-down effect
  useEffect(() => {
    if (aiResult && resultsRef.current) {
      const timer = setTimeout(() => {
        if (resultsRef.current) {
          const yOffset = -80; // accounts for the sticky navbar height
          const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [aiResult]);

  if (!aiResult) return null;

  const handleSelectAnswer = (qIndex: number, answerText: string) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [qIndex]: answerText,
    }));
  };

  return (
    <div
      ref={resultsRef}
      id="service-results"
      className="bg-white rounded-2xl shadow-xl border-2 border-blue-900/30 overflow-hidden mb-10 transition-all duration-500 scroll-mt-24 ring-4 ring-blue-500/10 animate-in fade-in zoom-in-98"
    >
      {/* Top Banner: Workflow Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-800/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              AI Smart Service Navigator • Intent Understanding
            </span>
          </div>

          <button
            onClick={resetSearch}
            className="text-xs text-blue-200 hover:text-white underline cursor-pointer"
          >
            Clear / Start New Search
          </button>
        </div>

        <div className="mt-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {aiResult.intentSummary}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-blue-200">
            <span className="px-2 py-0.5 rounded bg-blue-900/80 border border-blue-700/60">
              Category: <strong>{aiResult.detectedCategory}</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span>Matched {aiResult.matchedServices.length} Statutory Scheme(s)</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-7">
        {/* SECTION 1: Matched Public Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Recommended Public Services ({aiResult.matchedServices.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Government-verified schemes</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {aiResult.matchedServices.map(({ service, relevanceScore, whyRelevant }) => {
              const saved = isServiceSaved(service.id);
              return (
                <div
                  key={service.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-white transition shadow-2xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{relevanceScore}% Relevance Match</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-900">
                          {service.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {service.state}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition">
                        {service.serviceName}
                      </h4>

                      <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Why this service? </strong>
                        {whyRelevant}
                      </div>

                      {/* Department & Processing Details */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {service.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Processing: ~{service.processingTimeDays} Days
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons for this Service */}
                    <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => setSelectedService(service)}
                        className="w-full py-2 px-3.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Check Details & Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex w-full gap-2">
                        <button
                          onClick={() => toggleSaveService(service.id)}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition ${
                            saved
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                          title="Save to your profile"
                        >
                          {saved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => startApplicationJourney(service)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                          title="Track journey"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Minimal Follow-up Clarification (Requirement #7) */}
        {aiResult.suggestedQuestions.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-800" />
              <h4 className="font-bold text-slate-900 text-sm">
                Clarifying Questions for Precision Matching
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Answering these helps confirm statutory eligibility without sharing sensitive personal documents.
            </p>

            <div className="space-y-3">
              {aiResult.suggestedQuestions.map((q, idx) => {
                const currentAnswer = answeredQuestions[idx];
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <p className="font-semibold text-slate-800 mb-2">
                      {idx + 1}. {q}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Yes / Applies to me', 'No / Does not apply', 'Not sure yet'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(idx, opt)}
                          className={`px-3 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                            currentAnswer === opt
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: SMART ACTION PLAN (Requirement #12: "Your Next 3 Actions") */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-blue-900" />
              <h4 className="text-base font-extrabold text-blue-950">
                {t('your_next_3_actions')}
              </h4>
            </div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              Step-by-Step Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {aiResult.actionPlan.map((action, i) => {
              const stepColors = [
                'bg-white border-blue-300 text-blue-950',
                'bg-white border-amber-300 text-amber-950',
                'bg-white border-emerald-300 text-emerald-950',
              ];
              return (
                <div
                  key={action.id || i}
                  className={`p-4 rounded-xl border shadow-2xs relative ${
                    stepColors[i % 3]
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action #{i + 1}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    {action.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prompt to open primary service */}
          <div className="mt-4 pt-3 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              Ready to begin? Review verified document checklist and official portal guidelines.
            </span>
            <button
              onClick={() => setSelectedService(aiResult.matchedServices[0].service)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Complete Service File</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
