import React from 'react';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Klondike: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <GameBoard variant="klondike" />
      <MadeWithApplaa />
    </div>
  );
};

export default Klondike;