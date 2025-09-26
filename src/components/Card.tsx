"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Card as CardType, Suit, Rank } from '@/data/cards';
import { cn } from '@/lib/utils';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  isDragging?: boolean;
  onClick?: () => void;
}

const suitIcons = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
} as const;

const getSuitColor = (suit: Suit) => (suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black');

export const Card: React.FC<CardProps> = ({ card, isDragging, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (!card.faceUp) {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        className="w-16 h-24 bg-blue-200 rounded-lg shadow-md relative overflow-hidden"
        initial={{ scale: 1 }}
        animate={{ scale: isDragging ? 1.05 : 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-300" />
      </motion.div>
    );
  }

  const SuitIcon = suitIcons[card.suit];
  const rankValue = getCardValue(card.rank);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "w-16 h-24 bg-white rounded-lg shadow-lg border-2 border-gray-300 relative cursor-pointer flex flex-col justify-between p-1",
        card.color === 'red' ? 'text-red-600' : 'text-black',
        isDragging && 'shadow-2xl z-50'
      )}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
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
};