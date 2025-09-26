import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';

const Spider = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Spider Solitaire
          </h1>
          <p className="text-xl text-gray-600">Two decks, 10 columns - build suits descending.</p>
        </div>
        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 mb-4">
              <Gamepad2 className="w-8 h-8" />
              <span>Game Rules</span>
            </CardTitle>
            <CardDescription>
              <ul className="space-y-2 text-left">
                <li>• Use two decks of cards</li>
                <li>• 10 tableau columns, starting with 54 cards (face down except top 34)</li>
                <li>• Build descending sequences of same suit; move groups of same suit</li>
                <li>• 8 foundation piles: complete A-K in suit to remove</li>
                <li>• Stock deals 10 cards (1 per column) when no moves</li>
                <li>• Win: All cards in foundations</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="mb-4">Coming soon - full implementation with drag-drop and scoring!</p>
              <Link to="/">
                <Button variant="outline" className="mr-2">Back to Home</Button>
              </Link>
              <Link to="/klondike/$" search={{ daily: false }}>
                <Button>Play Klondike Instead</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Spider;