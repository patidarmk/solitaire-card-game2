import { motion } from 'framer-motion';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Color = 'red' | 'black';

export interface Card {
  suit: Suit;
  rank: Rank;
  color: Color;
  id: string;
  faceUp: boolean;
}

export const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const getCardValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };
  return values[rank];
};

export const createDeck = (seed?: number): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    const color: Color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
    ranks.forEach((rank, index) => {
      deck.push({ suit, rank, color, id: `${suit}-${rank}-${index}`, faceUp: false });
    });
  });
  // Shuffle with optional seed for daily challenges
  if (seed !== undefined) {
    const seededRandom = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed) * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  } else {
    // Standard Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  return deck;
};

export const isValidTableauMove = (fromCard: Card, toCard: Card | null): boolean => {
  if (!toCard) return fromCard.rank === 'K'; // King to empty
  return fromCard.color !== toCard.color && getCardValue(fromCard.rank) === getCardValue(toCard.rank) - 1;
};

export const isValidFoundationMove = (fromCard: Card, toCard: Card | null, foundationSuit: Suit | null): boolean => {
  if (!toCard) return fromCard.rank === 'A' && foundationSuit === null;
  if (fromCard.suit !== toCard.suit) return false;
  return getCardValue(fromCard.rank) === getCardValue(toCard.rank) + 1;
};

export const getCardImage = (card: Card): string => {
  return `https://deckofcardsapi.com/static/img/${card.suit[0]}${getCardValue(card.rank)}${card.suit.slice(-1)}.png`;
};