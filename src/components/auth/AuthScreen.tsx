import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INDIAN_LANGUAGES } from '../../i18n/languages';
import { ShieldCheck, Languages } from 'lucide-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

interface AuthScreenProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const { languageCode, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [justSignedUp, setJustSignedUp] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const selectedLangInfo =
    INDIAN_LANGUAGES.find((l) => l.code === languageCode) || INDIAN_LANGUAGES[0];

  // Callback when registration succeeds
  const handleSignUpSuccess = (email: string) => {
    setPrefilledEmail(email);
    setJustSignedUp(true);
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Subtle Indian Tricolor Band */}
      <div className="w-full h-1.5 flex">
        <div className="flex-1 bg-amber-600"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-emerald-700"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-b from-slate-900 to-blue-950 text-white p-6 sm:p-8 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-200 text-xs font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Independent Citizen Public Service Navigator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              CivicAssist AI
            </h1>
            <p className="text-blue-200 text-sm sm:text-base mt-1.5 font-normal">
              {t('app_subtitle')}
            </p>

            {/* Language Quick Switch indicator */}
            <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Current UI: <strong className="text-white">{selectedLangInfo.nativeName}</strong>
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* SIGN IN VIEW */}
            {mode === 'login' && (
              <SignIn
                initialEmail={prefilledEmail}
                signupSuccess={justSignedUp}
                onSwitchToSignUp={() => {
                  setJustSignedUp(false);
                  setMode('signup');
                }}
                onSwitchToForgot={() => {
                  setJustSignedUp(false);
                  setMode('forgot');
                }}
              />
            )}

            {/* SIGN UP VIEW */}
            {mode === 'signup' && (
              <SignUp
                onSuccess={handleSignUpSuccess}
                onSwitchToSignIn={() => {
                  setMode('login');
                }}
              />
            )}

            {/* FORGOT PASSWORD VIEW */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Password Assistance</h2>
                <p className="text-xs text-slate-600">
                  Enter your registered email address or mobile number to receive a secure recovery code.
                </p>

                {forgotSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm space-y-2">
                    <p className="font-semibold">✓ Verification Link Dispatched</p>
                    <p>
                      A simulated reset link has been dispatched to <strong>{forgotEmail}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSent(false);
                        setMode('login');
                      }}
                      className="mt-2 text-xs font-bold text-blue-900 underline cursor-pointer"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setForgotSent(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Email / Mobile
                      </label>
                      <input
                        type="text"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. rajesh@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="w-1/3 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2 px-3 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-950 cursor-pointer"
                      >
                        Send Reset Instructions
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Disclaimer & Links */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-center space-y-2">
            <p className="text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {t('disclaimer_independent')}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600 pt-1">
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="hover:text-blue-900 hover:underline cursor-pointer"
              >
                {t('privacy_policy')}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onOpenTerms}
                className="hover:text-blue-900 hover:underline cursor-pointer"
              >
                {t('terms_of_use')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="text-center py-3 text-xs text-slate-500 bg-white border-t border-slate-200">
        CivicAssist AI • Built for Indian Citizens • 22 Constitutional Languages + English
      </footer>
    </div>
  );
};
export default AuthScreen;
