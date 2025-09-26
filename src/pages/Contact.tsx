import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, Phone } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message Sent!', description: 'We\'ll get back to you soon.' });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">Get in touch for feedback or support</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>hello@solitaireapp.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="pt-4">
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-gray-600">123 Card Street, Game City, GC 12345</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline">Back to Games</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;