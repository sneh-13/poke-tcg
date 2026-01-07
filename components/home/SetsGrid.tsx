'use client';

import Link from 'next/link';
import { PokemonSet } from '@/types/pokemon';
import { useTranslation } from '@/contexts/I18nContext';
import { getLogoPath } from '@/lib/getLogoPath';
import { useMemo } from 'react';

interface SetsGridProps {
  sets: PokemonSet[];
}

export default function SetsGrid({ sets }: SetsGridProps) {
  const { t } = useTranslation();

  // Group sets by series
  const groupedSets = useMemo(() => {
    const groups: Record<string, PokemonSet[]> = {};
    sets.forEach((set) => {
      if (!groups[set.series]) {
        groups[set.series] = [];
      }
      groups[set.series].push(set);
    });
    return groups;
  }, [sets]);

  if (sets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sets found matching your filters.</p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(groupedSets).map(([seriesName, seriesSets]) => (
        <div key={seriesName} className="mb-8">
          {/* Series Title */}
          <h3 className="text-xl font-semibold text-poke-blue flex items-center gap-4 my-8">
            {seriesName}
            <span className="flex-1 h-px bg-gradient-to-r from-poke-blue to-transparent"></span>
          </h3>

          {/* Sets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {seriesSets.map((set) => (
              <Link
                key={set.id}
                href={`/set/${set.id}`}
                className="relative bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden group flex flex-col items-center text-center min-h-[200px] hover:-translate-y-1 hover:border-poke-blue"
                style={{
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 168, 204, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                }}
              >
                {/* Yellow gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 197, 15, 0.16) 100%)'
                  }}
                />

                {/* Logo container */}
                <div className="flex-1 flex items-center justify-center w-full mb-4 relative z-10">
                  <img
                    src={getLogoPath(set)}
                    alt={`${set.name} logo`}
                    className="max-w-[240px] max-h-[120px] object-contain transition-transform duration-300 group-hover:scale-[1.08]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-2xl font-bold text-gray-300">${set.icon}</div>`;
                      }
                    }}
                  />
                </div>

                <h3 className="text-xs font-medium text-gray-500 mb-3 text-center leading-tight line-clamp-2 relative z-10">
                  {set.name}
                </h3>

                <div className="flex justify-center gap-4 text-xs text-gray-500 w-full relative z-10">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold text-[0.75rem]">
                    {set.cardCount} {t('sets.cards_count')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
