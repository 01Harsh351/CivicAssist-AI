import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Sparkles, AlertCircle } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAnalyzed: (extractedNeed: string) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAnalyzed,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<{
    docType: string;
    extractedNeed: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulatedUpload = (sampleType: 'college_receipt' | 'hospital_bill' | 'electricity_bill') => {
    setAnalyzing(true);
    setAnalyzedResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      if (sampleType === 'college_receipt') {
        setAnalyzedResult({
          docType: 'College Admission Fee Demand Notice',
          extractedNeed: 'Need financial aid / scholarship and income certificate for college semester fees.',
        });
      } else if (sampleType === 'hospital_bill') {
        setAnalyzedResult({
          docType: 'Hospital Treatment Estimate Slip',
          extractedNeed: 'Ayushman Bharat PM-JAY cashless hospitalization coverage for family member.',
        });
      } else {
        setAnalyzedResult({
          docType: 'State Electricity Residential Bill',
          extractedNeed: 'Need residence / domicile certificate and address verification.',
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-base">
              Document Need Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Upload any notice, fee slip, or letter. CivicAssist analyzes the document content to identify the exact public service you need.
        </p>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/70 hover:bg-blue-50/40 transition">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            Drag & drop document (PDF, PNG, JPEG)
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Privacy notice: Do not upload sensitive numbers (Aadhaar/PAN).
          </p>
        </div>

        {/* Demo Quick-Select Documents */}
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Or try with sample citizen notices:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulatedUpload('college_receipt')}
              className="p-2 border border-slate-200 hover:border-blue-700 rounded-lg text-left text-xs bg-white hover:bg-blue-50/50 transition cursor-pointer"
            >
              <span className="font-semibold text-slate-800 block truncate">College Fee Notice</span>
              <span className="text-[10px] text-slate-500">Scholarship & Fee</span>
            </button>
            <button
              onClick={() => handleSimulatedUpload('hospital_bill')}
              className="p-2 border border-slate-200 hover:border-blue-700 rounded-lg text-left text-xs bg-white hover:bg-blue-50/50 transition cursor-pointer"
            >
              <span className="font-semibold text-slate-800 block truncate">Hospital Estimate</span>
              <span className="text-[10px] text-slate-500">Ayushman Bharat</span>
            </button>
            <button
              onClick={() => handleSimulatedUpload('electricity_bill')}
              className="p-2 border border-slate-200 hover:border-blue-700 rounded-lg text-left text-xs bg-white hover:bg-blue-50/50 transition cursor-pointer"
            >
              <span className="font-semibold text-slate-800 block truncate">Utility Power Bill</span>
              <span className="text-[10px] text-slate-500">Domicile Proof</span>
            </button>
          </div>
        </div>

        {/* Processing State */}
        {analyzing && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center text-xs text-blue-900 font-medium flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></span>
            <span>Inspecting document text for government service matching...</span>
          </div>
        )}

        {/* Analyzed Result */}
        {analyzedResult && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Identified: {analyzedResult.docType}</span>
            </div>
            <p className="text-slate-700 font-medium">
              "{analyzedResult.extractedNeed}"
            </p>
            <button
              onClick={() => {
                onDocumentAnalyzed(analyzedResult.extractedNeed);
                onClose();
              }}
              className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Navigator with this Need</span>
            </button>
          </div>
        )}

        <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>Documents are parsed strictly for service intent identification and are never stored on public servers.</span>
        </div>
      </div>
    </div>
  );
};
