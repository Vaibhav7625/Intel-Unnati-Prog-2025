
import React, { useState } from 'react';
import { EngagementMonitor } from '@/components/EngagementMonitor';
import { VisualAidsPanel } from '@/components/VisualAidsPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Users, TrendingUp, Eye, Brain, Activity } from 'lucide-react';
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

const Analytics = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Learning Analytics</h1>
                <p className="text-blue-100">Engagement Monitoring & Visual Aids</p>
              </div>
            </div>
            
            <div className="text-white text-right">
              <p className="text-sm opacity-90">Engagement Level</p>
              <p className="text-2xl font-bold capitalize">{engagementData.level}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Engagement Statistics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Active Students</p>
                    <p className="text-2xl font-bold">{engagementData.studentsActive}/{engagementData.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Attention</p>
                    <p className="text-2xl font-bold">{engagementData.focusMetrics.attention}%</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100">Participation</p>
                    <p className="text-2xl font-bold">{engagementData.focusMetrics.participation}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-100" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100">Comprehension</p>
                    <p className="text-2xl font-bold">{engagementData.focusMetrics.comprehension}%</p>
                  </div>
                  <Brain className="w-8 h-8 text-orange-100" />
                </div>
              </Card>
            </div>

            <Card className="flex-1 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <EngagementMonitor engagementData={engagementData} />
            </Card>
          </div>

          {/* Visual Aids Panel */}
          <div className="space-y-6">
            <Card className="p-4 bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">Overall Score</p>
                  <p className="text-3xl font-bold">{engagementData.score}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-indigo-100" />
              </div>
            </Card>

            <Card className="flex-1 shadow-xl border-0">
              <VisualAidsPanel currentTopic="Learning Analytics" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
