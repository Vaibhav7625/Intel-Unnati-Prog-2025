import React, { useState } from 'react';
import { AiAssistant } from '@/components/AiAssistant';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Brain, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiChat = () => {
  const [currentSubject, setCurrentSubject] = useState('General');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Learning Chat</h1>
                <p className="text-indigo-100">Interactive AI Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-140px)] shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
          <AiAssistant subject={currentSubject} />
        </Card>
      </main>
    </div>
  );
};

export default AiChat;