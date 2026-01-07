'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { pokemonSets } from '@/data/sets';
import { getSampleCards } from '@/data/sampleCards';
import { useCollection } from '@/contexts/CollectionContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CardPage() {
  const params = useParams();
  const setId = params.setId as string;
  const cardId = params.cardId as string;
  const { isInCollection, addToCollection, removeFromCollection, getCardQuantity } = useCollection();
  const { currentUser } = useAuth();

  const set = pokemonSets.find((s) => s.id === setId);
  const cards = getSampleCards(setId, set?.cardCount || 20);
  const card = cards.find((c) => c.id.toString() === cardId);

  if (!card || !set) {
    return <div className="p-8">Card not found</div>;
  }

  const inCollection = isInCollection(card.id.toString());
  const quantity = getCardQuantity(card.id.toString());

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1200px] mx-auto">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-poke-blue">Home</Link>
          <span className="mx-2">›</span>
          <Link href={`/set/${setId}`} className="hover:text-poke-blue">{set.name}</Link>
          <span className="mx-2">›</span>
          <span className="text-charcoal">{card.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-4xl text-gray-400">{card.number}</span>
            </div>
            {currentUser && (
              <div className="flex gap-2">
                {inCollection ? (
                  <button
                    onClick={() => removeFromCollection(card.id.toString())}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove ({quantity})
                  </button>
                ) : (
                  <button
                    onClick={() => addToCollection(card)}
                    className="flex-1 bg-poke-blue hover:bg-poke-blue-hover text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add to Collection
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold text-charcoal mb-4">{card.name}</h1>
            <div className="space-y-2 text-gray-700">
              <p><strong>Set:</strong> {set.name}</p>
              <p><strong>Number:</strong> {card.number}</p>
              <p><strong>Rarity:</strong> <span className="capitalize">{card.rarity.replace('-', ' ')}</span></p>
              <p><strong>Type:</strong> <span className="capitalize">{card.type}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
