import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Users, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            About Solitaire Collection
          </h1>
          <p className="text-xl text-gray-600">Rediscover classic card games with premium design and features.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-6 h-6" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Built with modern React and Tailwind, this collection brings timeless solitaire variants to life. Starting with Klondike, we're expanding to Spider and FreeCell with smooth animations and smart features.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Professional UI with glassmorphism</li>
                <li>• Drag-and-drop physics</li>
                <li>• Stats and daily challenges</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-medium">Alex Developer</h4>
                    <p className="text-sm text-gray-500">Lead Developer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Designer</h4>
                    <p className="text-sm text-gray-500">UI/UX Designer</p>
                  </div>
                </div>
              </div>
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

export default About;