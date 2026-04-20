import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language;

  return (
    <div className={`flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 ${className}`}>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
          currentLang.startsWith('en')
            ? 'bg-[#1B3C53] text-white shadow-sm'
            : 'text-gray-500 hover:text-[#1B3C53]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ne')}
        className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
          currentLang.startsWith('ne')
            ? 'bg-[#1B3C53] text-white shadow-sm'
            : 'text-gray-500 hover:text-[#1B3C53]'
        }`}
      >
        नेपाली
      </button>
    </div>
  );
};

export default LanguageToggle;
