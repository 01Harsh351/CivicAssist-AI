import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_LANGUAGES } from '../../i18n/languages';
import { X, Search, CheckCircle2, Globe2 } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { languageCode, setLanguage, t } = useLanguage();
  const { updateUserLanguage } = useAuth();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = INDIAN_LANGUAGES.filter(
    (l) =>
      l.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.script.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: string) => {
    setLanguage(code);
    updateUserLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t('language_preference_title')}
              </h3>
              <p className="text-xs text-slate-500">
                22 Constitutional Languages of India + English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_language')}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((lang) => {
            const isSelected = languageCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-blue-900 bg-blue-900 text-white shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-800'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm">{lang.nativeName}</div>
                  <div className={`text-xs ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                    {lang.nameEn} • {lang.script}
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Application interface and AI assistance will update immediately upon selection.
        </div>
      </div>
    </div>
  );
};
