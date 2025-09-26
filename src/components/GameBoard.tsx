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
        {variant === 'spider' && (
          <div className="text-center py-20 bg-white/90 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Spider Solitaire</h2>
            <p className="text-gray-600 mb-4">Two decks, same-suit descending sequences in 10 columns. Coming soon with full drag-drop!</p>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span className="text-6xl">🕷️</span>
            </motion.div>
          </div>
        )}
        {variant === 'freecell' && (
          <div className="text-center py-20 bg-white/90 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">FreeCell Solitaire</h2>
            <p className="text-gray-600 mb-4">8 columns, 4 free cells for strategic moves. Coming soon with supermove support!</p>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <span className="text-6xl">🆓</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DndProvider>
  );
};

export default GameBoard;