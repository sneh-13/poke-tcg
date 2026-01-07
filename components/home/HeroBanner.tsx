'use client';

import { useTranslation } from '@/contexts/I18nContext';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-white overflow-visible border-b border-gray-200" style={{
      background: 'radial-gradient(circle at top right, #F8F9FA, #FFFFFF)',
      padding: '3rem 0'
    }}>
      {/* Decorative background blur */}
      <div className="absolute -top-1/2 -right-1/5 w-[800px] h-[800px] pointer-events-none opacity-80 blur-[40px] z-0"
        style={{
          background: 'radial-gradient(circle, rgba(255, 197, 15, 0.3) 0%, rgba(0, 168, 204, 0.05) 40%, transparent 70%)'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-8 relative z-10 flex items-center justify-between gap-16">
        {/* Hero Text */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.1] mb-6 text-charcoal" style={{ letterSpacing: '-1px' }}>
            All Pokémon TCG Sets,<br />Organized for Collectors
          </h1>
          <p className="text-xl mb-10 text-gray-600 max-w-[650px]">
            Browse every set, filter by series or year, and click to explore cards.
          </p>
          <div>
            <button
              onClick={() => window.scrollTo({ top: 580, behavior: 'smooth' })}
              className="text-white border-none px-10 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300"
              style={{
                background: '#00A8CC',
                boxShadow: '0 4px 14px rgba(0, 168, 204, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0089A8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 168, 204, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00A8CC';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 168, 204, 0.3)';
              }}
            >
              Explore Sets
            </button>
          </div>
        </div>

        {/* Floating Card */}
        <div className="hidden md:block relative">
          <div
            className="w-[310px] h-[420px] relative rounded-[14px] border-8 border-white transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #222 0%, #333 100%)',
              boxShadow: '-20px 20px 40px rgba(0, 0, 0, 0.2)',
              transform: 'rotateY(-15deg) rotateX(10deg)',
              marginLeft: '80px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateY(-15deg) rotateX(10deg)';
            }}
          >
            <img
              src="/images/UI-Pictures/card_back.png"
              alt="Pokemon Card Back"
              className="w-full h-full object-cover rounded-[6px]"
              onError={(e) => {
                e.currentTarget.src = 'https://assets.pokemon.com/static2/_ui/img/global/footer/pokemon_tcg_card_back.png';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
