import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Calendar, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Challenges = () => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Daily Challenges
          </h1>
          <p className="text-xl text-gray-600">Unique deals every day - earn rewards!</p>
        </div>
        <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Today's Challenge ({today})</span>
              <Crown className="w-5 h-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Play Klondike with a special seeded deal. Complete it for bonus stats!</p>
            <Link to="/klondike/$" search={{ daily: true }}>
              <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">
                Accept Challenge
              </Button>
            </Link>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Challenges;