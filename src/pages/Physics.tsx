
import React, { useState } from 'react';
import { AiAssistant } from '@/components/AiAssistant';
import { EngagementMonitor } from '@/components/EngagementMonitor';
import { VisualAidsPanel } from '@/components/VisualAidsPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Atom, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EngagementData {
  level: 'high' | 'medium' | 'low';
  score: number;
  studentsActive: number;
  totalStudents: number;
  focusMetrics: {
    attention: number;
    participation: number;
    comprehension: number;
  };
}

const Physics = () => {
  const [engagementData, setEngagementData] = useState<EngagementData>({
    level: 'medium',
    score: 72,
    studentsActive: 24,
    totalStudents: 28,
    focusMetrics: {
      attention: 75,
      participation: 68,
      comprehension: 74
    }
  });

  const handleEngagementChange = (level: 'high' | 'medium' | 'low') => {
    setEngagementData(prev => ({
      ...prev,
      level,
      score: level === 'high' ? 85 : level === 'medium' ? 70 : 45
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Atom className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Physics Assistant</h1>
                <p className="text-indigo-100">Quantum Mechanics & Electromagnetism</p>
              </div>
            </div>
            
            <div className="text-white text-right">
              <p className="text-sm opacity-90">Active Students</p>
              <p className="text-2xl font-bold">{engagementData.studentsActive}/{engagementData.totalStudents}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          <div className="lg:col-span-2">
            <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-gray-900 to-slate-800 text-white">
              <AiAssistant 
                subject="Physics" 
                onEngagementChange={handleEngagementChange} 
              />
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-100">Wave Functions</p>
                    <p className="text-2xl font-bold">{engagementData.score}%</p>
                  </div>
                  <Zap className="w-8 h-8 text-cyan-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-violet-400 to-purple-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-violet-100">Experiments</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Activity className="w-8 h-8 text-violet-100" />
                </div>
              </Card>
            </div>

            <Card className="flex-1 shadow-xl border-0">
              <VisualAidsPanel currentTopic="Quantum Physics" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Physics;
