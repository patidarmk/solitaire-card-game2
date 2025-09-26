"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, Undo2, Lightbulb, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MadeWithApplaa } from '@/components/made-with-applaa';

interface GameControlsProps {
  score: number;
  onNewGame: () => void;
  onAutoComplete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canAutoComplete: boolean;
  isWon: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  score,
  onNewGame,
  onAutoComplete,
  onUndo,
  onRedo,
  onHint,
  canUndo,
  canRedo,
  canAutoComplete,
  isWon,
}) => {
  const { toast } = useToast();

  const handleNewGame = () => {
    if (isWon) {
      toast({ title: "Congratulations! You won!", description: `Final score: ${score}` });
    }
    onNewGame();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/90 backdrop-blur-xl rounded-lg shadow-lg mb-4">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <Button variant="outline" onClick={handleNewGame} className="flex items-center space-x-2">
          <Card className="w-4 h-4" />
          <span>New Game</span>
        </Button>
        {canAutoComplete && (
          <Button variant="outline" onClick={onAutoComplete} className="flex items-center space-x-2">
            Auto-Complete
          </Button>
        )}
        <Button variant="outline" onClick={onHint} disabled={!canUndo} className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
        </Button>
        <Button variant="outline" onClick={onUndo} disabled={!canUndo} className="flex items-center space-x-2">
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </Button>
        <Button variant="outline" onClick={onRedo} disabled={!canRedo} className="flex items-center space-x-2">
          <Undo2 className="w-4 h-4 rotate-180" />
          <span>Redo</span>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="font-bold">Score: {score}</span>
        </div>
      </div>
      <MadeWithApplaa />
    </div>
  );
};