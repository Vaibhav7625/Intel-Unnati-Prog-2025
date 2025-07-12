import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export interface EngagementData {
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

interface MetricHistory {
  value: number;
  timestamp: number;
  weight: number;
}

interface SessionMetrics {
  overall: {
    attention: number;
    participation: number;
    comprehension: number;
    score: number;
  };
  history: {
    attention: MetricHistory[];
    participation: MetricHistory[];
    comprehension: MetricHistory[];
    score: MetricHistory[];
  };
}

const defaultData: EngagementData = {
  level: 'medium',
  score: 50,
  studentsActive: 1,
  totalStudents: 1,
  focusMetrics: {
    attention: 50,
    participation: 50,
    comprehension: 50,
  },
};

const EngagementContext = createContext<{
  engagementData: EngagementData;
  sessionMetrics: SessionMetrics;
  setEngagementData: React.Dispatch<React.SetStateAction<EngagementData>>;
}>({
  engagementData: defaultData,
  sessionMetrics: {
    overall: {
      attention: 50,
      participation: 50,
      comprehension: 50,
      score: 50,
    },
    history: {
      attention: [],
      participation: [],
      comprehension: [],
      score: [],
    },
  },
  setEngagementData: () => {},
});

export const useEngagement = () => useContext(EngagementContext);

export const EngagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engagementData, setEngagementData] = useState(defaultData);
  const sessionMetricsRef = useRef<SessionMetrics>({
    overall: {
      attention: 50,
      participation: 50,
      comprehension: 50,
      score: 50,
    },
    history: {
      attention: [],
      participation: [],
      comprehension: [],
      score: [],
    },
  });

  const calculateWeightedAverage = useCallback((history: MetricHistory[]): number => {
    if (history.length === 0) return 50;

    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes max consideration
    const recentThreshold = 30 * 1000; // 30 seconds for recent bonus

    // Filter out very old entries
    const relevantHistory = history.filter(entry => now - entry.timestamp < maxAge);
    
    if (relevantHistory.length === 0) return 50;

    // Calculate weights based on recency and frequency
    let totalWeightedValue = 0;
    let totalWeight = 0;
    
    // Group values by ranges to identify frequent values
    const valueRanges = new Map<number, number>();
    relevantHistory.forEach(entry => {
      const range = Math.floor(entry.value / 10) * 10; // Group by 10s
      valueRanges.set(range, (valueRanges.get(range) || 0) + 1);
    });

    relevantHistory.forEach(entry => {
      const age = now - entry.timestamp;
      const range = Math.floor(entry.value / 10) * 10;
      const frequency = valueRanges.get(range) || 1;
      
      // Calculate compound weight
      let weight = 1;
      
      // Recent values get more weight (exponential decay)
      const recencyWeight = Math.exp(-age / (2 * 60 * 1000)); // 2 minute half-life
      weight *= recencyWeight;
      
      // Frequent values get more weight
      const frequencyWeight = Math.min(2, Math.log(frequency + 1) + 1);
      weight *= frequencyWeight;
      
      // Boost for recent high engagement
      if (age < recentThreshold && entry.value > 60) {
        weight *= 1.5;
      }
      
      // Reduce impact of very low values (prevent single 0% from destroying average)
      if (entry.value < 20) {
        weight *= 0.3;
      }
      
      // Boost stable mid-high values
      if (entry.value >= 40 && entry.value <= 80) {
        weight *= 1.2;
      }

      totalWeightedValue += entry.value * weight;
      totalWeight += weight;
    });

    const weightedAverage = totalWeightedValue / totalWeight;
    
    // Apply smoothing to prevent wild swings
    const currentOverall = sessionMetricsRef.current.overall;
    const relevantCurrentValue = history === sessionMetricsRef.current.history.attention ? currentOverall.attention :
                                history === sessionMetricsRef.current.history.participation ? currentOverall.participation :
                                history === sessionMetricsRef.current.history.comprehension ? currentOverall.comprehension :
                                currentOverall.score;
    
    // Smooth transition (90% weighted average, 10% current for stability)
    const smoothedValue = weightedAverage * 0.9 + relevantCurrentValue * 0.1;
    
    return Math.round(Math.max(0, Math.min(100, smoothedValue)));
  }, []);

  const updateSessionMetrics = useCallback((newData: EngagementData) => {
    const now = Date.now();
    const metrics = sessionMetricsRef.current;
    
    // Add new entries to history
    const newEntry = (value: number): MetricHistory => ({
      value,
      timestamp: now,
      weight: 1
    });

    metrics.history.attention.push(newEntry(newData.focusMetrics.attention));
    metrics.history.participation.push(newEntry(newData.focusMetrics.participation));
    metrics.history.comprehension.push(newEntry(newData.focusMetrics.comprehension));
    metrics.history.score.push(newEntry(newData.score));

    // Keep only last 100 entries per metric to prevent memory issues
    const maxEntries = 100;
    Object.keys(metrics.history).forEach(key => {
      const historyArray = metrics.history[key as keyof typeof metrics.history];
      if (historyArray.length > maxEntries) {
        historyArray.splice(0, historyArray.length - maxEntries);
      }
    });

    // Calculate new overall metrics
    metrics.overall.attention = calculateWeightedAverage(metrics.history.attention);
    metrics.overall.participation = calculateWeightedAverage(metrics.history.participation);
    metrics.overall.comprehension = calculateWeightedAverage(metrics.history.comprehension);
    metrics.overall.score = calculateWeightedAverage(metrics.history.score);

    // Log for debugging
    console.log('Session metrics updated:', {
      current: {
        attention: newData.focusMetrics.attention,
        participation: newData.focusMetrics.participation,
        comprehension: newData.focusMetrics.comprehension,
        score: newData.score,
      },
      overall: metrics.overall,
      historyLength: {
        attention: metrics.history.attention.length,
        participation: metrics.history.participation.length,
        comprehension: metrics.history.comprehension.length,
        score: metrics.history.score.length,
      }
    });
  }, [calculateWeightedAverage]);

  // Enhanced setEngagementData that also updates session metrics
  const enhancedSetEngagementData = useCallback((
    updater: React.SetStateAction<EngagementData>
  ) => {
    setEngagementData(prevData => {
      const newData = typeof updater === 'function' ? updater(prevData) : updater;
      updateSessionMetrics(newData);
      return newData;
    });
  }, [updateSessionMetrics]);

  return (
    <EngagementContext.Provider value={{ 
      engagementData, 
      sessionMetrics: sessionMetricsRef.current,
      setEngagementData: enhancedSetEngagementData 
    }}>
      {children}
    </EngagementContext.Provider>
  );
};