"use client";
import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Card as CardType, getCardImage, isValidTableauMove, isValidFoundationMove } from '@/data/cards';
import { cn } from '@/lib/utils';
import { Card, Crown } from 'lucide-react';

interface CardProps {
  card: CardType;
  onDragStart?: () => void;
  onDrop?: (target: CardType[]) => void;
  isDragging?: boolean;
  position?: { x: number; y: number };
  index: number;
  pileType: 'tableau' | 'foundation' | 'stock' | 'waste';
  foundationSuit?: string;
}

const Card: React.FC<CardProps> = ({ card, onDragStart, onDrop, isDragging, position, index, pileType, foundationSuit }) => {
  const [{ isDragging: dragState }, drag] = useDrag(() => ({
    type: 'card',
    item: { card, index, pileType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => card.faceUp && (pileType === 'tableau' || pileType === 'waste'),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { card: CardType; index: number; pileType: string }) => {
      if (onDrop && isValidMove(item.card, card, pileType, foundationSuit)) {
        onDrop([item.card]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    canDrop: (item) => isValidMove(item.card, card, pileType, foundationSuit),
  }));

  const isValidMove = (fromCard: CardType, toCard: CardType | null, pileType: string, foundationSuit?: string): boolean => {
    if (!toCard) {
      if (pileType === 'tableau' && fromCard.rank === 'K') return true;
      if (pileType === 'foundation' && fromCard.rank === 'A' && (!foundationSuit || fromCard.suit === foundationSuit)) return true;
      return false;
    }
    if (pileType === 'tableau') return isValidTableauMove(fromCard, toCard);
    if (pileType === 'foundation') return isValidFoundationMove(fromCard, toCard, foundationSuit as any);
    return false;
  };

  const cardRef = React.useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className={cn(
        "w-16 h-24 bg-white border-2 border-gray-300 rounded shadow-lg relative flex-shrink-0",
        isDragging && "opacity-0",
        isOver && "ring-2 ring-green-500",
        !card.faceUp && "bg-gray-800"
      )}
      style={{
        transform: isDragging ? `translate(${position?.x}px, ${position?.y}px)` : undefined,
        zIndex: isDragging ? 1000 : index,
      }}
      initial={{ scale: 0.9, rotateY: 180 }}
      animate={{ scale: 1, rotateY: card.faceUp ? 0 : 180 }}
      transition={{ duration: 0.3, type: 'spring' }}
      drag={isDragging ? false : undefined}
      onDragStart={onDragStart}
    >
      {card.faceUp ? (
        <>
          <img src={getCardImage(card)} alt={`${card.rank} of ${card.suit}`} className="w-full h-full object-cover rounded" />
          <div className="absolute top-1 left-1 text-xs font-bold text-white drop-shadow">
            {card.rank}
          </div>
          <div className="absolute bottom-1 right-1 text-xs font-bold text-white drop-shadow rotate-180">
            {card.rank}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-8 h-8 text-gray-500" />
        </div>
      )}
    </motion.div>
  );
};

export default Card;