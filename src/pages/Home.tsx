import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Gamepad2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Home = () => {
  const [stats] = useLocalStorage('solitaire-stats', { games: 0, wins: 0 });

  const winRate = stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Solitaire Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8">Classic card games with modern twists. Play now!</p>
          <div className="bg-white/80 backdrop-blur-xl rounded-lg p-6 shadow-lg inline-block">
            <div className="flex items-center justify-center space-x-4">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span>Win Rate: {winRate}% ({stats.wins}/{stats.games} games)</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/klondike/$" search={{ daily: false }} className="block">
            <Card className="h-full bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-6 h-6" />
                  <span>Klondike</span>
                </CardTitle>
                <CardDescription>The classic solitaire - build suits from Ace to King.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Play Klondike</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/spider" className="block">
            <Card className="h-full bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-6 h-6" />
                  <span>Spider</span>
                </CardTitle>
                <CardDescription>Two decks, 10 columns - coming soon!</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" disabled>Play Spider (Soon)</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/freecell" className="block">
            <Card className="h-full bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-6 h-6" />
                  <span>FreeCell</span>
                </CardTitle>
                <CardDescription>Strategic with free cells - coming soon!</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" disabled>Play FreeCell (Soon)</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-xl shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
            <Crown className="w-8 h-8" />
            <span>Daily Challenge</span>
          </h2>
          <p className="text-lg mb-4">Test your skills with today's unique deal!</p>
          <Link to="/klondike/$" search={{ daily: true }}>
            <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
              Play Daily Challenge
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <Link to="/stats" className="text-blue-600 hover:underline">View Full Stats</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;