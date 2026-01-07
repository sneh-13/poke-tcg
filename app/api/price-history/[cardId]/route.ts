import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;

    // Split cardId into setId and cardNumber (e.g., "swsh7-110" -> "swsh7" and "110")
    const [setId, cardNumber] = cardId.split('-');

    if (!setId || !cardNumber) {
      return NextResponse.json(
        { error: 'Invalid card ID format. Expected format: setId-cardNumber (e.g., swsh7-110)' },
        { status: 400 }
      );
    }

    console.log(`Fetching price history for ${setId}/${cardNumber} from TCGdex GitHub`);

    // Fetch from TCGdex price-history GitHub repo
    const githubUrl = `https://raw.githubusercontent.com/tcgdex/price-history/master/en/${setId}/${cardNumber}.tcgplayer.json`;
    console.log('GitHub URL:', githubUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(githubUrl, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('GitHub fetch error:', response.status);
      return NextResponse.json(
        { error: 'Price history not found for this card', status: response.status },
        { status: response.status }
      );
    }

    const priceData = await response.json();
    console.log('Price history found, processing data...');

    // Extract Near Mint prices (most relevant for ungraded cards)
    const nearMintData = priceData.data['holo-nearmint'] || priceData.data['holo-good'] || priceData.data['normal-nearmint'];

    if (!nearMintData || !nearMintData.history) {
      return NextResponse.json(
        { error: 'No price history available for this card' },
        { status: 404 }
      );
    }

    // Transform data for charting
    const history = nearMintData.history;
    const dates = Object.keys(history).sort();

    // Convert to chart-ready format (prices are in cents, convert to dollars)
    const chartData = dates.map(date => ({
      date,
      price: history[date].avg / 100, // Convert cents to dollars
      min: history[date].min ? history[date].min / 100 : null,
      max: history[date].max ? history[date].max / 100 : null,
      count: history[date].count
    }));

    // Calculate statistics
    const prices = chartData.map(d => d.price);
    const currentPrice = prices[prices.length - 1];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return NextResponse.json({
      cardId,
      setId,
      cardNumber,
      condition: 'Near Mint',
      currency: 'USD',
      dataPoints: chartData.length,
      dateRange: {
        start: dates[0],
        end: dates[dates.length - 1]
      },
      statistics: {
        current: currentPrice,
        min: minPrice,
        max: maxPrice,
        average: avgPrice
      },
      history: chartData,
      source: 'TCGdex Price History (GitHub)',
      sourceUrl: githubUrl
    });

  } catch (error: any) {
    console.error('Error fetching price history:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout', message: 'The request took too long. Please try again.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch price history', message: error.message },
      { status: 500 }
    );
  }
}
