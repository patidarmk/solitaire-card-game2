import { motion } from 'framer-motion';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  color: 'red' | 'black';
}

export const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
    ranks.forEach(rank => {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: false,
        color,
      });
    });
  });
  return deck;
};

export const shuffleDeck = (deck: Card[], seed: number = Date.now()): Card[] => {
  // Simple seeded shuffle for reproducible daily challenges
  const shuffled = [...deck];
  let m = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    m = (m * 1103515245 + 12345) % 2147483647;
    const j = Math.floor((m / 2147483647) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealKlondike = (deck: Card[]): { stock: Card[], waste: Card[], columns: Card[][], foundations: Card[][] } => {
  const shuffled = shuffleDeck(deck);
  const stock = shuffled.splice(0, 24); // Stock starts with 24 cards face down
  const waste: Card[] = [];
  const columns: Card[][] = [[], [], [], [], [], [], []];
  const foundations: Card[][] = [[], [], [], []]; // One per suit

  // Deal to columns: first card face up, rest face down, increasing per column
  for (let col = 0; col < 7; col++) {
    for (let row = col; row < 7; row++) {
      const card = shuffled.shift()!;
      card.faceUp = row === col;
      columns[row].push(card);
    }
  }

  return { stock, waste, columns, foundations };
};

export const getCardValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13,
  };
  return values[rank];
};

export const isValidMoveToColumn = (fromCard: Card, toCard: Card | null): boolean => {
  if (!toCard) return fromCard.rank === 'K'; // King to empty column
  return fromCard.color !== toCard.color && getCardValue(fromCard.rank) === getCardValue(toCard.rank) - 1;
};

export const isValidMoveToFoundation = (fromCard: Card, foundation: Card[] | null, suit: Suit): boolean => {
  if (!fromCard.suit) return false;
  if (foundation && foundation.length > 0) {
    const top = foundation[foundation.length - 1];
    return fromCard.suit === suit && getCardValue(fromCard.rank) === getCardValue(top.rank) + 1;
  }
  return fromCard.rank === 'A' && fromCard.suit === suit;
};

export const canAutoCompleteToFoundation = (columns: Card[][], foundations: Card[][]): boolean => {
  for (let col of columns) {
    for (let i = col.length - 1; i >= 0; i--) {
      const card = col[i];
      if (card.faceUp) {
        const suitIndex = suits.indexOf(card.suit);
        if (suitIndex !== -1 && isValidMoveToFoundation(card, foundations[suitIndex], card.suit)) {
          return true;
        }
      }
    }
  }
  return false;
};