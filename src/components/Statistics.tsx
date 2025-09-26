"use client";
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BarChart3, Target } from 'lucide-react';

const Statistics: React.FC = () => {
  const [stats, setStats] = React.useState({ gamesPlayed: 0, gamesWon: 0, bestScore: 0 });

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('solitaireStats') || '{}');
    setStats(saved);
  }, []);

  const winRate = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Trophy className="w-6 h-6 mr-2" /> Solitaire Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-between">
            <span>Games Played:</span>
            <span className="font-bold">{stats.gamesPlayed}</span>
          </div>
          <div className="flex justify-between">
            <span>Games Won:</span>
            <span className="font-bold">{stats.gamesWon}</span>
          </div>
          <div className="flex justify-between">
            <span>Win Rate:</span>
            <span className="font-bold">{winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span>Best Score:</span>
            <span className="font-bold">{stats.bestScore}</span>
          </div>
          <div className="flex justify-center mt-4">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;