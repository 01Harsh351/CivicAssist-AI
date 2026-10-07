import React from 'react';
import { PublicService, DocumentReadinessState } from '../../types';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface DocumentReadinessEngineProps {
  service: PublicService;
}

export const DocumentReadinessEngine: React.FC<DocumentReadinessEngineProps> = ({ service }) => {
  const { documentReadiness, setDocumentReadinessState } = useApp();
  const { t } = useLanguage();

  const totalDocs = service.requiredDocuments.length;
  let readyCount = 0;
  let missingDoc: string | null = null;

  service.requiredDocuments.forEach((doc) => {
    const st = documentReadiness[doc.id] || 'unsure';
    if (st === 'ready') {
      readyCount++;
    } else if (st === 'missing' && !missingDoc) {
      missingDoc = doc.name;
    }
  });

  if (!missingDoc && readyCount < totalDocs) {
    const firstUnready = service.requiredDocuments.find(
      (d) => (documentReadiness[d.id] || 'unsure') !== 'ready'
    );
    if (firstUnready) {
      missingDoc = firstUnready.name;
    }
  }

  // Dynamic Next Action Text
  let nextActionText = '';
  if (readyCount === totalDocs) {
    nextActionText = 'All required documents are ready. You can proceed directly to the verified official portal.';
  } else if (missingDoc) {
    nextActionText = `Obtain your ${missingDoc} before starting the application.`;
  } else {
    nextActionText = 'Verify remaining documents to ensure rejection-free application processing.';
  }

  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-900" />
            <span>{t('document_readiness')}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark your documents to prevent portal rejection due to missing paperwork.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-blue-950">
            {readyCount} of {totalDocs} {t('docs_ready_count')}
          </span>
          <div className="w-36 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-300 ${
                readyCount === totalDocs ? 'bg-emerald-600' : 'bg-blue-800'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dynamic Next Action Callout (Requirement #9) */}
      <div className="p-3.5 rounded-xl bg-blue-100/70 border border-blue-200 text-blue-950 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-800 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="block font-bold uppercase tracking-wider text-[11px] text-blue-900 mb-0.5">
            {t('your_next_action')}:
          </strong>
          <span className="font-medium text-slate-800">{nextActionText}</span>
        </div>
      </div>

      {/* Document Checklist Rows */}
      <div className="space-y-3">
        {service.requiredDocuments.map((doc) => {
          const currentStatus: DocumentReadinessState =
            documentReadiness[doc.id] || 'unsure';

          return (
            <div
              key={doc.id}
              className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {doc.name}
                  </span>
                  {doc.isMandatory ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      Required
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-0.5">{doc.description}</p>
                <div className="mt-1 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Where to obtain: </strong>
                  {doc.howToObtain}
                </div>
              </div>

              {/* Status Selector Buttons (Ready / Missing / Unsure) */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'ready')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer ${
                    currentStatus === 'ready'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('doc_ready')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'missing')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer ${
                    currentStatus === 'missing'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('doc_missing')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDocumentReadinessState(doc.id, 'unsure')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium border transition flex items-center gap-1 cursor-pointer ${
                    currentStatus === 'unsure'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('doc_unsure')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
