import React from 'react';
import { ShieldCheck, X, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTerms?: boolean;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, isTerms = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isTerms ? 'Terms of Use & Citizen Advisory' : 'Privacy & Data Protection Policy'}
              </h3>
              <p className="text-xs text-slate-500">
                CivicAssist AI Citizen Charter • DPDP Act 2023 Aligned
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Important Independence Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
            <strong>Statutory Disclosure:</strong> CivicAssist AI is an independent, non-governmental citizen-assistance platform. It is NOT an official portal of the Government of India, State Governments, or any statutory authority.
          </div>

          {!isTerms ? (
            <>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  1. Zero Sensitive PII Architecture
                </h4>
                <p>
                  CivicAssist AI does not collect, record, or store citizen Aadhaar numbers, biometric data, PAN cards, or bank credentials. All discovery queries are evaluated anonymously without persistent tracking.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-800" />
                  2. Document Readiness Engine Privacy
                </h4>
                <p>
                  Document checklists are processed strictly on your local browser session to calculate application readiness scores. No sensitive citizen documents are retained on external servers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  3. Digital Personal Data Protection (DPDP) Act 2023
                </h4>
                <p>
                  You retain full ownership of your citizen journey logs. You can delete or clear your session at any time from your profile settings.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  1. Informational & Navigational Scope
                </h4>
                <p>
                  CivicAssist AI provides guidance on government procedures, eligibility guidelines, and document readiness based on verified public records. Final eligibility and issuance decisions rest solely with the competent government authority.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  2. Official Portals & Direct Submissions
                </h4>
                <p>
                  CivicAssist AI redirects citizens to verified official government portals (such as National Scholarship Portal, ServicePlus, Parivahan, and NSAP). We do not charge fees on behalf of the government. Never pay unauthorized intermediaries.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  3. Accuracy of Public Schemes
                </h4>
                <p>
                  While guidelines are frequently cross-referenced with official gazettes, government rules and income thresholds can be revised. Always consult the official portal link provided before filing.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-950 transition cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
