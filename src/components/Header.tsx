"use client";
import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/klondike/', label: 'Klondike' },
  { href: '/spider', label: 'Spider' },
  { href: '/freecell', label: 'FreeCell' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/stats', label: 'Stats' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white font-bold text-lg">S</span>
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Solitaire
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md",
                  pathname === item.href && 'bg-blue-100 text-blue-600'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-gray-700 hover:text-blue-600 transition-colors font-medium",
                      pathname === item.href && 'text-blue-600 font-bold'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};