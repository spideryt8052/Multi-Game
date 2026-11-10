import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi-en.json';

const LanguageContext = createContext();

const translationsMap = {
  en: enTranslations,
  hi: hiTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('arena_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (translationsMap[lang]) {
      setLanguageState(lang);
      localStorage.setItem('arena_lang', lang);
    }
  };

  // Helper function to resolve dot-notation paths like 'nav.home'
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translationsMap[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in Hinglish
        let enCurrent = translationsMap.en;
        for (const enKey of keys) {
          if (enCurrent && enCurrent[enKey] !== undefined) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return enCurrent;
      }
    }
    return current || fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

