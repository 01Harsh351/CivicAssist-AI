import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../supabaseClient.js';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (emailOrMobile: string, password: string) => Promise<{ success: boolean; hasSession: boolean; error?: string }>;
  signup: (details: {
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    language: string;
  }) => Promise<{ success: boolean; hasSession: boolean; user?: UserProfile; error?: string }>;
  continueWithGoogle: () => Promise<UserProfile>;
  logout: () => void;
  updateUserLanguage: (language: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'civicassist_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
    return null;
  });

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const isAuthenticated = Boolean(currentUser);

  // Protect private pages with supabase.auth.getSession()
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const user: UserProfile = {
            id: session.user.id,
            fullName: userMeta.full_name || session.user.email?.split('@')[0] || 'Citizen User',
            email: session.user.email || '',
            mobile: userMeta.mobile || '',
            language: userMeta.language || localStorage.getItem('civicassist_language') || 'en',
            createdDate: session.user.created_at || new Date().toISOString(),
          };
          if (isMounted) {
            setCurrentUser(user);
          }
        } else {
          // If no session exists, redirect to /login
          if (isMounted) {
            setCurrentUser(null);
            if (window.location.pathname !== '/login') {
              window.history.replaceState({}, '', '/login');
            }
          }
        }
      } catch (err) {
        console.warn('Failed to verify Supabase session:', err);
        if (isMounted) {
          setCurrentUser(null);
          if (window.location.pathname !== '/login') {
            window.history.replaceState({}, '', '/login');
          }
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    // Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        const user: UserProfile = {
          id: session.user.id,
          fullName: userMeta.full_name || session.user.email?.split('@')[0] || 'Citizen User',
          email: session.user.email || '',
          mobile: userMeta.mobile || '',
          language: userMeta.language || localStorage.getItem('civicassist_language') || 'en',
          createdDate: session.user.created_at || new Date().toISOString(),
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        if (window.location.pathname !== '/login') {
          window.history.replaceState({}, '', '/login');
        }
      }
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to write user session', e);
    }
  }, [currentUser]);

  const login = async (emailOrMobile: string, password: string): Promise<{ success: boolean; hasSession: boolean; error?: string }> => {
    if (!emailOrMobile.trim()) {
      return { success: false, hasSession: false, error: 'Email or mobile number is required.' };
    }

    const email = emailOrMobile.includes('@')
      ? emailOrMobile.trim()
      : `${emailOrMobile.trim()}@citizen.in`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, hasSession: false, error: error.message };
      }

      // Check if a real session exists
      const hasRealSession = Boolean(data?.session);
      if (!hasRealSession) {
        return {
          success: false,
          hasSession: false,
          error: 'Check your email and confirm your account before logging in.',
        };
      }

      const user: UserProfile = {
        id: data.user?.id || `usr-${Date.now()}`,
        fullName: data.user?.user_metadata?.full_name || email.split('@')[0] || 'Citizen User',
        email: data.user?.email || email,
        mobile: data.user?.user_metadata?.mobile || (emailOrMobile.includes('@') ? '+91 98765 43210' : emailOrMobile),
        language: data.user?.user_metadata?.language || localStorage.getItem('civicassist_language') || 'en',
        createdDate: data.user?.created_at || new Date().toISOString(),
      };

      setCurrentUser(user);
      return { success: true, hasSession: true };
    } catch (err: any) {
      return { success: false, hasSession: false, error: err?.message || 'Sign in failed.' };
    }
  };

  const signup = async (details: {
    fullName: string;
    email: string;
    mobile: string;
    password?: string;
    language: string;
  }): Promise<{ success: boolean; hasSession: boolean; user?: UserProfile; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: details.email.trim(),
        password: details.password || '',
        options: {
          data: {
            full_name: details.fullName.trim(),
            mobile: details.mobile.trim(),
            language: details.language,
          },
        },
      });

      if (error) {
        return { success: false, hasSession: false, error: error.message };
      }

      // If data.session is null, don't set user or log in
      if (!data.session) {
        return {
          success: true,
          hasSession: false,
          error: undefined,
        };
      }

      // If a real session exists immediately (email confirmation off):
      const user: UserProfile = {
        id: data.user?.id || `usr-${Date.now()}`,
        fullName: details.fullName.trim(),
        email: details.email.trim(),
        mobile: details.mobile.trim(),
        language: details.language,
        createdDate: data.user?.created_at || new Date().toISOString(),
      };

      setCurrentUser(user);
      return { success: true, hasSession: true, user };
    } catch (err: any) {
      return { success: false, hasSession: false, error: err?.message || 'Sign up failed.' };
    }
  };

  const continueWithGoogle = async (): Promise<UserProfile> => {
    const user: UserProfile = {
      id: `usr-g-${Date.now()}`,
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      mobile: '+91 98201 12345',
      language: localStorage.getItem('civicassist_language') || 'en',
      createdDate: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
    setCurrentUser(null);
    if (window.location.pathname !== '/login') {
      window.history.replaceState({}, '', '/login');
    }
  };

  const updateUserLanguage = (language: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        language,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isCheckingSession,
        login,
        signup,
        continueWithGoogle,
        logout,
        updateUserLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
