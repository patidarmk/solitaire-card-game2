"use client";
import * as React from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Card, Crown, Undo, Redo, Lightbulb, Zap, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CardComponent from './Card';
import { Card as CardType, createDeck, getCardValue, isValidTableauMove, isValidFoundationMove, Suit } from '@/data/cards';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface KlondikeState {
  stock: CardType[];
  waste: CardType[];
  tableau: CardType[][];
  foundations: CardType[][];
  score: number;
  moves: number;
  history: KlondikeState[];
  future: KlondikeState[]; // For redo
  gameWon: boolean;
  gameLost: boolean;
  hint: { from: number; to: number; type: 'tableau' | 'foundation' } | null;
}

type Action =
  | { type: 'DRAW'; count: number }
  | { type: 'MOVE'; from: { pile: 'stock' | 'waste' | 'tableau'; index: number }; to: { pile: 'tableau' | 'foundation'; index: number; cards: CardType[] } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'AUTO_COMPLETE' }
  | { type: 'HINT' }
  | { type: 'NEW_GAME'; seed?: number };

const initialState: KlondikeState = {
  stock: [],
  waste: [],
  tableau: [[], [], [], [], [], [], []],
  foundations: [[], [], [], []],
  score: 0,
  moves: 0,
  history: [],
  future: [],
  gameWon: false,
  gameLost: false,
  hint: null,
};

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  const newState = { ...state };
  newState.history = [...state.history, { ...state }];
  newState.future = [];

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const stock = deck.splice(0, 24);
      const tableau: CardType[][] = Array.from({ length: 7 }, (_, i) => {
        const pile = deck.splice(0, i + 1);
        pile[pile.length - 1].faceUp = true;
        return pile;
      });
      return { ...initialState, stock, tableau, history: [] };

    case 'DRAW':
      for (let i = 0; i < action.count && newState.stock.length > 0; i++) {
        const card = newState.stock.pop()!;
        card.faceUp = true;
        newState.waste.unshift(card);
        newState.score += 5;
      }
      if (newState.stock.length === 0 && newState.waste.length > 0) {
        // Recycle waste to stock
        newState.stock = newState.waste.map(c => ({ ...c, faceUp: false })).reverse();
        newState.waste = [];
      }
      break;

    case 'MOVE':
      const { from, to, cards } = action;
      let fromCards: CardType[] = [];
      if (from.pile === 'stock') fromCards = newState.stock.splice(from.index, cards.length);
      else if (from.pile === 'waste') fromCards = newState.waste.splice(0, cards.length);
      else fromCards = newState.tableau[from.index].splice(-cards.length);

      // Flip previous tableau card
      if (from.pile === 'tableau' && newState.tableau[from.index].length > 0) {
        newState.tableau[from.index][newState.tableau[from.index].length - 1].faceUp = true;
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.index].push(...cards);
        newState.score += 10;
      } else {
        newState.foundations[to.index].push(...cards);
        newState.score += 40 * cards.length;
      }
      newState.moves++;
      break;

    case 'UNDO':
      if (newState.history.length > 1) {
        const prev = newState.history[newState.history.length - 2];
        newState.future = [newState.history.pop()!];
        Object.assign(newState, prev);
        newState.score -= 10; // Penalty for undo
      }
      break;

    case 'REDO':
      if (newState.future.length > 0) {
        const next = newState.future.pop()!;
        newState.history.push({ ...newState });
        Object.assign(newState, next);
      }
      break;

    case 'AUTO_COMPLETE':
      // Simple auto-move to foundations if possible
      for (let i = 0; i < 4; i++) {
        const foundation = newState.foundations[i];
        const top = foundation[foundation.length - 1];
        // Find movable aces/kings etc. from waste/tableau ends
        if (newState.waste.length > 0 && isValidFoundationMove(newState.waste[0], top, suits[i])) {
          newState.foundations[i].push(newState.waste.shift()!);
          newState.score += 40;
        }
        // Similar for tableau ends...
        newState.tableau.forEach((pile, j) => {
          if (pile.length > 0 && pile[pile.length - 1].faceUp && isValidFoundationMove(pile[pile.length - 1], top, suits[i])) {
            newState.foundations[i].push(newState.tableau[j].pop()!);
            newState.score += 40;
          }
        });
      }
      break;

    case 'HINT':
      // Simple hint: find first valid move
      newState.hint = { from: 0, to: 0, type: 'tableau' }; // Placeholder logic
      break;
  }

  // Check win/lose
  const allFoundationsComplete = newState.foundations.every(f => f.length === 13);
  newState.gameWon = allFoundationsComplete;
  if (!newState.gameWon && newState.stock.length === 0 && newState.waste.length === 0 && !hasValidMoves(newState)) {
    newState.gameLost = true;
  }

  function hasValidMoves(state: KlondikeState): boolean {
    // Check waste to tableau/foundation
    if (state.waste.length > 0) {
      const wasteTop = state.waste[0];
      for (let i = 0; i < 7; i++) {
        const tableauTop = state.tableau[i][state.tableau[i].length - 1];
        if (isValidTableauMove(wasteTop, tableauTop) || isValidTableauMove(wasteTop, null)) return true;
      }
      for (let i = 0; i < 4; i++) {
        const foundationTop = state.foundations[i][state.foundations[i].length - 1];
        if (isValidFoundationMove(wasteTop, foundationTop, suits[i])) return true;
      }
    }
    // Check tableau to tableau/foundation
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < state.tableau[i].length; j++) {
        const card = state.tableau[i][j];
        if (card.faceUp) {
          for (let k = 0; k < 7; k++) {
            if (i !== k) {
              const target = state.tableau[k][state.tableau[k].length - 1];
              if (isValidTableauMove(card, target) || isValidTableauMove(card, null)) return true;
            }
          }
          for (let k = 0; k < 4; k++) {
            const target = state.foundations[k][state.foundations[k].length - 1];
            if (isValidFoundationMove(card, target, suits[k])) return true;
          }
        }
      }
    }
    return false;
  }

  return newState;
};

const KlondikeBoard: React.FC = () => {
  const [state, dispatch] = React.useReducer(klondikeReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  // Daily challenge seed
  const isDaily = window.location.pathname.includes('/daily');
  React.useEffect(() => {
    if (isDaily) {
      const date = new Date();
      const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      dispatch({ type: 'NEW_GAME', seed });
    }
  }, [isDaily]);

  // Save stats
  React.useEffect(() => {
    if (state.gameWon) {
      const stats = JSON.parse(localStorage.getItem('solitaireStats') || '{}');
      stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      stats.gamesWon = (stats.gamesWon || 0) + 1;
      stats.bestScore = Math.max(stats.bestScore || 0, state.score);
      localStorage.setItem('solitaireStats', JSON.stringify(stats));
      toast({ title: 'Congratulations! You won!', description: `Score: ${state.score}` });
    }
  }, [state.gameWon, state.score, toast]);

  const [{ isOver }, stockDrop] = useDrop(() => ({
    accept: 'card',
    drop: () => {}, // Stock doesn't accept drops
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const renderPile = (cards: CardType[], index: number, type: 'tableau' | 'foundation' | 'stock' | 'waste', foundationSuit?: Suit) => (
    <motion.div
      className={cn(
        "flex flex-col space-y-[-8px] p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md",
        type === 'tableau' && "h-24",
        type === 'foundation' && "w-16 h-24",
        type === 'stock' && "w-16 h-24 cursor-pointer hover:shadow-lg",
        type === 'waste' && "w-16 h-24"
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      ref={type === 'stock' ? stockDrop : undefined}
      onClick={() => type === 'stock' && dispatch({ type: 'DRAW', count: 1 })}
    >
      <AnimatePresence>
        {cards.map((card, i) => (
          <CardComponent
            key={card.id}
            card={card}
            index={i}
            pileType={type}
            foundationSuit={foundationSuit}
            onDrop={(droppedCards) => {
              dispatch({ type: 'MOVE', from: { pile: type, index }, to: { pile: 'tableau', index, cards: droppedCards } });
            }}
          />
        ))}
      </AnimatePresence>
      {type === 'foundation' && cards.length === 0 && (
        <div className="w-16 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
          <Crown className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </motion.div>
  );

  if (state.gameWon) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-lg shadow-xl"
        >
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Victory!</h2>
          <p>Score: {state.score} | Moves: {state.moves}</p>
          <Button onClick={() => dispatch({ type: 'NEW_GAME' })} className="mt-4">
            New Game
          </Button>
        </motion.div>
      </div>
    );
  }

  if (state.gameLost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-lg shadow-xl"
        >
          <Card className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p>No more moves!</p>
          <Button onClick={() => dispatch({ type: 'NEW_GAME' })} className="mt-4">
            New Game
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => dispatch({ type: 'UNDO' })} disabled={state.history.length <= 1}>
            <Undo className="w-4 h-4 mr-2" /> Undo
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'REDO' })} disabled={state.future.length === 0}>
            <Redo className="w-4 h-4 mr-2" /> Redo
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'HINT' })}>
            <Lightbulb className="w-4 h-4 mr-2" /> Hint
          </Button>
          <Button onClick={() => dispatch({ type: 'AUTO_COMPLETE' })}>
            <Zap className="w-4 h-4 mr-2" /> Auto-Complete
          </Button>
        </div>
        <div className="text-2xl font-bold">Score: {state.score} | Moves: {state.moves}</div>
      </div>

      {/* Stock and Waste */}
      <div className="flex justify-center space-x-4 mb-8">
        {renderPile(state.stock, 0, 'stock')}
        {renderPile(state.waste, 0, 'waste')}
      </div>

      {/* Tableau */}
      <div className="flex justify-center space-x-4 mb-8">
        {state.tableau.map((pile, i) => renderPile(pile, i, 'tableau'))}
      </div>

      {/* Foundations */}
      <div className="flex justify-center space-x-4">
        {state.foundations.map((pile, i) => renderPile(pile, i, 'foundation', suits[i]))}
      </div>

      {state.hint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded"
        >
          Hint: Move from {state.hint.from} to {state.hint.to} ({state.hint.type})
        </motion.div>
      )}
    </div>
  );
};

export default KlondikeBoard;