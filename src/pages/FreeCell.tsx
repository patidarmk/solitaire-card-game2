import React from 'react';
import Header from '@/components/Header';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const FreeCell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">FreeCell Solitaire</h1>
        <p className="text-xl text-gray-600 mb-import React from 'react';
import Header from '@/components/Header';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const FreeCell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">FreeCell Solitaire</h1>
        <p className="text-xl text-gray-600 mb-8">Use 4 free cells and 4 cascades to build 4 foundation suits from Ace to King.</p>
        <p className="text-gray-500">Full implementation coming soon – single deck, strategic moves with holding cells.</p>
      </div>
      <MadeWithApplaa />
    </div>
  );
};

export default FreeCell;