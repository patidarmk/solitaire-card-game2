"use client";
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Klondike: React.FC = () => {
  const search = useSearch({ from: '/klondike' });
  const isDaily = search.daily;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      {isDaily && (
        <div className="container mx-auto px-4 py-4 text-center bg-yellow-100 border-b">
          <h2 className="text-2xl font-bold text-yellow-800">Daily Challenge</h2>
          <p className="text-yellow-700">Seeded deal for today - beat your record!</p>
        </div>
      )}
      <GameBoard variant="klondike" />
      <MadeWithApplaa />
    </div>
  );
};

export default Klondike;