import React from 'react';
import Header from '@/components/Header';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Spider: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Spider Solitaire</h1>
        <p className="text-xl text-gray-600 mb-8">Advanced variant with two decks. Build descending sequences in the same suit across 10 tableau columns.</p>
        <p className="text-gray-500">Full implementation coming soon – drag-and-drop, 104 cards, 8 foundation suits.</p>
      </div>
      <MadeWithApplaa />
    </div>
  );
};

export default Spider;