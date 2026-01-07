import { Card } from './pokemon';

export interface CollectionItem extends Card {
  quantity: number;
  estimatedValue: number;
  addedAt: string;
}

export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  setsRepresented: number;
  estimatedValue: number;
}

export interface CollectionContextType {
  addToCollection: (card: Card) => void;
  removeFromCollection: (cardId: string) => void;
  isInCollection: (cardId: string) => boolean;
  getCardQuantity: (cardId: string) => number;
}
