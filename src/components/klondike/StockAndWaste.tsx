"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Card as CardType } from '@/data/cards';

interface StockAndWasteProps {
  stock: CardType[];
  waste: CardType[];
  onDraw: () => void;
  onWasteClick: (card: CardType) => void;
}

export const StockAndWaste: React.FC<StockAndWasteProps> = ({ stock, waste, onDraw, onWasteClick }) => {
  const topWaste = waste[waste.length - 1];

  return (
    <div className="flex space-x-2 mb-4">
      {/* Stock */}
      <motion.div
        className="w-16 h-24 bg-blue-200 rounded-lg shadow-md cursor-pointer relative overflow-hidden"
        onClick={stock.length > 0 ? onDraw : undefined}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-300" />
        {stock.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Empty</div>
        )}
      </motion.div>

      {/* Waste */}
      <motion.div
        className="w-16 h-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {topWaste ? (
          <Card card={topWaste} onClick={() => onWasteClick(topWaste)} />
        ) : (
          <div className="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
            Waste
          </div>
        )}
      </motion.div>
    </div>
  );
};