import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Globe2,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How is CivicAssist AI different from a generic AI chatbot (like ChatGPT)?',
    answer:
      'CivicAssist AI is not a generic conversation bot. It is a structured public service navigator designed around the citizen journey: Real-Life Problem → Verified Statutory Service → Rule-Based Eligibility → Document Checklist & Missing Documents → Step-by-Step Action Plan → Direct Official Portal → Tracking. It does not fabricate procedures or government links.',
  },
  {
    question: 'Is CivicAssist AI an official Government of India portal?',
    answer:
      'No. CivicAssist AI is an independent, non-governmental citizen-assistance platform. It does not charge statutory fees, issue government certificates, or represent any ministry. It guides citizens to the official Government of India and State Government portals (e.g. ServicePlus, NSP, Parivahan, NSAP).',
  },
  {
    question: 'How does CivicAssist AI protect citizen privacy?',
    answer:
      'CivicAssist AI follows a zero-sensitive-PII architecture. We NEVER ask for or store citizen Aadhaar numbers, biometric fingerprints, PAN cards, or banking credentials. Document preparation states are audited locally to calculate readiness without exposing citizen files.',
  },
  {
    question: 'Which Indian languages are supported?',
    answer:
      'CivicAssist AI supports English plus all 22 constitutionally recognized languages in the Eighth Schedule of the Indian Constitution: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu.',
  },
  {
    question: 'How do I avoid fraud when applying for government services online?',
    answer:
      'Always use verified portals ending in .gov.in or .nic.in provided in CivicAssist AI. Never pay fees to private intermediaries claiming to expedite government approvals. Most basic registrations (such as Udyam MSME and Ayushman Bharat) are 100% free of statutory fees.',
  },
];

export const HelpCenterView: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-900" />
          <span>{t('help')} • Citizen Support & FAQs</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Everything you need to know about navigating public services with CivicAssist AI.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180 text-blue-900' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-1">Citizen Safety Advisory:</strong>
          Official government services always communicate through official SMS shortcodes or registered departmental emails. Never share OTPs or passwords over phone calls.
        </div>
      </div>
    </div>
  );
};
