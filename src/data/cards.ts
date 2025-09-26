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

export const createDeck = (seed?: number): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
    ranks.forEach(rank => {
      deck.push({
        id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
        faceUp: false,
        color,
      });
    });
  });
  return shuffleDeck(deck, seed);
};

export const shuffleDeck = (deck: Card[], seed: number = Date.now()): Card[] => {
  const shuffled = [...deck];
  let m = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    m = (m * 1103515245 + 12345) % 2147483647;
    const j = Math.floor((m / 2147483647) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealKlondike = (deck: Card[]): { stock: Card[], waste: Card[], tableau: Card[][], foundations: Card[][] } => {
  const shuffled = shuffleDeck(deck);
  const stock = shuffled.splice(0, 24);
  const waste: Card[] = [];
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  const foundations: Card[][] = Array.from({ length: 4 }, () => []);

  // Deal tableau: increasing cards per pile, top face up
  for (let col = 0; col < 7; col++) {
    for (let row = col; row < 7; row++) {
      const card = shuffled.shift()!;
      card.faceUp = (row === col);
      tableau[row].push(card);
    }
  }

  return { stock, waste, tableau, foundations };
};

export const getCardValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13,
  };
  return values[rank];
};

export const isValidTableauMove = (fromCard: Card, toCard: Card | null): boolean => {
  if (!toCard) return fromCard.rank === 'K'; // King to empty
  return fromCard.color !== toCard.color && getCardValue(fromCard.rank) === getCardValue(toCard.rank) - 1;
};

export const isValidFoundationMove = (fromCard: Card, toCard: Card | null, suit: Suit): boolean => {
  if (fromCard.suit !== suit) return false;
  if (!toCard) return fromCard.rank === 'A';
  return getCardValue(fromCard.rank) === getCardValue(toCard.rank) + 1;
};

export const hasValidMoves = (state: { waste: Card[], tableau: Card[][], foundations: Card[][] }): boolean => {
  const wasteTop = state.waste[0];
  if (wasteTop) {
    // Waste to tableau
    for (let i = 0; i < 7; i++) {
      const top = state.tableau[i][state.tableau[i].length - 1];
      if (isValidTableauMove(wasteTop, top || null)) return true;
    }
    // Waste to foundation
    for (let i = 0; i < 4; i++) {
      const top = state.foundations[i][state.foundations[i].length - 1];
      if (isValidFoundationMove(wasteTop, top || null, suits[i])) return true;
    }
  }
  // Tableau to tableau/foundation
  for (let i = 0; i < 7; i++) {
    for (let j = state.tableau[i].length - 1; j >= 0; j--) {
      const card = state.tableau[i][j];
      if (card.faceUp) {
        for (let k = 0; k < 7; k++) {
          if (i !== k) {
            const top = state.tableau[k][state.tableau[k].length - 1];
            if (isValidTableauMove(card, top || null)) return true;
          }
        }
        for (let k = 0; k < 4; k++) {
          const top = state.foundations[k][state.foundations[k].length - 1];
          if (isValidFoundationMove(card, top || null, suits[k])) return true;
        }
      }
    }
  }
  return false;
};

export const isGameWon = (foundations: Card[][]): boolean => foundations.every(f => f.length === 13);