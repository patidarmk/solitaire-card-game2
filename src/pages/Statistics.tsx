import React from 'react';
import Header from '@/components/Header';
import Statistics from '@/components/Statistics';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const StatsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Statistics />
      <MadeWithApplaa />
    </div>
  );
};

export default StatsPage;