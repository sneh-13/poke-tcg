# Card Pricing & Full Data Guide

## Overview

Your app now has access to **full card data including pricing and price history**!

## Two API Endpoints

### 1. Card List (Basic Info) - `/api/cards?setId=swsh7`
- **Fast**: Gets all 237 cards in one request
- **Basic info**: id, name, number, image, rarity
- **Use for**: Displaying card grids/lists

### 2. Card Details (Full Info) - `/api/cards/{cardId}`
- **Complete data**: Everything including pricing, stats, attacks
- **Price history**: 1-day, 7-day, 30-day averages
- **Use for**: Card detail pages, when user clicks a card

## Pricing Data Structure

```typescript
{
  pricing: {
    // Cardmarket (Europe) - in EUR
    cardmarket: {
      updated: "2026-01-07T01:48:13.000Z",
      unit: "EUR",
      current: {
        avg: 1.74,    // Average price
        low: 0.74,    // Lowest price
        trend: 1.61   // Trending price
      },
      history: {
        avg1: 2.39,   // 1-day average
        avg7: 1.57,   // 7-day average
        avg30: 1.74   // 30-day average
      },
      url: "https://www.cardmarket.com/..."
    },

    // TCGplayer (USA) - in USD
    tcgplayer: {
      updated: "2026-01-06T20:05:22.000Z",
      unit: "USD",
      holofoil: {
        lowPrice: 0.60,
        midPrice: 1.25,
        highPrice: 19.95,
        marketPrice: 1.14,
        directLowPrice: 1.22
      },
      url: "https://www.tcgplayer.com/..."
    }
  }
}
```

## Usage Examples

### Example 1: Display Card List (Current Setup)
```typescript
// This is what you're already doing
const cards = await getCardsFromSet('swsh7');
// Returns 237 cards with basic info
```

### Example 2: Get Full Card Details with Pricing
```typescript
import { getCardById } from '@/lib/pokemonTCGApi';

// When user clicks on a card
const cardDetails = await getCardById('swsh7-110'); // Rayquaza V

console.log(cardDetails.pricing.tcgplayer.holofoil.marketPrice); // $1.14
console.log(cardDetails.pricing.cardmarket.history.avg7); // €1.57
console.log(cardDetails.attacks); // Card attacks
console.log(cardDetails.hp); // HP value
```

### Example 3: Fetch Multiple Cards with Details
```typescript
// Fetch first 10 cards with full details
const basicCards = await getCardsFromSet('swsh7');
const detailedCards = await Promise.all(
  basicCards.slice(0, 10).map(card => getCardById(card.id))
);

// Now you have full pricing for first 10 cards
detailedCards.forEach(card => {
  console.log(`${card.name}: $${card.pricing?.tcgplayer?.holofoil?.marketPrice}`);
});
```

## Full Card Data Includes:

✅ **Basic Info**: name, number, rarity, set
✅ **Images**: Small and large (high quality)
✅ **Stats**: HP, types, stage, retreat cost
✅ **Abilities**: Attacks, special abilities
✅ **Pricing**: Current prices + history (1, 7, 30 days)
✅ **Legal**: Tournament legality (Standard, Expanded)
✅ **Artist**: Card illustrator
✅ **Dex ID**: Pokédex number

## Recommended Approach

**For Card Grid (Current):**
- Keep using `getCardsFromSet()` - Fast, shows all cards

**For Card Detail Page:**
```typescript
// In your card detail page component
useEffect(() => {
  async function fetchCardDetails() {
    const details = await getCardById(cardId);
    setCardData(details);
  }
  fetchCardDetails();
}, [cardId]);
```

**For Batch Loading (Optional):**
- Fetch 10-20 cards at a time as user scrolls
- Cache the results to avoid re-fetching

## Testing

Try these URLs in your browser:

1. **List all cards:**
   ```
   http://localhost:3000/api/cards?setId=swsh7
   ```

2. **Get Rayquaza V with pricing:**
   ```
   http://localhost:3000/api/cards/swsh7-110
   ```

3. **Get Umbreon VMAX with pricing:**
   ```
   http://localhost:3000/api/cards/swsh7-95
   ```

## Performance Notes

- **237 cards x full details = slow** (237 requests)
- **Recommended**: Fetch full details only when needed
- **Alternative**: Fetch in batches of 10-20 as user scrolls
- **Best**: Load full details only when user clicks on a card

## Price History Chart Example

You can use the price history to create charts:

```typescript
const card = await getCardById('swsh7-110');
const priceHistory = [
  { day: 1, price: card.pricing.cardmarket.history.avg1 },
  { day: 7, price: card.pricing.cardmarket.history.avg7 },
  { day: 30, price: card.pricing.cardmarket.history.avg30 }
];

// Use with chart.js or any charting library
```

You now have everything you need to build a full Pokemon card database with pricing! 🎉
