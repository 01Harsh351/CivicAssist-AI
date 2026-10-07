import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { SAMPLE_CITIZEN_QUERIES } from '../../data/sampleQueries';
import { ServiceCategory } from '../../types';
import {
  Search,
  Mic,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ArrowDownCircle,
  Award,
  GraduationCap,
  HeartPulse,
  CreditCard,
  Briefcase,
  Store,
  Clock,
  Car,
  Home,
  FileCheck,
  MoreHorizontal,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenVoiceModal: () => void;
  onOpenUploadModal: () => void;
}

const CATEGORIES: { label: ServiceCategory; icon: React.FC<{ className?: string }> }[] = [
  { label: 'Certificates', icon: Award },
  { label: 'Education', icon: GraduationCap },
  { label: 'Scholarships', icon: GraduationCap },
  { label: 'Healthcare', icon: HeartPulse },
  { label: 'Identity', icon: CreditCard },
  { label: 'Employment', icon: Briefcase },
  { label: 'Business', icon: Store },
  { label: 'Pension', icon: Clock },
  { label: 'Transport', icon: Car },
  { label: 'Housing', icon: Home },
  { label: 'Utility Services', icon: FileCheck },
  { label: 'Other', icon: MoreHorizontal },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVoiceModal,
  onOpenUploadModal,
}) => {
  const { languageCode, t } = useLanguage();
  const {
    performAISearch,
    isSearching,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    aiResult,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery || '');

  // Dynamic placeholders by language
  const getDynamicPlaceholder = (): string => {
    switch (languageCode) {
      case 'hi':
        return 'उदा. मुझे कॉलेज स्कॉलरशिप के लिए आय प्रमाण पत्र चाहिए...';
      case 'bn':
        return 'যেমন: কলেজের বৃত্তির জন্য আমার আয়ের শংসাপত্র দরকার...';
      case 'te':
        return 'ఉదా. నా కాలేజ్ స్కాలర్షిప్ కోసం ఆదాయ ధృవీకరణ పత్రం కావాలి...';
      case 'ta':
        return 'எ.கா. கல்லூரி கல்வி உதவித்தொகைக்கு வருமானச் சான்றிதழ் தேவை...';
      case 'mr':
        return 'उदा. मला कॉलेज स्कॉलरशिपसाठी उत्पन्नाचा दाखला हवा आहे...';
      case 'gu':
        return 'દા.ત. મને કૉલેજ શિષ્યવૃત્તિ માટે આવકનું પ્રમાણપત્ર જોઈએ છે...';
      default:
        return 'e.g. I need an income certificate for my college scholarship...';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      performAISearch(inputVal.trim());
    }
  };

  const handleSampleClick = (text: string) => {
    setInputVal(text);
    performAISearch(text);
  };

  // Filter sample queries: show relevant ones for current language first, or all
  const displayedSamples = SAMPLE_CITIZEN_QUERIES.filter(
    (q) => q.langCode === languageCode
  );
  const sampleList = displayedSamples.length > 0 ? displayedSamples : SAMPLE_CITIZEN_QUERIES.slice(0, 4);

  return (
    <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Indian Public Portal Geometric Accents */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Government Schemes & Document Readiness Engine</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t('how_can_we_help')}
        </h1>

        {/* Subheading */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          {t('hero_subtitle')}
        </p>

        {/* Large AI Search Input Box */}
        <div className="pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-slate-200 max-w-3xl mx-auto text-slate-900"
          >
            <div className="flex items-center gap-2 px-2">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={getDynamicPlaceholder()}
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  title="Speak in your native language"
                >
                  <Mic className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t('voice_input')}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenUploadModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  title="Upload receipt or notice"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">{t('upload_document')}</span>
                  <span className="sm:hidden">Upload</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching || !inputVal.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t('processing')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('ask_civicassist')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Realistic Prompt Chips for Easy Demonstration */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Popular Indian citizen queries:</span>
            {sampleList.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleClick(sample.queryText)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition cursor-pointer text-[11px] truncate max-w-xs"
              >
                "{sample.queryText}"
              </button>
            ))}
          </div>

          {/* Quick jump to results indicator */}
          {aiResult && (
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('service-results');
                  if (el) {
                    const yOffset = -80;
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-300 text-xs font-bold transition shadow-xs cursor-pointer animate-pulse"
              >
                <span>Results Ready • View Matched Services Below</span>
                <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Categories Bar */}
        <div className="pt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            {t('quick_categories')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(({ label, icon: Icon }) => {
              const isSelected = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveCategory(isSelected ? null : label);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-blue-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
