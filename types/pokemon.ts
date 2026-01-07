export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  seriesCode: string;
  date: string;
  cardCount: number;
  icon: string;
}

export interface Card {
  id: number | string;
  name: string;
  number: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'rare-holo' | 'rare-ultra';
  type: 'pokemon' | 'trainer' | 'energy';
  setId?: string;
  setName?: string;
  setIcon?: string;
}

export interface PriceData {
  condition: string;
  priceRange: string;
  lastUpdated: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical';
export type Language = 'en' | 'es' | 'ja' | 'fr';
