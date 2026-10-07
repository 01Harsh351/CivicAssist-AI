import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { DocumentReadinessState } from '../../types';
import {
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface StandardDocInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  officialSource: string;
}

const STANDARD_DOCS: StandardDocInfo[] = [
  {
    id: 'doc_id',
    name: 'Aadhaar Card (UIDAI)',
    category: 'Identity',
    description: 'Primary 12-digit biometric identity document for all DBT benefits.',
    officialSource: 'Download e-Aadhaar from uidai.gov.in or digilocker.gov.in',
  },
  {
    id: 'doc_address',
    name: 'Address Proof (Electricity Bill / Water Bill)',
    category: 'Address',
    description: 'Utility bill validating domestic address within revenue subdivision.',
    officialSource: 'State Power Distribution Corporation consumer portal',
  },
  {
    id: 'doc_income_proof',
    name: 'Income Certificate / Salary Slip / ITR',
    category: 'Income',
    description: 'Proof of annual family earnings for fee concessions and EWS criteria.',
    officialSource: 'State e-District portal or local Tehsil Revenue Office',
  },
  {
    id: 'doc_caste_cert',
    name: 'Caste Certificate (SC/ST/OBC)',
    category: 'Category',
    description: 'Constitutional community verification certificate for quotas and scholarships.',
    officialSource: 'Issued by Sub-Divisional Officer / Tehsildar',
  },
  {
    id: 'doc_domicile',
    name: 'Domicile / Residence Certificate',
    category: 'Address',
    description: 'Statutory proof of continuous permanent residency in the state.',
    officialSource: 'State e-District portal / Citizen Service Center',
  },
  {
    id: 'doc_marksheet',
    name: 'Previous Academic Marksheet & Passing Certificate',
    category: 'Academic',
    description: 'Class 10/12/Degree marksheet for educational admissions and scholarships.',
    officialSource: 'DigiLocker / CBSE / State Board / University',
  },
  {
    id: 'doc_bank_passbook',
    name: 'Bank Account Passbook (Aadhaar Seeded)',
    category: 'Financial',
    description: 'Active savings bank account mapped on NPCI Aadhaar Payment Bridge.',
    officialSource: 'Nationalized Bank branch / IPPB Post Office',
  },
  {
    id: 'doc_ration_card',
    name: 'Ration Card (NFSA / Family ID)',
    category: 'Utility',
    description: 'Family entitlement card for food security and Ayushman Bharat linkage.',
    officialSource: 'State Food & Civil Supplies Department (PDS portal)',
  },
];

export const DocumentsCenter: React.FC = () => {
  const { documentReadiness, setDocumentReadinessState } = useApp();
  const { t } = useLanguage();

  const total = STANDARD_DOCS.length;
  const readyCount = STANDARD_DOCS.filter(
    (d) => (documentReadiness[d.id] || 'unsure') === 'ready'
  ).length;

  const readinessPercent = Math.round((readyCount / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-blue-900" />
            <span>{t('documents')} • Citizen Readiness Locker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Audit your essential statutory documents so you are instantly prepared for any government service.
          </p>
        </div>

        {/* Global Readiness Score */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Readiness Score
            </span>
            <span className="text-xl font-extrabold text-blue-950">
              {readinessPercent}%
            </span>
          </div>
          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Privacy Preserved:</strong> CivicAssist AI tracks your preparation state locally on your device. We NEVER store copies of your identity numbers or scans on public servers.
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STANDARD_DOCS.map((doc) => {
          const currentStatus: DocumentReadinessState =
            documentReadiness[doc.id] || 'unsure';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      currentStatus === 'ready'
                        ? 'text-emerald-700'
                        : currentStatus === 'missing'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {currentStatus === 'ready' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {currentStatus === 'missing' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {currentStatus === 'unsure' && <HelpCircle className="w-3.5 h-3.5" />}
                    <span className="uppercase text-[11px] font-bold">
                      {currentStatus === 'ready'
                        ? t('doc_ready')
                        : currentStatus === 'missing'
                        ? t('doc_missing')
                        : t('doc_unsure')}
                    </span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">
                  {doc.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {doc.description}
                </p>

                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <strong className="text-slate-700">Verified Issuer: </strong>
                  {doc.officialSource}
                </div>
              </div>

              {/* Status Switcher Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'ready')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    currentStatus === 'ready'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ✓ Ready
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'missing')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    currentStatus === 'missing'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ⚠ Missing
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'unsure')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    currentStatus === 'unsure'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ? Not Sure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
