import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail } from 'lucide-react';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-white/90 backdrop-blur-xl shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">About Solitaire Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <p className="text-lg leading-relaxed">
              Solitaire Pro is a premium collection of classic card games designed for modern web. Our core focus is on smooth gameplay, realistic animations, and engaging features like daily challenges and detailed statistics to keep you coming back.
            </p>
            <div className="flex items-center space-x-4">
              <Users className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold">Our Team</h3>
                <p>A dedicated group of developers and designers passionate about recreating timeless games with elegant UI and intuitive controls.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>Email us at support@solitairepro.com for feedback or suggestions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithApplaa />
    </div>
  );
};

export default About;