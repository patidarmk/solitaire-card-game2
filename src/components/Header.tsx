"use client";
import * as React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Klondike', path: '/klondike' },
    { name: 'Spider', path: '/spider' },
    { name: 'FreeCell', path: '/freecell' },
    { name: 'Daily Challenge', path: '/daily' },
    { name: 'Statistics', path: '/stats' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-black bg-clip-text text-transparent">
              Solitaire Pro
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-gray-700 hover:text-red-600 transition-colors font-medium",
                  router.state.location.pathname === item.path && "text-red-600 border-b-2 border-red-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-gray-700 hover:text-red-600 transition-colors font-medium",
                      router.state.location.pathname === item.path && "text-red-600 font-bold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;