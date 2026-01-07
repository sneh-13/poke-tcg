'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Card } from '@/types/pokemon';
import { CollectionItem, CollectionContextType } from '@/types/collection';
import { useAuth } from './AuthContext';

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  const addToCollection = (card: Card) => {
    if (!currentUser || typeof window === 'undefined') return;

    try {
      const users = JSON.parse(localStorage.getItem('pokemonTCG_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

      if (userIndex !== -1) {
        const existingCard = users[userIndex].collection.find(
          (c: CollectionItem) => c.id === card.id
        );

        if (existingCard) {
          existingCard.quantity += 1;
        } else {
          users[userIndex].collection.push({
            ...card,
            quantity: 1,
            estimatedValue: Math.floor(Math.random() * 50) + 5, // Random value for demo
            addedAt: new Date().toISOString(),
          });
        }

        localStorage.setItem('pokemonTCG_users', JSON.stringify(users));
        localStorage.setItem('pokemonTCG_currentUser', JSON.stringify(users[userIndex]));

        // Trigger a storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error adding to collection:', error);
    }
  };

  const removeFromCollection = (cardId: string) => {
    if (!currentUser || typeof window === 'undefined') return;

    try {
      const users = JSON.parse(localStorage.getItem('pokemonTCG_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

      if (userIndex !== -1) {
        users[userIndex].collection = users[userIndex].collection.filter(
          (c: CollectionItem) => c.id !== cardId
        );

        localStorage.setItem('pokemonTCG_users', JSON.stringify(users));
        localStorage.setItem('pokemonTCG_currentUser', JSON.stringify(users[userIndex]));

        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error removing from collection:', error);
    }
  };

  const isInCollection = (cardId: string): boolean => {
    return currentUser?.collection.some((c) => c.id === cardId) || false;
  };

  const getCardQuantity = (cardId: string): number => {
    const card = currentUser?.collection.find((c) => c.id === cardId);
    return card?.quantity || 0;
  };

  return (
    <CollectionContext.Provider value={{
      addToCollection,
      removeFromCollection,
      isInCollection,
      getCardQuantity
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within CollectionProvider');
  }
  return context;
};
