
import React, { useState } from 'react';
import { AiAssistant } from '@/components/AiAssistant';
import { EngagementMonitor } from '@/components/EngagementMonitor';
import { VisualAidsPanel } from '@/components/VisualAidsPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, PieChart, BarChart3 } from 'lucide-react';
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

const Mathematics = () => {
  const [engagementData, setEngagementData] = useState<EngagementData>({
    level: 'high',
    score: 85,
    studentsActive: 26,
    totalStudents: 28,
    focusMetrics: {
      attention: 88,
      participation: 82,
      comprehension: 85
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with Math Theme */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
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
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mathematics Assistant</h1>
                <p className="text-blue-100">Advanced Problem Solving & Algebra</p>
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
            <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <AiAssistant 
                subject="Mathematics" 
                onEngagementChange={handleEngagementChange} 
              />
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Engagement</p>
                    <p className="text-2xl font-bold">{engagementData.score}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100">Problems Solved</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <PieChart className="w-8 h-8 text-purple-100" />
                </div>
              </Card>
            </div>

            <Card className="flex-1 shadow-xl border-0">
              <VisualAidsPanel currentTopic="Quadratic Equations" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mathematics;
