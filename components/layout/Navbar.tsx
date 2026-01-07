'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/contexts/I18nContext';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[70px] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-8 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="text-2xl">⚡</span>
          <span className="text-2xl font-extrabold text-charcoal tracking-tight hover:text-poke-blue-text transition-colors">
            PokéTCG
          </span>
          <span className="bg-poke-blue-light text-poke-blue text-[0.65rem] font-bold px-2 py-1 rounded">
            Beta
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`text-sm font-medium transition-all px-4 py-2.5 rounded-lg ${
              pathname === '/'
                ? 'text-poke-blue-text bg-poke-blue-light font-semibold'
                : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/collection"
            className={`text-sm font-medium transition-all px-4 py-2.5 rounded-lg ${
              pathname === '/collection'
                ? 'text-poke-blue-text bg-poke-blue-light font-semibold'
                : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
            }`}
          >
            {t('nav.collection')}
          </Link>
          <Link
            href="/account"
            className={`text-sm font-medium transition-all px-4 py-2.5 rounded-lg ${
              pathname === '/account'
                ? 'text-poke-blue-text bg-poke-blue-light font-semibold'
                : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
            }`}
          >
            {t('nav.account')}
          </Link>
          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}
