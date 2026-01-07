import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: setId } = await params;
    console.log('Fetching set from TCGdex:', setId);

    // Using TCGdex API (more reliable than pokemontcg.io)
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
        { error: 'Failed to fetch set', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Set found:', data.name);

    // Transform TCGdex format to match expected format
    const transformedData = {
      id: data.id,
      name: data.name,
      series: data.serie?.name || '',
      releaseDate: data.releaseDate,
      total: data.cardCount?.total || 0,
      printedTotal: data.cardCount?.official || 0,
      images: {
        symbol: data.symbol,
        logo: data.logo
      }
    };

    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching set:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'API timeout', message: 'The request took too long. Please try again.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch set', message: error.message },
      { status: 500 }
    );
  }
}
