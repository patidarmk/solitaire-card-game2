"use client";
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Card as CardType } from '@/data/cards';
import { cn } from '@/lib/utils';

interface ColumnProps {
  id: number;
  cards: CardType[];
  onCardClick: (card: CardType, index: number) => void;
  onDrop: (cards: CardType[], targetIndex: number) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, cards, onCardClick, onDrop }) => {
  const { setNodeRef } = useDroppable({
    id: `column-${id}`,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className="flex flex-col space-y-0.5 w-20 h-full min-h-[200px] bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SortableContext id={cards.map(c => c.id)} items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {cards.map((card, index) => (
          <SortableCard
            key={card.id}
            card={card}
            index={index}
            onClick={() => onCardClick(card, index)}
            onDrop={onDrop}
          />
        ))}
      </SortableContext>
      {cards.length === 0 && (
        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
          Empty
        </div>
      )}
    </motion.div>
  );
};

interface SortableCardProps {
  card: CardType;
  index: number;
  onClick: () => void;
  onDrop: (cards: CardType[], targetIndex: number) => void;
}

const SortableCard: React.FC<SortableCardProps> = ({ card, index, onClick, onDrop }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 0,
    position: 'relative' as const,
  };

  const [draggedCards, setDraggedCards] = useState<CardType[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!card.faceUp) return;
    // Find sequence of alternating color descending cards from this index
    const sequence: CardType[] = [card];
    for (let i = index - 1; i >= 0; i--) {
      const prev = cards[i];
      if (prev.faceUp && isValidMoveToColumn(sequence[0], prev)) {
        sequence.unshift(prev);
      } else break;
    }
    setDraggedCards(sequence);
    listeners.onMouseDown?.(e);
  };

  return (
    <motion.div style={style} ref={setNodeRef} className={cn(isDragging && 'opacity-0')}>
      <Card
        card={card}
        isDragging={isDragging}
        onClick={onClick}
        {...attributes}
        {...listeners}
        onMouseDown={handleMouseDown}
      />
      {draggedCards.length > 1 && draggedCards.includes(card) && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};