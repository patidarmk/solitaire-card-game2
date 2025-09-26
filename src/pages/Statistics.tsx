import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Header } from '@/components/Header';

const Statistics = () => {
  const [stats] = useLocalStorage('solitaire-stats', { games: 0, wins: 0, bestScore: 0 });

  const winRate = stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <Header />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
            Your Statistics
          </h1>
          <p className="text-xl text-gray-600">Track your solitaire journey</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.games}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wins</CardTitle>
              <Crown className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wins}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate}%</div>
              <Badge className={winRate > 50 ? 'bg-green-500' : 'bg-yellow-500'}>{winRate > 50 ? 'Great!' : 'Keep Going!'}</Badge>
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <Link to="/">
            <Button>Back to Games</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Statistics;