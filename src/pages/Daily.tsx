import React from 'react';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Daily: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Daily Challenge
        </h1>
        <p className="text-gray-600 mb-8">A unique Klondike deck seeded by today's date. Beat your best score!</p>
      </div>
      <GameBoard variant="klondike" />
      <MadeWithApplaa />
    </div>
  );
};

export default Daily;