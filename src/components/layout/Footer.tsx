import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Globe2, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenLanguageModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenLanguageModal,
}) => {
  const { currentLanguage, t } = useLanguage();
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Tricolor Stripe */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-amber-600"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-emerald-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-base">
                CA
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CivicAssist <span className="text-amber-500 font-black">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Smart Public Service Navigator helping Indian citizens discover statutory schemes, assess eligibility, prepare required documents, and navigate directly to verified official government portals.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] text-amber-300 max-w-lg leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Independence Disclosure:</strong> {t('disclaimer_independent')}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Citizen Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('find_service')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t('find_service')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my_applications')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t('my_applications')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t('documents')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 text-slate-400 transition cursor-pointer"
                >
                  Anonymous Public Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Languages & Compliance */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Multilingual Access
            </h4>
            <p className="text-slate-400 text-[11px]">
              Available in all 22 constitutionally recognized languages of India + English.
            </p>
            <button
              onClick={onOpenLanguageModal}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Switch Language ({currentLanguage.nativeName})</span>
            </button>

            <div className="pt-3 flex flex-wrap gap-3 text-xs text-slate-400">
              <button onClick={onOpenPrivacy} className="hover:text-white hover:underline cursor-pointer">
                {t('privacy_policy')}
              </button>
              <span>•</span>
              <button onClick={onOpenTerms} className="hover:text-white hover:underline cursor-pointer">
                {t('terms_of_use')}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} CivicAssist AI • Independent Citizen Assistance Platform
          </span>
          <span className="flex items-center gap-1">
            Dedicated to empowered, digitally inclusive Indian citizens
          </span>
        </div>
      </div>
    </footer>
  );
};
