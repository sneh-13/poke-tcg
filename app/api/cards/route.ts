import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const setId = searchParams.get('setId');

    if (!setId) {
      return NextResponse.json(
        { error: 'setId parameter is required' },
        { status: 400 }
      );
    }

    console.log('Fetching cards from TCGdex for set:', setId);

    // Using TCGdex API - fetch the set which includes all cards
    const apiUrl = `https://api.tcgdex.net/v2/en/sets/${setId}`;
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
        { error: 'Failed to fetch cards', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const cards = data.cards || [];
    console.log('Cards found:', cards.length);

    // Transform TCGdex card format to match expected format
    const transformedCards = cards.map((card: any) => ({
      id: card.id,
      name: card.name,
      number: card.localId,
      rarity: card.rarity || 'Common',
      supertype: 'Pokémon', // TCGdex doesn't separate this in the cards list
      images: {
        small: `${card.image}/high.png`,
        large: `${card.image}/high.png`
      },
      set: {
        id: setId,
        name: data.name
      }
    }));

    return NextResponse.json(transformedCards);
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'API timeout', message: 'The request took too long. Please try again.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch cards', message: error.message },
      { status: 500 }
    );
  }
}
