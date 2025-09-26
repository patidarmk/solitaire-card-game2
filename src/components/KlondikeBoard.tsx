"use client";
import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Crown, Undo, Redo, Lightbulb, Zap, Trophy, Card } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CardComponent } from './Card';
import { Card as CardType, createDeck, dealKlondike, getCardValue, isValidTableauMove, isValidFoundationMove, suits, hasValidMoves, isGameWon } from '@/data/cards';
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
  future: KlondikeState[];
  gameWon: boolean;
  gameLost: boolean;
  hint: { from: string; to: string; type: 'tableau' | 'foundation' } | null;
}

type Action =
  | { type: 'DRAW' }
  | { type: 'MOVE'; from: { pile: 'waste' | 'tableau'; pileIndex: number; cardIndex: number }; to: { pile: 'tableau' | 'foundation'; pileIndex: number }; cards: CardType[] }
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

const deepCloneState = (state: KlondikeState): KlondikeState => ({
  ...state,
  stock: state.stock.map(c => ({ ...c })),
  waste: state.waste.map(c => ({ ...c })),
  tableau: state.tableau.map(col => col.map(c => ({ ...c }))),
  foundations: state.foundations.map(pile => pile.map(c => ({ ...c }))),
  history: [...state.history],
  future: [...state.future],
});

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  let newState = deepCloneState(state);

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const dealt = dealKlondike(deck);
      newState = { ...initialState, stock: dealt.stock, tableau: dealt.tableau, waste: dealt.waste, foundations: dealt.foundations };
      newState.history = [];
      return newState;

    case 'DRAW':
      if (newState.stock.length > 0) {
        const card = { ...newState.stock.pop()! };
        card.faceUp = true;
        newState.waste.unshift(card);
        newState.score += 5;
      } else if (newState.waste.length > 0) {
        newState.stock = newState.waste.reverse().map(c => ({ ...c, faceUp: false }));
        newState.waste = [];
        newState.score -= 100;
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'MOVE':
      const { from, to, cards } = action;
      let sourceCards = cards.map(c => ({ ...c }));
      if (from.pile === 'waste') {
        newState.waste = newState.waste.slice(sourceCards.length);
      } else {
        newState.tableau[from.pileIndex] = newState.tableau[from.pileIndex].slice(0, from.cardIndex).concat(newState.tableau[from.pileIndex].slice(from.cardIndex + sourceCards.length));
        if (newState.tableau[from.pileIndex].length > 0) {
          newState.tableau[from.pileIndex][newState.tableau[from.pileIndex].length - 1].faceUp = true;
        }
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.pileIndex] = [...newState.tableau[to.pileIndex], ...sourceCards];
        newState.score += 10 * sourceCards.length;
      } else {
        newState.foundations[to.pileIndex] = [...newState.foundations[to.pileIndex], ...sourceCards];
        newState.score += 40 * sourceCards.length;
      }
      newState.moves++;
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'UNDO':
      if (newState.history.length > 0) {
        const prev = newState.history.pop()!;
        newState.future.unshift(deepCloneState(newState));
        newState = deepCloneState(prev);
        newState.score -= 15;
      }
      break;

    case 'REDO':
      if (newState.future.length > 0) {
        const next = newState.future.shift()!;
        newState.history.push(deepCloneState(newState));
        newState = deepCloneState(next);
      }
      break;

    case 'AUTO_COMPLETE':
      for (let i = 0; i < 4; i++) {
        if (newState.waste.length > 0) {
          const topWaste = newState.waste[0];
          if (isValidFoundationMove(topWaste, newState.foundations[i][newState.foundations[i].length - 1] || null, suits[i])) {
            newState.foundations[i].push(newState.waste.shift()!);
            newState.score += 40;
          }
        }
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'HINT':
      newState.hint = { from: 'waste-0', to: 'tableau-0', type: 'tableau' };
      break;
  }

  newState.gameWon = isGameWon(newState.foundations);
  newState.gameLost = !newState.gameWon && newState.stock.length === 0 && newState.waste.length === 0 && !hasValidMoves({ waste: newState.waste, tableau: newState.tableau, foundations: newState.foundations });

  return newState;
};

// ... (rest of components DraggableCard, DroppablePile remain the same, but fix dispatch in handleMove)
const KlondikeBoardInner: React.FC<{ seed?: number }> = ({ seed }) => {
  const [state, dispatch] = React.useReducer(klondikeReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    dispatch({ type: 'NEW_GAME', seed: seed || Date.now() });
  }, [seed]);

  React.useEffect(() => {
    if (state.gameWon) {
      const stats = JSON.parse(localStorage.getItem('solitaire-stats') || '{}');
      stats.games = (stats.games || 0) + 1;
      stats.wins = (stats.wins || 0) + 1;
      localStorage.setItem('solitaire-stats', JSON.stringify(stats));
      toast({ title: 'Congratulations! You won!', description: `Score: ${state.score}` });
    }
  }, [state.gameWon, state.score, toast]);

  const handleDraw = () => dispatch({ type: 'DRAW' });
  const handleMove = (cards: CardType[], toPileIndex: number, toPileType: 'tableau' | 'foundation') => {
    dispatch({ type: 'MOVE', from: { pile: 'tableau' as const, pileIndex: 0, cardIndex: 0 }, to: { pile: toPileType, pileIndex: toPileIndex }, cards });
  };
  const handleUndo = () => dispatch({ type: 'UNDO' });
  const handleRedo = () => dispatch({ type: 'REDO' });
  const handleAutoComplete = () => dispatch({ type: 'AUTO_COMPLETE' });
  const handleHint = () => dispatch({ type: 'HINT' });
  const handleNewGame = () => dispatch({ type: 'NEW_GAME' });

  // ... (rest of render remains the same, with DroppablePile onDrop={ (cards, index, type) => handleMove(cards, index, type as 'tableau' | 'foundation') } )
  if (state.gameWon) {
    return (
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white/90 p-8 rounded-lg shadow-xl">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Victory!</h2>
          <p>Score: {state.score} | Moves: {state.moves}</p>
          <Button onClick={handleNewGame} className="mt-4">New Game</Button>
        </div>
      </motion.div>
    );
  }

  if (state.gameLost) {
    return (
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white/90 p-8 rounded-lg shadow-xl">
          <Card className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p>No more moves!</p>
          <Button onClick={handleNewGame} className="mt-4">New Game</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleUndo} disabled={state.history.length === 0}><Undo className="w-4 h-4 mr-2" />Undo</Button>
          <Button variant="outline" onClick={handleRedo} disabled={state.future.length === 0}><Redo className="w-4 h-4 mr-2" />Redo</Button>
          <Button variant="outline" onClick={handleHint}><Lightbulb className="w-4 h-4 mr-2" />Hint</Button>
          <Button onClick={handleAutoComplete}><Zap className="w-4 h-4 mr-2" />Auto-Complete</Button>
        </div>
        <div className="text-2xl font-bold">Score: {state.score} | Moves: {state.moves}</div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-16 h-24 bg-blue-200 rounded cursor-pointer" onClick={handleDraw}>Draw</div>
          <DroppablePile pile={state.waste.slice(-1)} pileIndex={0} pileType="waste" onDrop={(cards, index, type) => handleMove(cards, index, 'tableau')} />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {state.tableau.map((pile, i) => (
            <DroppablePile key={i} pile={pile} pileIndex={i} pileType="tableau" onDrop={handleMove} />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          {state.foundations.map((pile, i) => (
            <DroppablePile key={i} pile={pile.slice(-1)} pileIndex={i} pileType="foundation" onDrop={handleMove} />
          ))}
        </div>
      </DndProvider>

      {state.hint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
          Hint: Move from {state.hint.from} to {state.hint.to}
        </motion.div>
      )}
    </div>
  );
};

const KlondikeBoard: React.FC = () => <KlondikeBoardInner seed={undefined} />;

export default KlondikeBoard;