'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCardById, getPriceHistory } from '@/lib/pokemonTCGApi';
import { useCollection } from '@/contexts/CollectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CardData {
  id: string;
  name: string;
  number: string;
  rarity: string;
  supertype: string;
  hp?: number;
  types?: string[];
  attacks?: any[];
  abilities?: any[];
  images: {
    small: string;
    large: string;
  };
  set: {
    id: string;
    name: string;
  };
  pricing?: {
    cardmarket?: {
      updated: string;
      unit: string;
      current: {
        avg: number;
        low: number;
        trend: number;
      };
      history: {
        avg1: number;
        avg7: number;
        avg30: number;
      };
    };
    tcgplayer?: {
      updated: string;
      unit: string;
      holofoil?: {
        lowPrice: number;
        midPrice: number;
        highPrice: number;
        marketPrice: number;
      };
    };
  };
}

export default function CardPage() {
  const params = useParams();
  const setSlug = params.setId as string; // e.g., "swsh7-evolving-skies" or "swsh7"
  const cardId = params.cardId as string;

  // Extract the set code (first part before hyphen) for API calls
  // e.g., "swsh7-evolving-skies" -> "swsh7"
  const setCode = setSlug.split('-')[0];
  const fullCardId = `${setCode}-${cardId}`;

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const { isInCollection, addToCollection, removeFromCollection, getCardQuantity } = useCollection();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchCard() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCardById(fullCardId);
        setCard(data);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card details');
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [fullCardId]);

  // Fetch price history
  useEffect(() => {
    async function fetchPriceHistory() {
      try {
        setPriceLoading(true);
        const history = await getPriceHistory(fullCardId);
        setPriceHistory(history);
      } catch (err) {
        console.error('Error fetching price history:', err);
        // Don't set error, just log it - price history is optional
      } finally {
        setPriceLoading(false);
      }
    }
    fetchPriceHistory();
  }, [fullCardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center py-12">Loading card details...</div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center py-12 text-red-600">{error || 'Card not found'}</div>
        </div>
      </div>
    );
  }

  const inCollection = isInCollection(fullCardId);
  const quantity = getCardQuantity(fullCardId);

  const tcgPlayerPrice = card.pricing?.tcgplayer?.holofoil?.marketPrice ||
                         card.pricing?.tcgplayer?.holofoil?.midPrice;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-poke-blue">Home</Link>
          <span className="mx-2">›</span>
          <Link href={`/set/${setSlug}`} className="hover:text-poke-blue">{card.set.name}</Link>
          <span className="mx-2">›</span>
          <span className="text-charcoal">{card.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* Left side - Card Image */}
          <div className="glass-card p-6">
            <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={card.images.large}
                alt={card.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Card Basic Info */}
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Set:</strong> {card.set.name}</p>
              <p><strong>Number:</strong> {card.number}</p>
              <p><strong>Rarity:</strong> <span className="capitalize">{card.rarity}</span></p>
              {card.hp && <p><strong>HP:</strong> {card.hp}</p>}
              {card.types && <p><strong>Type:</strong> {card.types.join(', ')}</p>}
            </div>

            {currentUser && (
              <div className="flex gap-2">
                {inCollection ? (
                  <button
                    onClick={() => removeFromCollection(fullCardId)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove ({quantity})
                  </button>
                ) : (
                  <button
                    onClick={() => addToCollection({
                      id: fullCardId,
                      name: card.name,
                      number: card.number,
                      rarity: card.rarity,
                      type: card.types?.[0] || 'normal'
                    })}
                    className="flex-1 bg-poke-blue hover:bg-poke-blue-hover text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add to Collection
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right side - Pricing and Charts */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h1 className="text-3xl font-bold text-charcoal mb-6">{card.name}</h1>

              {/* Current Price - USD Only */}
              {tcgPlayerPrice ? (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg mb-8 max-w-md">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Market Price (USD)</h3>
                  <div className="text-4xl font-bold text-green-900 mb-2">
                    ${tcgPlayerPrice.toFixed(2)}
                  </div>
                  {card.pricing?.tcgplayer?.holofoil && (
                    <div className="flex gap-4 text-sm text-gray-700 mt-3">
                      <div>
                        <span className="text-gray-500">Low:</span>{' '}
                        <span className="font-semibold">${card.pricing.tcgplayer.holofoil.lowPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mid:</span>{' '}
                        <span className="font-semibold">${card.pricing.tcgplayer.holofoil.midPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">High:</span>{' '}
                        <span className="font-semibold">${card.pricing.tcgplayer.holofoil.highPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg mb-8 max-w-md">
                  <p className="text-gray-600">Pricing data not available for this card.</p>
                </div>
              )}

              {/* Price History Chart */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  💎 Ungraded Price History (USD)
                </h3>
                {priceLoading ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Loading price history...</p>
                  </div>
                ) : priceHistory && priceHistory.history && priceHistory.history.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={priceHistory.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                          interval="preserveStartEnd"
                          minTickGap={50}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8' }}
                          label={{
                            value: 'Price (USD)',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#94a3b8'
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#cbd5e1' }}
                          formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                        />
                        <Legend wrapperStyle={{ color: '#94a3b8' }} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          dot={false}
                          name="Avg Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs">Current</p>
                        <p className="text-cyan-400 font-bold">${priceHistory.statistics.current.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs">Average</p>
                        <p className="text-cyan-400 font-bold">${priceHistory.statistics.average.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs">All-Time Low</p>
                        <p className="text-green-400 font-bold">${priceHistory.statistics.min.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-gray-400 text-xs">All-Time High</p>
                        <p className="text-red-400 font-bold">${priceHistory.statistics.max.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      {priceHistory.dataPoints} data points from {priceHistory.dateRange.start} to {priceHistory.dateRange.end}
                      <br />
                      Source: TCGdex Price History (Near Mint condition)
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-2">Price history not available for this card</p>
                    <p className="text-sm">Historical data may not exist in the TCGdex database</p>
                  </div>
                )}
              </div>

              {/* PSA Graded Prices - Placeholder */}
              <div className="bg-gray-900 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  💎 Graded Price History
                </h3>
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-2">PSA graded pricing coming soon!</p>
                  <p className="text-sm">Will include PSA 10, PSA 9, PSA 8 prices and history</p>
                </div>
              </div>
            </div>

            {/* Card Details */}
            {card.attacks && card.attacks.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-charcoal mb-4">Attacks</h3>
                {card.attacks.map((attack, idx) => (
                  <div key={idx} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{attack.name}</h4>
                      {attack.damage && <span className="text-red-600 font-bold">{attack.damage}</span>}
                    </div>
                    {attack.text && <p className="text-sm text-gray-700">{attack.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
