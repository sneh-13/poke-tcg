'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { Language } from '@/types/pokemon';
import { languageFlags, languageNames } from '@/data/translations';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = ['en', 'es', 'ja', 'fr'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span>{languageFlags[language]}</span>
        <span className="text-sm font-medium">{language.toUpperCase()}</span>
        <span className="text-[0.65rem]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-elevated min-w-[180px] overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                language === lang ? 'bg-poke-blue-light' : ''
              }`}
            >
              <span>{languageFlags[lang]}</span>
              <span className="text-sm">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
