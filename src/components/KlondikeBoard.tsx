"use client";
import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Crown, Undo, Redo, Lightbulb, Zap, Trophy, PlayingCard } from 'lucide-react';
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
  history: state.history.map(deepCloneState),
  future: state.future.map(deepCloneState),
});

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  let newState = deepCloneState(state);

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const dealt = dealKlondike(deck);
      newState = { ...initialState, ...dealt };
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
        newState.tableau[from.pileIndex] = newState.tableau[from.pileIndex].filter((_, idx) => idx < from.cardIndex || idx >= from.cardIndex + sourceCards.length);
        if (newState.tableau[from.pileIndex].length > 0) {
          newState.tableau[from.pileIndex][newState.tableau[from.pileIndex].length - 1].faceUp = true;
        }
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.pileIndex].push(...sourceCards);
        newState.score += 10 * sourceCards.length;
      } else {
        newState.foundations[to.pileIndex].push(...sourceCards);
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
          const topFoundation = newState.foundations[i][newState.foundations[i].length - 1] || null;
          if (isValidFoundationMove(topWaste, topFoundation, suits[i])) {
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
  newState.gameLost = !newState.gameWon && newState.stock.length === 0 && newState.waste.length === 0 && !hasValidMoves(newState);

  return newState;
};

const DraggableCard = ({ card, index, pileType, onMove }: { card: CardType; index: number; pileType: string; onMove: (cards: CardType[]) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card, index, pileType },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ pileIndex: number; pileType: string }>();
      if (dropResult && item.card) {
        const movableCards = [item.card];
        onMove(movableCards);
      }
    },
  }), [card, index, pileType, onMove]);

  return <CardComponent card={card} isDragging={isDragging} ref={drag as any} />;
};

const DroppablePile = ({ pile, pileIndex, pileType, onDrop }: { pile: CardType[]; pileIndex: number; pileType: 'tableau' | 'foundation' | 'waste'; onDrop: (cards: CardType[], pileIndex: number, pileType: string) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { card: CardType; index: number; pileType: string }) => {
      const movableCards = [item.card];
      onDrop(movableCards, pileIndex, pileType);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [pileIndex, pileType, onDrop]);

  return (
    <motion.div ref={drop} className={cn("flex flex-col space-y-[-8px] p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md", isOver && 'ring-2 ring-blue-500')}>
      <AnimatePresence>
        {pile.map((card, i) => (
          <DraggableCard key={card.id} card={card} index={i} pileType={pileType} onMove={() => {}} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

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
  const handleMove = (cards: CardType[], toPileIndex: number, toPileType: string) => {
    const pileType = toPileType as 'tableau' | 'foundation';
    dispatch({ type: 'MOVE', from: { pile: 'tableau' as const, pileIndex: 0, cardIndex: 0 }, to: { pile: pileType, pileIndex: toPileIndex }, cards });
  };
  const handleUndo = () => dispatch({ type: 'UNDO' });
  const handleRedo = () => dispatch({ type: 'REDO' });
  const handleAutoComplete = () => dispatch({ type: 'AUTO_COMPLETE' });
  const handleHint = () => dispatch({ type: 'HINT' });
  const handleNewGame = () => dispatch({ type: 'NEW_GAME' });

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
          <PlayingCard className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
          <DroppablePile pile={state.waste.slice(-1)} pileIndex={0} pileType="waste" onDrop={handleMove} />
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