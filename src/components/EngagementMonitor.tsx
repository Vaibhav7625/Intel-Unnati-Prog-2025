import React from 'react';
import { useEngagement } from '../hooks/EngagementContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Users, Brain, Eye } from 'lucide-react';

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

interface EngagementMonitorProps {
  engagementData: EngagementData;
}

export const EngagementMonitor: React.FC = () => {
  const { engagementData } = useEngagement();
  const { level, score, studentsActive, totalStudents, focusMetrics } = engagementData;
  
  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-engagement-high';
      case 'medium': return 'text-engagement-medium';
      case 'low': return 'text-engagement-low';
      default: return 'text-muted-foreground';
    }
  };

  const getEngagementIcon = (level: string) => {
    switch (level) {
      case 'high': return <TrendingUp className="w-5 h-5" />;
      case 'medium': return <Minus className="w-5 h-5" />;
      case 'low': return <TrendingDown className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-engagement-high';
    if (value >= 60) return 'bg-engagement-medium';
    return 'bg-engagement-low';
  };

  return (
    <div className="space-y-4">
      {/* Overall Engagement */}
      <Card className="p-4 shadow-engagement bg-gradient-subtle">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Class Engagement</h3>
          <div className={`flex items-center gap-2 ${getEngagementColor(level)}`}>
            {getEngagementIcon(level)}
            <span className="font-medium capitalize">{level}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Engagement Score</span>
            <span className="font-medium">{score}%</span>
          </div>
          <Progress 
            value={score} 
            className="h-2"
            // Apply dynamic color based on score
          />
        </div>
      </Card>

      {/* Focus Metrics */}
      <Card className="p-4 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Focus Metrics</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Attention</span>
              </div>
              <span className="font-medium">{focusMetrics.attention}%</span>
            </div>
            <Progress 
              value={focusMetrics.attention} 
              className="h-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Participation</span>
              </div>
              <span className="font-medium">{focusMetrics.participation}%</span>
            </div>
            <Progress 
              value={focusMetrics.participation} 
              className="h-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Comprehension</span>
              </div>
              <span className="font-medium">{focusMetrics.comprehension}%</span>
            </div>
            <Progress 
              value={focusMetrics.comprehension} 
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* Personal Learning Suggestions - Student-focused */}
      <Card className="p-4 shadow-soft border-accent/20">
        <h4 className="font-semibold text-foreground mb-3">Personal Learning Tips</h4>
        <div className="space-y-2 text-sm">
          {level === 'low' && (
            <>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Try adjusting your sitting position and focus on the screen</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Take short breaks to improve concentration</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Ask questions if you need clarification</span>
              </div>
            </>
          )}
          {level === 'medium' && (
            <>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">You're doing well! Try to engage more actively</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Take notes to improve comprehension</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Participate in discussions when possible</span>
              </div>
            </>
          )}
          {level === 'high' && (
            <>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Excellent focus! You're learning effectively</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Keep up the great engagement and active participation</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Consider helping classmates who might need support</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};