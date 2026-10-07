import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INDIAN_LANGUAGES } from '../../i18n/languages';
import { supabase } from '../../supabaseClient.js';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SignUpProps {
  onSuccess: (email: string) => void;
  onSwitchToSignIn: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const { languageCode, setLanguage, t } = useLanguage();

  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [selectedLangCode, setSelectedLangCode] = useState(languageCode);
  const [langSearchQuery, setLangSearchQuery] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 validation
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!fullName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!signupMobile.trim() || signupMobile.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }

    setSignupStep(2);
  };

  // Filtered languages for step 2
  const filteredLanguages = INDIAN_LANGUAGES.filter(
    (l) =>
      l.nameEn.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearchQuery.toLowerCase())
  );

  const selectedLangInfo =
    INDIAN_LANGUAGES.find((l) => l.code === selectedLangCode) || INDIAN_LANGUAGES[0];

  // Handle Sign Up with Supabase Auth: signUp({ email, password })
  const handleCompleteSignup = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      setLanguage(selectedLangCode);

      const trimmedEmail = signupEmail.trim();

      // 1) Execute Supabase Auth signUp
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName.trim(),
            mobile: signupMobile.trim(),
            language: selectedLangCode,
          },
        },
      });

      // Handle basic error if signup fails
      if (error) {
        setAuthError(error.message);
        return;
      }

      // 2) Ensure user is NOT auto-logged in even if Supabase returns a session
      if (data?.session) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Sign out after signup notice:', e);
        }
      }

      // 3) Update browser URL with query param for persistence/deep linking
      const params = new URLSearchParams(window.location.search);
      params.set('email', trimmedEmail);
      params.set('registered', 'true');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);

      // 4) Redirect to Sign In page with email pre-filled
      onSuccess(trimmedEmail);
    } catch (err: any) {
      setAuthError(err?.message || 'Could not complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Stepper Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span className={signupStep === 1 ? 'text-blue-900 font-bold' : ''}>
            {t('step_basic_details')}
          </span>
          <span className={signupStep === 2 ? 'text-blue-900 font-bold' : ''}>
            {t('step_language')}
          </span>
          <span className={signupStep === 3 ? 'text-blue-900 font-bold' : ''}>
            {t('step_confirmation')}
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-800 h-full transition-all duration-300"
            style={{
              width: signupStep === 1 ? '33%' : signupStep === 2 ? '66%' : '100%',
            }}
          ></div>
        </div>
      </div>

      {/* Global Error Banner */}
      {authError && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{authError}</span>
        </div>
      )}

      {/* SIGNUP STEP 1: BASIC DETAILS */}
      {signupStep === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('full_name')} *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setAuthError(null);
              }}
              placeholder="e.g. Ramesh Chandra Sharma"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="citizen@example.in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={signupMobile}
                  onChange={(e) => {
                    setSignupMobile(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>Privacy First:</strong> We do NOT ask for or store Aadhaar numbers or bank accounts.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('password')} *
              </label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  setAuthError(null);
                }}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('confirm_password')} *
              </label>
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => {
                  setSignupConfirmPassword(e.target.value);
                  setAuthError(null);
                }}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="w-1/3 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              {t('back')}
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-3 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('next_step')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* SIGNUP STEP 2: LANGUAGE PREFERENCE */}
      {signupStep === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('language_preference_title')}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {t('language_preference_question')}
            </p>
          </div>

          {/* Search box for languages */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={langSearchQuery}
              onChange={(e) => setLangSearchQuery(e.target.value)}
              placeholder={t('search_language')}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 23 Languages Grid */}
          <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/50">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLangCode === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLangCode(lang.code);
                    setLanguage(lang.code);
                  }}
                  className={`p-2.5 rounded-lg text-left transition flex items-center justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                      : 'bg-white hover:bg-blue-50/60 text-slate-800 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{lang.nativeName}</div>
                    <div
                      className={`text-[11px] ${
                        isSelected ? 'text-blue-200' : 'text-slate-500'
                      }`}
                    >
                      {lang.nameEn}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Selected Language: <strong>{selectedLangInfo.nameEn} ({selectedLangInfo.nativeName})</strong>
            </span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setSignupStep(1)}
              className="w-1/3 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              {t('back')}
            </button>
            <button
              type="button"
              onClick={() => setSignupStep(3)}
              className="w-2/3 py-2.5 px-3 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('next_step')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP STEP 3: CONFIRMATION */}
      {signupStep === 3 && (
        <div className="space-y-4">
          <div className="text-center py-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Confirm Registration Details
            </h3>
            <p className="text-xs text-slate-600">
              Review your profile before entering CivicAssist AI
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Citizen Name:</span>
              <strong className="text-slate-900">{fullName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Email:</span>
              <strong className="text-slate-900">{signupEmail}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Mobile:</span>
              <strong className="text-slate-900">{signupMobile}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Selected Language:</span>
              <strong className="text-blue-900">
                {selectedLangInfo.nameEn} ({selectedLangInfo.nativeName})
              </strong>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
            By proceeding, you acknowledge that CivicAssist AI is an independent citizen-guidance platform and not an official government entity.
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setSignupStep(2)}
              className="w-1/3 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              {t('back')}
            </button>
            <button
              type="button"
              onClick={handleCompleteSignup}
              disabled={isSubmitting}
              className="w-2/3 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('create_account_btn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
