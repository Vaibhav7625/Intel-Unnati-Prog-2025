import React from 'react';
import { EngagementMonitor } from '@/components/EngagementMonitor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Eye, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEngagement } from '../hooks/EngagementContext';

const Analytics = () => {
  const { engagementData, sessionMetrics } = useEngagement();

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
                <p className="text-blue-100">Engagement Monitoring & Performance Tracking</p>
              </div>
            </div>
            
            <div className="text-white text-right">
              <p className="text-sm opacity-90">Current Level</p>
              <p className="text-2xl font-bold capitalize">{engagementData.level}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Engagement Statistics - Now uses session overall metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Session Attention</p>
                  <p className="text-2xl font-bold">{sessionMetrics.overall.attention}%</p>
                  <p className="text-xs text-blue-200 mt-1">Overall Average</p>
                </div>
                <Eye className="w-8 h-8 text-blue-100" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Session Participation</p>
                  <p className="text-2xl font-bold">{sessionMetrics.overall.participation}%</p>
                  <p className="text-xs text-purple-200 mt-1">Overall Average</p>
                </div>
                <Activity className="w-8 h-8 text-purple-100" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Session Comprehension</p>
                  <p className="text-2xl font-bold">{sessionMetrics.overall.comprehension}%</p>
                  <p className="text-xs text-orange-200 mt-1">Overall Average</p>
                </div>
                <Brain className="w-8 h-8 text-orange-100" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">Session Score</p>
                  <p className="text-2xl font-bold">{sessionMetrics.overall.score}%</p>
                  <p className="text-xs text-indigo-200 mt-1">Overall Average</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-100" />
              </div>
            </Card>
          </div>

          {/* Main Engagement Monitor - Shows current real-time data */}
          <div className="w-full">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Real-time Engagement Monitor</h2>
                <p className="text-sm text-gray-600">Live data from face detection</p>
              </div>
              <EngagementMonitor />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;