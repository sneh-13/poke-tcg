'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { pokemonSets } from '@/data/sets';
import { getSampleCards } from '@/data/sampleCards';
import { useTranslation } from '@/contexts/I18nContext';

export default function SetPage() {
  const params = useParams();
  const setId = params.id as string;
  const { t } = useTranslation();

  const set = pokemonSets.find((s) => s.id === setId);
  const cards = getSampleCards(setId, set?.cardCount || 20);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredCards = useMemo(() => {
    let filtered = cards;

    if (searchQuery) {
      filtered = filtered.filter((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRarities.length > 0) {
      filtered = filtered.filter((card) => selectedRarities.includes(card.rarity));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((card) => selectedTypes.includes(card.type));
    }

    return filtered;
  }, [cards, searchQuery, selectedRarities, selectedTypes]);

  if (!set) {
    return <div className="p-8">Set not found</div>;
  }

  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside className="sticky top-[70px] left-0 h-[calc(100vh-70px)] w-[280px] glass-sidebar p-6 overflow-y-auto hidden lg:block">
          <div className="mb-6">
            <input
              type="text"
              placeholder={t('set.search_cards')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
            />
          </div>

          {/* Rarity Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Rarity</h3>
            <div className="space-y-2">
              {['common', 'uncommon', 'rare', 'rare-holo', 'rare-ultra'].map((rarity) => (
                <label key={rarity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRarities.includes(rarity)}
                    onChange={() => toggleRarity(rarity)}
                    className="w-4 h-4 text-poke-blue border-gray-300 rounded focus:ring-poke-blue"
                  />
                  <span className="text-sm text-gray-700 capitalize">{rarity.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Type</h3>
            <div className="space-y-2">
              {['pokemon', 'trainer', 'energy'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 text-poke-blue border-gray-300 rounded focus:ring-poke-blue"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Link href="/" className="text-poke-blue hover:underline mb-4 inline-block">
            {t('set.back_to_sets')}
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-charcoal mb-2">{set.name}</h1>
            <p className="text-gray-600">
              {set.series} • {set.date} • {set.cardCount} cards
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCards.map((card) => (
              <Link
                key={card.id}
                href={`/card/${setId}/${card.id}`}
                className="glass-card p-3 hover:shadow-hover transition-all group"
              >
                <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-sm text-gray-400">{card.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-charcoal group-hover:text-poke-blue transition-colors line-clamp-1">
                  {card.name}
                </h3>
                <p className="text-xs text-gray-500 capitalize">{card.rarity.replace('-', ' ')}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
