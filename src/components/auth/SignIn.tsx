import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../supabaseClient.js';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface SignInProps {
  initialEmail?: string;
  signupSuccess?: boolean;
  onSwitchToSignUp: () => void;
  onSwitchToForgot: () => void;
}

export const SignIn: React.FC<SignInProps> = ({
  initialEmail = '',
  signupSuccess = false,
  onSwitchToSignUp,
  onSwitchToForgot,
}) => {
  const { login, continueWithGoogle } = useAuth();
  const { t } = useLanguage();

  // Read email and registered flag from props or query parameter
  const [loginIdentifier, setLoginIdentifier] = useState(() => {
    if (initialEmail) return initialEmail;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('email') || '';
    }
    return '';
  });

  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success message when coming from successful registration
  const [successMessage, setSuccessMessage] = useState<string | null>(() => {
    if (signupSuccess) {
      return 'Your account has been created. Please check your email and verify your address before logging in.';
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        return 'Your account has been created. Please check your email and verify your address before logging in.';
      }
    }
    return null;
  });

  // Keep email in sync if prop changes
  useEffect(() => {
    if (initialEmail) {
      setLoginIdentifier(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (signupSuccess) {
      setSuccessMessage(
        'Your account has been created. Please check your email and verify your address before logging in.'
      );
    }
  }, [signupSuccess]);

  // Handle Sign In with Supabase Auth: signInWithPassword({ email, password })
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setAuthError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const email = loginIdentifier.includes('@')
        ? loginIdentifier.trim()
        : `${loginIdentifier.trim()}@citizen.in`;

      // Supabase Auth call
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Check if real session exists
      if (!data?.session) {
        setAuthError('Check your email and confirm your account before logging in.');
        return;
      }

      // Sync into AuthContext
      const loginRes = await login(email, loginPassword);
      if (!loginRes.success && loginRes.error) {
        setAuthError(loginRes.error);
        return;
      }

      // Clear query params and redirect to Home ("/")
      window.history.pushState({}, '', '/');
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await continueWithGoogle();
      window.history.pushState({}, '', '/');
    } catch {
      setAuthError('Google sign in encountered an issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">{t('login')}</h2>
        <span className="text-xs text-slate-500">Citizen Sign-in</span>
      </div>

      {/* Clear success message above the form when user comes from successful signup */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-900 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
          <span className="font-medium leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {authError && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {t('email_or_mobile')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={loginIdentifier}
              onChange={(e) => {
                setLoginIdentifier(e.target.value);
                setAuthError(null);
              }}
              placeholder="e.g. rajesh@example.com or 9876543210"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {t('password')}
            </label>
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                onSwitchToForgot();
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium"
            >
              {t('forgot_password')}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setAuthError(null);
              }}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span>{t('login')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {authError && (
          <p className="mt-2 text-xs text-red-600 font-medium text-center">
            {authError}
          </p>
        )}
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-500 uppercase tracking-wider">or</span>
        </div>
      </div>

      {/* Continue with Google button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-3 transition cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{t('continue_with_google')}</span>
      </button>

      {/* Switch to Signup */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600 mb-2">New to CivicAssist AI?</p>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="w-full py-2 px-3 rounded-lg border border-blue-600 text-blue-800 hover:bg-blue-50 text-sm font-semibold transition cursor-pointer"
        >
          {t('create_new_account')}
        </button>
      </div>
    </div>
  );
};
