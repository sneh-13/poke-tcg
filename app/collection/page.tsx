'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useCollection } from '@/contexts/CollectionContext';

export default function CollectionPage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { removeFromCollection } = useCollection();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Please sign in to view your collection</h2>
          <Link href="/account" className="bg-poke-blue hover:bg-poke-blue-hover text-white px-6 py-3 rounded-lg inline-block">
            Go to Account
          </Link>
        </div>
      </div>
    );
  }

  const collection = currentUser.collection || [];
  const totalCards = collection.reduce((sum, card) => sum + card.quantity, 0);
  const uniqueCards = collection.length;
  const estimatedValue = collection.reduce((sum, card) => sum + (card.estimatedValue * card.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-8">{t('account.my_collection')}</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">{t('account.total_cards')}</h3>
            <p className="text-3xl font-bold text-poke-blue">{totalCards}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">{t('account.unique_cards')}</h3>
            <p className="text-3xl font-bold text-poke-yellow">{uniqueCards}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">{t('account.est_value')}</h3>
            <p className="text-3xl font-bold text-charcoal">${estimatedValue}</p>
          </div>
        </div>

        {/* Collection Grid */}
        {collection.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500 mb-4">Your collection is empty</p>
            <Link href="/" className="text-poke-blue hover:underline">
              Browse sets to add cards
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collection.map((card) => (
              <div key={card.id} className="glass-card p-3">
                <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 flex items-center justify-center relative">
                  <span className="text-sm text-gray-400">{card.number}</span>
                  <span className="absolute top-2 right-2 bg-poke-blue text-white text-xs px-2 py-1 rounded-full">
                    x{card.quantity}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-charcoal line-clamp-1 mb-1">{card.name}</h3>
                <p className="text-xs text-gray-500 capitalize mb-2">{card.rarity?.replace('-', ' ')}</p>
                <button
                  onClick={() => removeFromCollection(card.id.toString())}
                  className="w-full text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
