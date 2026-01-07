import pokemon from 'pokemontcgsdk';

// Initialize the SDK with your API key
if (process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY) {
  pokemon.configure({ apiKey: process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY });
}

export interface PokemonCard {
  id: string;
  name: string;
  number: string;
  rarity: string;
  type: string;
  images: {
    small: string;
    large: string;
  };
  set: {
    id: string;
    name: string;
  };
}

export async function getCardsBySetId(setId: string): Promise<PokemonCard[]> {
  try {
    // Map our internal set IDs to Pokemon TCG API set IDs
    const apiSetId = mapSetIdToApi(setId);

    if (!apiSetId) {
      console.log(`No API mapping for set: ${setId}`);
      return [];
    }

    const result = await pokemon.card.where({ q: `set.id:${apiSetId}`, orderBy: 'number' });

    // Transform the API response to match our interface
    return result.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      number: card.number,
      rarity: card.rarity || 'common',
      type: card.supertype?.toLowerCase() || 'pokemon',
      images: {
        small: card.images?.small || '',
        large: card.images?.large || '',
      },
      set: {
        id: card.set.id,
        name: card.set.name,
      },
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

export async function getCardById(cardId: string): Promise<PokemonCard | null> {
  try {
    const card: any = await pokemon.card.find(cardId);
    return {
      id: card.id,
      name: card.name,
      number: card.number,
      rarity: card.rarity || 'common',
      type: card.supertype?.toLowerCase() || 'pokemon',
      images: {
        small: card.images?.small || '',
        large: card.images?.large || '',
      },
      set: {
        id: card.set.id,
        name: card.set.name,
      },
    };
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

// Map our set IDs to Pokemon TCG API set IDs
function mapSetIdToApi(setId: string): string | null {
  const setMapping: Record<string, string> = {
    // Scarlet & Violet
    'sv8-surging-sparks': 'sv8',
    'sv7-stellar-crown': 'sv7',
    'sv6-twilight-masquerade': 'sv6',
    'sv5-temporal-forces': 'sv5',
    'sv4-paradox-rift': 'sv4',
    'sv4.5-paldean-fates': 'sv4pt5',
    'sv3.5-151': 'sv3pt5',
    'sv3-obsidian-flames': 'sv3',
    'sv2-paldea-evolved': 'sv2',
    'sv1-scarlet-violet': 'sv1',
    'sv-promos': 'svp',

    // Sword & Shield
    'swsh12.5-crown-zenith': 'swsh12pt5',
    'swsh12-silver-tempest': 'swsh12',
    'swsh11-lost-origin': 'swsh11',
    'swsh10-astral-radiance': 'swsh10',
    'swsh9-brilliant-stars': 'swsh9',
    'swsh8-fusion-strike': 'swsh8',
    'swsh7-evolving-skies': 'swsh7',
    'swsh6-chilling-reign': 'swsh6',
    'swsh5-battle-styles': 'swsh5',
    'swsh4-vivid-voltage': 'swsh4',
    'swsh3-darkness-ablaze': 'swsh3',
    'swsh2-rebel-clash': 'swsh2',
    'swsh1-sword-shield': 'swsh1',
    'swsh-promos': 'swshp',

    // Sun & Moon
    'sm12-cosmic-eclipse': 'sm12',
    'sm11-unified-minds': 'sm11',
    'sm10-unbroken-bonds': 'sm10',
    'sm9-team-up': 'sm9',
    'sm8-lost-thunder': 'sm8',
    'sm7-celestial-storm': 'sm7',
    'sm6-forbidden-light': 'sm6',
    'sm5-ultra-prism': 'sm5',
    'sm4-crimson-invasion': 'sm4',
    'sm3-burning-shadows': 'sm3',
    'sm2-guardians-rising': 'sm2',
    'sm1-sun-moon': 'sm1',
    'sm-promos': 'smp',
  };

  return setMapping[setId] || null;
}
