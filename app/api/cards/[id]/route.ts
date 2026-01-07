import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;
    console.log('Fetching full card details from TCGdex:', cardId);

    const apiUrl = `https://api.tcgdex.net/v2/en/cards/${cardId}`;
    console.log('API URL:', apiUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch card', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const card = await response.json();
    console.log('Card found:', card.name, '- Has pricing:', !!card.pricing);

    // Return full card data with pricing
    return NextResponse.json({
      id: card.id,
      name: card.name,
      number: card.localId,
      rarity: card.rarity,
      supertype: card.category || 'Pokémon',
      hp: card.hp,
      types: card.types,
      attacks: card.attacks,
      abilities: card.abilities,
      weaknesses: card.weaknesses,
      resistances: card.resistances,
      retreat: card.retreat,
      artist: card.illustrator,
      images: {
        small: `${card.image}/high.png`,
        large: `${card.image}/high.png`
      },
      set: {
        id: card.set.id,
        name: card.set.name,
        logo: card.set.logo,
        symbol: card.set.symbol
      },
      // Full pricing data with history
      pricing: {
        cardmarket: card.pricing?.cardmarket ? {
          updated: card.pricing.cardmarket.updated,
          unit: card.pricing.cardmarket.unit,
          current: {
            avg: card.pricing.cardmarket.avg,
            low: card.pricing.cardmarket.low,
            trend: card.pricing.cardmarket.trend
          },
          history: {
            avg1: card.pricing.cardmarket.avg1,   // 1-day average
            avg7: card.pricing.cardmarket.avg7,   // 7-day average
            avg30: card.pricing.cardmarket.avg30  // 30-day average
          },
          url: `https://www.cardmarket.com/en/Pokemon/Products/Singles/${card.set.name}/${card.name}`
        } : null,
        tcgplayer: card.pricing?.tcgplayer ? {
          updated: card.pricing.tcgplayer.updated,
          unit: card.pricing.tcgplayer.unit,
          holofoil: card.pricing.tcgplayer.holofoil,
          normal: card.pricing.tcgplayer.normal,
          reverseHolofoil: card.pricing.tcgplayer.reverseHolofoil,
          url: `https://www.tcgplayer.com/product/${card.pricing.tcgplayer.holofoil?.productId || ''}`
        } : null
      },
      // Additional card data
      regulationMark: card.regulationMark,
      legal: card.legal,
      dexId: card.dexId,
      stage: card.stage,
      evolveFrom: card.evolveFrom
    });
  } catch (error: any) {
    console.error('Error fetching card:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'API timeout', message: 'The request took too long. Please try again.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch card', message: error.message },
      { status: 500 }
    );
  }
}
