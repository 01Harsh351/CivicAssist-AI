import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_LANGUAGES, LanguageInfo, DEFAULT_LANGUAGE, getLanguageByCode } from '../i18n/languages';
import { getTranslation, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  languageCode: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey) => string;
  allLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageCode, setLanguageCode] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('civicassist_language');
      return stored || DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageInfo>(() => getLanguageByCode(languageCode));

  useEffect(() => {
    const lang = getLanguageByCode(languageCode);
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('civicassist_language', languageCode);
      document.documentElement.lang = languageCode;
    } catch {
      // Storage unavailable
    }
  }, [languageCode]);

  const setLanguage = (code: string) => {
    setLanguageCode(code);
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(languageCode, key);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageCode,
        setLanguage,
        t,
        allLanguages: INDIAN_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
