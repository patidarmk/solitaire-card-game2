"use client";
import React, { useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { KlondikeGameProvider, useKlondikeGame } from '@/hooks/useKlondikeGame';
import { GameControls } from '@/components/GameControls';
import { Column } from '@/components/klondike/Column';
import { Foundations } from '@/components/klondike/Foundations';
import { StockAndWaste } from '@/components/klondike/StockAndWaste';
import { motion } from 'framer-motion';
import { Card } from '@/data/cards';

const KlondikeInner = () => {
  const search = useSearch({ from: '/klondike' });
  const isDaily = search.daily;
  const {
    gameState,
    score,
    isWon,
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
  } = useKlondikeGame(isDaily ? new Date().getDate() : undefined);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      if (over.id.startsWith('foundation-')) {
        const suitIndex = parseInt(over.id.split('-')[1]);
        // Find card by id, move to foundation
        const card = gameState.waste.find(c => c.id === active.id) || /* from column */;
        if (card) moveToFoundation(card, suitIndex);
      } else if (over.id.startsWith('column-')) {
        const targetIndex = parseInt(over.id.split('-')[1]);
        // Get dragged cards sequence, move to column
        const fromCards = []; // Implement sequence
        moveToColumn(fromCards, targetIndex);
      }
    }
  };

  useEffect(() => {
    newGame(isDaily ? new Date().getDate() : undefined);
  }, [isDaily, newGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4">
      <div className="container mx-auto px-4">
        <GameControls
          score={score}
          onNewGame={() => newGame()}
          onAutoComplete={autoComplete}
          onUndo={undo}
          onRedo={redo}
          onHint={getHint}
          canUndo={canUndo}
          canRedo={canRedo}
          canAutoComplete={canAuto}
          isWon={isWon}
        />
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center">
            <StockAndWaste
              stock={gameState.stock}
              waste={gameState.waste}
              onDraw={drawFromStock}
              onWasteClick={(card) => {/* Handle waste click to move */}}
            />
            <Foundations
              foundations={gameState.foundations}
              onDrop={moveToFoundation}
            />
            <div className="flex space-x-2 mt-4 justify-center">
              {gameState.columns.map((column, index) => (
                <Column
                  key={index}
                  id={index}
                  cards={column}
                  onCardClick={(card, idx) => {/* Flip or move */}}
                  onDrop={(cards, targetIdx) => moveToColumn(cards, index)}
                />
              ))}
            </div>
          </div>
        </DndContext>
        {isWon && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Victory!</h2>
              <Button onClick={() => newGame()}>Play Again</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Klondike = () => (
  <KlondikeGameProvider>
    <KlondikeInner />
  </KlondikeGameProvider>
);

export default Klondike;

// Provider wrapper (simplified, full context in hook)
const KlondikeGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};