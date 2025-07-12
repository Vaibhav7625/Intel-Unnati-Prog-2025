
import React, { useState } from 'react';
import { AiAssistant } from '@/components/AiAssistant';
import { EngagementMonitor } from '@/components/EngagementMonitor';
import { VisualAidsPanel } from '@/components/VisualAidsPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf, Microscope, Dna } from 'lucide-react';
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

const Biology = () => {
  const [engagementData, setEngagementData] = useState<EngagementData>({
    level: 'high',
    score: 89,
    studentsActive: 27,
    totalStudents: 28,
    focusMetrics: {
      attention: 92,
      participation: 85,
      comprehension: 90
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Biology Assistant</h1>
                <p className="text-green-100">Cell Biology & Genetics</p>
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
            <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
              <AiAssistant 
                subject="Biology" 
                onEngagementChange={handleEngagementChange} 
              />
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-100">DNA Analysis</p>
                    <p className="text-2xl font-bold">{engagementData.score}%</p>
                  </div>
                  <Dna className="w-8 h-8 text-emerald-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-100">Lab Work</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Microscope className="w-8 h-8 text-teal-100" />
                </div>
              </Card>
            </div>

            <Card className="flex-1 shadow-xl border-0">
              <VisualAidsPanel currentTopic="Photosynthesis" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Biology;
