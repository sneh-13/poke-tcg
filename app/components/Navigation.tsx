'use client';

import Link from 'next/link';
import { useState } from 'react';

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
];

export default function Navigation() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-[70px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl filter drop-shadow-md">⚡</span>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-cyan-600 transition-colors">
            PokéTCG
          </span>
          <span className="text-[0.65rem] font-bold bg-cyan-50 text-cyan-600 px-2 py-1 rounded uppercase tracking-wider">
            Beta
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            Home
          </Link>
          <Link
            href="/collection"
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            Collection
          </Link>
          <Link
            href="/account"
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            Account
          </Link>

          {/* Language Selector */}
          <div className="relative ml-4">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <span className="text-lg">{currentLang.flag}</span>
              <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
              <span className="text-[0.65rem]">▼</span>
            </button>

            {languageOpen && (
              <div className="absolute top-full right-0 mt-2 bg-gray-50 border border-gray-200 rounded-xl p-2 min-w-[150px] shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      currentLang.code === lang.code
                        ? 'bg-amber-50 text-amber-800'
                        : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
