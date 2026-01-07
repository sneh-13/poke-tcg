# Pokemon TCG API Integration Guide

This guide explains how to use the Pokemon TCG API in your Next.js project.

## Setup

### 1. Add Your API Key

Open the `.env.local` file and replace `your_api_key_here` with your actual API key:

```env
NEXT_PUBLIC_POKEMON_TCG_API_KEY=your_actual_api_key_here
```

### 2. Restart Your Development Server

After adding your API key, restart the development server:

```bash
npm run dev
```

## Usage

### Fetching Cards from a Specific Set

The API uses specific set IDs. Here are some popular sets:

#### Classic Sets
- `base1` - Base Set (1999)
- `base2` - Jungle
- `base3` - Fossil
- `base4` - Base Set 2
- `base5` - Team Rocket

#### Modern Sets
- `xy1` - XY Base Set
- `sm1` - Sun & Moon Base Set
- `swsh1` - Sword & Shield Base Set
- `sv1` - Scarlet & Violet Base Set
- `sv2` - Paldea Evolved
- `sv3` - Obsidian Flames

### Example: Fetching Cards

```typescript
import { getCardsFromSet, getSetById } from '@/lib/pokemonTCGApi';

// Fetch all cards from Base Set
const cards = await getCardsFromSet('base1');

// Fetch set information
const set = await getSetById('base1');
```

### Example Component

See `app/set/[id]/page-with-api.tsx.example` for a complete example of a component that:
- Fetches cards from a specific set
- Displays card images
- Filters by rarity and type
- Shows loading states
- Handles errors

To use this example:
1. Rename `page-with-api.tsx.example` to `page.tsx` (backup your current `page.tsx` first)
2. Navigate to `/set/base1` in your browser to see the Base Set cards

## Finding Set IDs

To find the correct set ID for any Pokemon TCG set:

1. Visit https://pokemontcg.io/sets
2. Click on a set to see its details
3. The set ID is shown in the URL and in the set details

Or use the API to get all available sets:

```typescript
import { getAllSets } from '@/lib/pokemonTCGApi';

const sets = await getAllSets();
console.log(sets.map(s => ({ id: s.id, name: s.name })));
```

## Card Data Structure

Each card from the API includes:

```typescript
{
  id: string;              // e.g., "base1-4"
  name: string;            // e.g., "Charizard"
  supertype: string;       // "Pokémon", "Trainer", or "Energy"
  subtypes: string[];      // e.g., ["Stage 2"]
  hp: string;              // e.g., "120"
  types: string[];         // e.g., ["Fire"]
  rarity: string;          // e.g., "Rare Holo"
  number: string;          // Card number in set
  artist: string;          // Artist name
  images: {
    small: string;         // Small image URL
    large: string;         // Large image URL
  };
  tcgplayer: {             // Price data (US Dollars)
    prices: {
      holofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
      };
      // ... other variants
    };
  };
  cardmarket: {            // European prices (Euros)
    prices: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
      // ... more price data
    };
  };
  // ... many more fields
}
```

## Tips

1. **Start with one set**: Pick a specific set ID (like 'base1') to test with
2. **Use pagination carefully**: The `all()` method fetches ALL cards, which can be slow for large sets
3. **Cache data**: Consider caching API responses to avoid hitting rate limits
4. **Handle loading states**: Always show loading indicators while fetching data
5. **Error handling**: The API can fail, so always handle errors gracefully

## Next Steps

1. Add your API key to `.env.local`
2. Test with a single set (e.g., 'base1')
3. Update your existing components to use real API data
4. Add caching or state management if needed
