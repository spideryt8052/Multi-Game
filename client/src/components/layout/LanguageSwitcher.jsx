import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center bg-dark-card border border-dark-border rounded-full p-0.5 text-xs font-semibold shadow-inner">
      <div className="pl-2 pr-1 text-slate-400 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-brand-emerald text-black font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'hi'
            ? 'bg-brand-emerald text-black font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to Hinglish"
      >
        HINGLISH
      </button>
    </div>
  );
};

export default LanguageSwitcher;

