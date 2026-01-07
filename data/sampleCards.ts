import { Card } from '@/types/pokemon';

// Generate sample cards for a set
export function generateSampleCards(setId: string, count: number = 20): Card[] {
  const cards: Card[] = [];
  const rarities: Card['rarity'][] = ['common', 'uncommon', 'rare', 'rare-holo', 'rare-ultra'];
  const types: Card['type'][] = ['pokemon', 'trainer', 'energy'];

  const pokemonNames = [
    'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
    'Lugia', 'Ho-Oh', 'Rayquaza', 'Groudon', 'Kyogre', 'Dialga',
    'Palkia', 'Giratina', 'Zekrom', 'Reshiram', 'Kyurem', 'Xerneas',
    'Yveltal', 'Solgaleo', 'Lunala', 'Necrozma', 'Zacian', 'Zamazenta'
  ];

  for (let i = 0; i < count; i++) {
    const type = i < count * 0.7 ? 'pokemon' : i < count * 0.9 ? 'trainer' : 'energy';
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];

    let name = '';
    if (type === 'pokemon') {
      name = pokemonNames[i % pokemonNames.length];
      if (rarity === 'rare-ultra') name += ' ex';
      else if (rarity === 'rare-holo') name += ' V';
    } else if (type === 'trainer') {
      name = i % 2 === 0 ? 'Professor\'s Research' : 'Ultra Ball';
    } else {
      name = 'Lightning Energy';
    }

    cards.push({
      id: `${setId}-${i + 1}`,
      name,
      number: String(i + 1).padStart(3, '0'),
      rarity,
      type,
      setId,
    });
  }

  return cards;
}

// Sample cards for specific sets (for demo purposes)
export const sampleCardsBySet: Record<string, Card[]> = {
  'sv8-surging-sparks': generateSampleCards('sv8-surging-sparks', 191),
  'sv7-stellar-crown': generateSampleCards('sv7-stellar-crown', 142),
  'sv-prismatic-evolutions': generateSampleCards('sv-prismatic-evolutions', 175),
};

// Get sample cards for a set, generating if needed
export function getSampleCards(setId: string, cardCount: number = 20): Card[] {
  if (sampleCardsBySet[setId]) {
    return sampleCardsBySet[setId];
  }
  return generateSampleCards(setId, cardCount);
}
