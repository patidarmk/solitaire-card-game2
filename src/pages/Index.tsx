import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Crown, Zap } from 'lucide-react';
import Header from '@/components/Header';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Index: React.FC = () => {
  const games = [
    { name: 'Klondike', description: 'Classic solitaire with alternating colors and foundation building.', path: '/klondike', icon: Crown },
    { name: 'Spider', description: 'Challenging 2-deck game, build descending in same suit.', path: '/spider', icon: Gamepad2 },
    { name: 'FreeCell', description: 'Strategic game with free cells for temporary storage.', path: '/freecell', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-black bg-clip-text text-transparent mb-4">
            Solitaire Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enjoy classic card games with smooth animations, scoring, and daily challenges. Build foundations from Ace to King!
          </p>
          <Link to="/daily" className="mt-8 inline-block">
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-black hover:from-red-600">
              <Zap className="w-5 h-5 mr-2" /> Today's Challenge
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.name} to={game.path}>
                <Card className="h-full bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <CardTitle className="text-center">{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{game.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="text-center mt-16">
          <Link to="/stats">
            <Button variant="outline" size="lg">View Statistics</Button>
          </Link>
        </section>
      </main>
      <MadeWithApplaa />
    </div>
  );
};

export default Index;