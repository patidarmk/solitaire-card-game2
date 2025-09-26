"use client";
import React, { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { getCardValue } from '@/data/cards';
import { Card as CardType, Suit } from '@/data/cards';
import { cn } from '@/lib/utils';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  isDragging?: boolean;
  onClick?: () => void;
  pileType?: 'tableau' | 'foundation' | 'waste';
}

const suitIcons = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
} as const;

const getSuitColor = (suit: Suit) => (suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black');

export const CardComponent = forwardRef<HTMLDivElement, CardProps>(({ card, isDragging, onClick, pileType = 'tableau' }, ref) => {
  const [{ isDragging: dragIsActive }, drag] = useDrag(() => ({
    type: 'card',
    item: { card, pileType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, pileType]);

  const combinedRef = (node: HTMLDivElement | null) => {
    drag(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  if (!card.faceUp) {
    return (
      <motion.div
        ref={combinedRef}
        className="w-16 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-md relative overflow-hidden cursor-pointer"
        initial={{ scale: 1 }}
        animate={{ scale: isDragging ? 1.05 : 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </motion.div>
    );
  }

  const SuitIcon = suitIcons[card.suit];
  const rankValue = getCardValue(card.rank);

  return (
    <motion.div
      ref={combinedRef}
      className={cn(
        "w-16 h-24 bg-white rounded-lg shadow-lg border relative cursor-pointer flex flex-col justify-between p-1 z-10",
        card.color === 'red' ? 'text-red-600' : 'text-black',
        isDragging && 'shadow-2xl scale-105 z-50',
        pileType === 'tableau' && 'mb-[-8px]' // Stacking offset
      )}
      initial={{ rotateY: 180, scale: 0.9 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-xs">{card.rank}</span>
        <SuitIcon className={cn("w-3 h-3", getSuitColor(card.suit))} />
      </div>
      <div className="flex justify-center items-center flex-1">
        <div className="text-lg font-bold">{rankValue > 10 ? card.rank : rankValue}</div>
      </div>
      <div className="flex justify-end items-end">
        <SuitIcon className={cn("w-3 h-3 rotate-180", getSuitColor(card.suit))} />
      </div>
    </motion.div>
  );
});

CardComponent.displayName = 'CardComponent';