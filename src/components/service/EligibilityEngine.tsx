import React, { useState } from 'react';
import { PublicService, EligibilityAssessment } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface EligibilityEngineProps {
  service: PublicService;
}

export const EligibilityEngine: React.FC<EligibilityEngineProps> = ({ service }) => {
  const { t } = useLanguage();

  // Track conditions checked by user
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    // Pre-check first condition as friendly default
    if (service.eligibilityConditions[0]) {
      initial[service.eligibilityConditions[0].id] = true;
    }
    return initial;
  });

  const totalConditions = service.eligibilityConditions.length;
  const metCount = Object.values(checkedRules).filter(Boolean).length;
  const percentage = Math.round((metCount / totalConditions) * 100);

  // Structured assessment
  let status: 'likely_eligible' | 'more_info_needed' | 'not_eligible' = 'more_info_needed';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  let statusText = t('more_info_needed');
  let StatusIcon = AlertTriangle;

  if (metCount === totalConditions) {
    status = 'likely_eligible';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    statusText = t('likely_eligible');
    StatusIcon = CheckCircle2;
  } else if (metCount === 0 && Object.keys(checkedRules).length > 0) {
    status = 'not_eligible';
    badgeColor = 'bg-red-100 text-red-900 border-red-300';
    statusText = t('not_eligible');
    StatusIcon = XCircle;
  }

  const toggleCondition = (condId: string) => {
    setCheckedRules((prev) => ({
      ...prev,
      [condId]: !prev[condId],
    }));
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <span>{t('eligibility')}</span>
            <span className="text-xs text-slate-500 font-normal">
              ({metCount} of {totalConditions} conditions satisfied)
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Check the conditions applicable to your situation to assess readiness.
          </p>
        </div>

        {/* Live Status Badge */}
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 shadow-2xs ${badgeColor}`}
        >
          <StatusIcon className="w-4 h-4 flex-shrink-0" />
          <span>{statusText}</span>
        </div>
      </div>

      {/* Conditions Checkbox List */}
      <div className="space-y-2.5">
        {service.eligibilityConditions.map((cond) => {
          const isMet = checkedRules[cond.id] || false;
          return (
            <div
              key={cond.id}
              onClick={() => toggleCondition(cond.id)}
              className={`p-3 rounded-lg border transition cursor-pointer flex items-start gap-3 ${
                isMet
                  ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isMet}
                onChange={() => {}} // Controlled by parent div
                className="mt-0.5 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{cond.label}</span>
                  {cond.required && (
                    <span className="text-[10px] font-semibold text-red-600 uppercase">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {cond.criteriaText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structured Threshold Notes (Income / Age) */}
      {(service.incomeLimitINR || service.minAge) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {service.incomeLimitINR && (
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px] font-medium">Income Ceiling</span>
              <strong className="text-slate-900 text-xs">
                ₹{(service.incomeLimitINR / 100000).toFixed(2)} Lakh / Year (Family)
              </strong>
            </div>
          )}
          {service.minAge && (
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px] font-medium">Age Requirement</span>
              <strong className="text-slate-900 text-xs">
                {service.minAge} Years Minimum
              </strong>
            </div>
          )}
        </div>
      )}

      {/* Mandatory Statutory Disclaimer (Requirement #10) */}
      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Notice:</strong> {t('eligibility_disclaimer')}
        </p>
      </div>
    </div>
  );
};
