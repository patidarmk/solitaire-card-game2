import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from '@tanstack/react-router';
import { Gamepad2 } from 'lucide-react';

const FreeCell = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            FreeCell Solitaire
          </h1>
          <p className="text-xl text-gray-600">8 columns, 4 free cells - strategic building.</p>
        </div>
        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 mb-4">
              <Gamepad2 className="w-8 h-8" />
              <span>Game Rules</span>
            </CardTitle>
            <CardDescription>
              <ul className="space-y-2 text-left">
                <li>• Single deck, all cards dealt face up to 8 columns</li>
                <li>• 4 free cells for temporary storage (1 card each)</li>
                <li>• 4 foundation piles: build A-K by suit</li>
                <li>• Build descending alternating colors in columns</li>
                <li>• Move sequences based on free cells (up to 4x length)</li>
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
              <Link to="/klondike">
                <Button>Play Klondike Instead</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeCell;