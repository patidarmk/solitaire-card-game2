"use client";
import * as React from 'react';
import { DndProvider, useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card as CardIcon, Crown, Undo, Redo, Lightbulb, Zap, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CardComponent } from './Card';
import { Card as CardType, createDeck, getCardValue, isValidTableauMove, isValidFoundationMove, suits, hasValidMoves, isGameWon } from '@/data/cards';
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

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  let newState = { ...state, history: [...state.history, { ...state }], future: [] };

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const { stock, tableau } = dealKlondike(deck); // Use imported dealKlondike
      return { ...initialState, stock, tableau, history: [] };

    case 'DRAW':
      if (newState.stock.length > 0) {
        const card = newState.stock.pop()!;
        card.faceUp = true;
        newState.waste.push(card);
        newState.score += 5;
      } else if (newState.waste.length > 0) {
        newState.stock = newState.waste.reverse().map(c => ({ ...c, faceUp: false }));
        newState.waste = [];
        newState.score -= 100; // Recycle penalty
      }
      break;

    case 'MOVE':
      const { from, to, cards } = action;
      let sourceCards: CardType[] = [];
      if (from.pile === 'waste') {
        sourceCards = newState.waste.splice(0, cards.length);
      } else {
        sourceCards = newState.tableau[from.pileIndex].splice(from.cardIndex, cards.length);
        if (newState.tableau[from.pileIndex].length > 0) {
          newState.tableau[from.pileIndex][newState.tableau[from.pileIndex].length - 1].faceUp = true;
        }
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.pileIndex].push(...cards);
        newState.score += 10 * cards.length;
      } else {
        newState.foundations[to.pileIndex].push(...cards);
        newState.score += 40 * cards.length;
      }
      newState.moves++;
      break;

    case 'UNDO':
      if (newState.history.length > 0) {
        const prev = newState.history[newState.history.length - 1];
        newState.future = [newState];
        newState.history.pop();
        Object.assign(newState, prev);
        newState.score -= 15; // Undo penalty
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
      // Auto-move top cards to foundations if possible
      [...newState.waste, ...newState.tableau.flat().filter(c => c.faceUp)].forEach(card => {
        const suitIndex = suits.indexOf(card.suit);
        if (suitIndex !== -1) {
          const top = newState.foundations[suitIndex][newState.foundations[suitIndex].length - 1];
          if (isValidFoundationMove(card, top || null, card.suit)) {
            // Simulate move (simplified: remove from source, add to foundation)
            newState.foundations[suitIndex].push(card);
            newState.score += 40;
          }
        }
      });
      break;

    case 'HINT':
      // Find first valid move as hint
      newState.hint = { from: 'waste-0', to: 'tableau-0', type: 'tableau' }; // Placeholder; implement full scan
      break;
  }

  // Check win/lose
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
        const movableCards = [item.card]; // Extend to sequence for tableau
        if (pileType === 'tableau') {
          // Find descending sequence
          const pile = [] as CardType[]; // Get from context/state
          for (let i = index - 1; i >= 0; i--) {
            if (isValidTableauMove(pile[i], movableCards[0])) {
              movableCards.unshift(pile[i]);
            } else break;
          }
        }
        onMove(movableCards);
      }
    },
  }), [card, index, pileType]);

  return <CardComponent ref={drag} card={card} isDragging={isDragging} />;
};

const DroppablePile = ({ pile, pileIndex, pileType, children, onDrop }: { pile: CardType[]; pileIndex: number; pileType: 'tableau' | 'foundation'; children?: React.ReactNode; onDrop: (cards: CardType[]) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { card: CardType; index: number; pileType: string }) => {
      const movableCards = [item.card]; // Logic for sequence
      onDrop(movableCards);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [pileIndex, pileType]);

  return (
    <motion.div ref={drop} className={cn("flex flex-col space-y-[-8px] p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md", isOver && 'ring-2 ring-blue-500')}>
      <AnimatePresence>
        {pile.map((card, i) => (
          <DraggableCard key={card.id} card={card} index={i} pileType={pileType} onMove={() => {}} />
        ))}
      </AnimatePresence>
      {children}
    </motion.div>
  );
};

const KlondikeBoardInner: React.FC<{ seed?: number }> = ({ seed }) => {
  const [state, dispatch] = React.useReducer(klondikeReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    dispatch({ type: 'NEW_GAME', seed });
  }, [seed]);

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

  const handleDraw = () => dispatch({ type: 'DRAW' });
  const handleMove = (from: any, to: any, cards: CardType[]) => dispatch({ type: 'MOVE', from, to, cards });
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
          <CardIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
          <DroppablePile pile={state.stock} pileIndex={0} pileType="tableau" onDrop={() => {}}>
            <Button onClick={handleDraw} className="w-16 h-24 bg-blue-200 rounded">Draw</Button>
          </DroppablePile>
          <DroppablePile pile={state.waste} pileIndex={0} pileType="tableau" onDrop={(cards) => handleMove({ pile: 'waste', pileIndex: 0, cardIndex: 0 }, { pile: 'tableau', pileIndex: 0 }, cards)}>
            {state.waste.length > 0 && <DraggableCard card={state.waste[state.waste.length - 1]} index={0} pileType="waste" onMove={(cards) => {}} />}
          </DroppablePile>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {state.tableau.map((pile, i) => (
            <DroppablePile key={i} pile={pile} pileIndex={i} pileType="tableau" onDrop={(cards) => handleMove({ pile: 'tableau', pileIndex: i, cardIndex: 0 }, { pile: 'tableau', pileIndex: i }, cards)}>
              {pile.map((card, j) => (
                <DraggableCard key={card.id} card={card} index={j} pileType="tableau" onMove={(cards) => handleMove({ pile: 'tableau', pileIndex: i, cardIndex: j }, { pile: 'tableau', pileIndex: 0 }, cards)} />
              ))}
            </DroppablePile>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          {state.foundations.map((pile, i) => (
            <DroppablePile key={i} pile={pile} pileIndex={i} pileType="foundation" onDrop={(cards) => handleMove({ pile: 'tableau', pileIndex: 0, cardIndex: 0 }, { pile: 'foundation', pileIndex: i }, cards)}>
              {pile.length > 0 && <CardComponent card={pile[pile.length - 1]} />}
              {pile.length === 0 && <div className="w-16 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"><Crown className="w-6 h-6 text-gray-400" /></div>}
            </DroppablePile>
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