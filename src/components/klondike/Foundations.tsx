"use client";
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Card as CardType, Suit } from '@/data/cards';
import { cn } from '@/lib/utils';

interface FoundationsProps {
  foundations: CardType[][];
  onDrop: (suitIndex: number, cards: CardType[]) => void;
}

export const Foundations: React.FC<FoundationsProps> = ({ foundations, onDrop }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {foundations.map((foundation, suitIndex) => {
        const suit = suits[suitIndex];
        const { setNodeRef } = useDroppable({
          id: `foundation-${suit}`,
          onDrop: (event) => {
            const cards = event.active.data.current?.sortable?.items || [];
            onDrop(suitIndex, cards as CardType[]);
          },
        });

        const topCard = foundation[foundation.length - 1];

        return (
          <motion.div
            key={suit}
            ref={setNodeRef}
            className={cn(
              "w-16 h-24 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-center",
              foundation.length > 0 && 'border-solid shadow-lg'
            )}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            {topCard ? (
              <Card card={topCard} />
            ) : (
              <div className="text-gray-400 text-xs font-medium">{suit.toUpperCase()}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};