"use client";
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import KlondikeBoard from './KlondikeBoard';

interface GameBoardProps {
  variant: 'klondike' | 'spider' | 'freecell';
}

const GameBoard: React.FC<GameBoardProps> = ({ variant }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      >
        {variant === 'klondike' && <KlondikeBoard />}
        {variant === 'spider' && <div className="text-center py-20">Spider Solitaire - Coming Soon (2 decks, same suit descending)</div>}
        {variant === 'freecell' && <div className="text-center py-20">FreeCell Solitaire - Coming Soon (8 columns, 4 free cells, supermoves)</div>}
      </motion.div>
    </DndProvider>
  );
};

export default GameBoard;