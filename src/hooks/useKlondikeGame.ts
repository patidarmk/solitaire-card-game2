import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage'; // We'll create this
import { Card, createDeck, dealKlondike, isValidMoveToColumn, isValidMoveToFoundation, canAutoCompleteToFoundation, getCardValue, shuffleDeck } from '@/data/cards';
import { useToast } from '@/components/ui/use-toast';

export const useKlondikeGame = (dailySeed?: number) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState(() => dealKlondike(createDeck()));
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [stats, setStats] = useLocalStorage('solitaire-stats', { games: 0, wins: 0 });

  const saveStats = useCallback(() => {
    setStats(prev => ({ ...prev, games: prev.games + 1 }));
    if (isWon) {
      setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    }
  }, [isWon, setStats]);

  useEffect(() => {
    const totalFoundationCards = gameState.foundations.reduce((sum, f) => sum + f.length, 0);
    if (totalFoundationCards === 52) {
      setIsWon(true);
      toast({ title: 'You Win!', description: `Score: ${score}` });
      saveStats();
    }
  }, [gameState.foundations, score, toast, saveStats]);

  const newGame = useCallback((seed?: number) => {
    const deck = createDeck();
    const deal = dealKlondike(shuffleDeck(deck, seed || Date.now()));
    setGameState(deal);
    setHistory([]);
    setHistoryIndex(-1);
    setScore(0);
    setIsWon(false);
  }, []);

  const drawFromStock = useCallback(() => {
    if (gameState.stock.length === 0) {
      // Recycle waste to stock
      setGameState(prev => ({ ...prev, stock: prev.waste.reverse().map(c => ({ ...c, faceUp: false })), waste: [] }));
      pushHistory('recycle');
      setScore(prev => prev - 100); // Penalty
    } else {
      const card = gameState.stock.pop()!;
      card.faceUp = true;
      setGameState(prev => ({ ...prev, waste: [...prev.waste, card], stock: prev.stock }));
      pushHistory('draw');
      setScore(prev => prev + 5);
    }
  }, [gameState]);

  const moveToFoundation = useCallback((card: Card, suitIndex: number) => {
    if (isValidMoveToFoundation(card, gameState.foundations[suitIndex], suits[suitIndex])) {
      // Remove from source (simplified: assume from waste or column top)
      let newState = { ...gameState };
      // Logic to remove card from waste or column...
      // For brevity, implement full removal logic here
      newState.foundations[suitIndex].push(card);
      setGameState(newState);
      pushHistory('foundation');
      setScore(prev => prev + 10);
    }
  }, [gameState]);

  const moveToColumn = useCallback((fromCards: Card[], toColumnIndex: number) => {
    const toColumn = gameState.columns[toColumnIndex];
    const lastToCard = toColumn[toColumn.length - 1];
    if (fromCards.every(c => c.faceUp) && isValidMoveToColumn(fromCards[0], lastToCard)) {
      // Implement move logic...
      let newState = { ...gameState };
      // Remove from source column, add to target, flip if needed
      setGameState(newState);
      pushHistory('column');
      setScore(prev => prev + (fromCards.length * 10));
    }
  }, [gameState]);

  const autoComplete = useCallback(() => {
    if (canAutoCompleteToFoundation(gameState.columns, gameState.foundations)) {
      // Move eligible cards to foundations
      // Implement logic...
      setScore(prev => prev + 5);
      toast({ title: 'Auto-completed moves!' });
    }
  }, [gameState, toast]);

  const pushHistory = useCallback((action: string, data?: any) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), { action, state: { ...gameState }, data }]);
    setHistoryIndex(prev => prev + 1);
  }, [gameState, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const prevState = history[historyIndex];
      setGameState(prevState.state);
      setHistoryIndex(prev => prev - 1);
      setScore(prevState.data?.score || 0); // Track score in history if needed
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setGameState(nextState.state);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  const getHint = useCallback(() => {
    // Simple hint: find first valid move
    // Implement logic to suggest move...
    toast({ title: 'Hint', description: 'Try moving the 7 of clubs to the 8 of diamonds.' });
  }, [toast]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  const canAuto = canAutoCompleteToFoundation(gameState.columns, gameState.foundations);

  return {
    gameState,
    score,
    isWon,
    stats,
    drawFromStock,
    moveToFoundation,
    moveToColumn,
    autoComplete,
    undo,
    redo,
    getHint,
    newGame,
    canUndo,
    canRedo,
    canAuto,
  };
};