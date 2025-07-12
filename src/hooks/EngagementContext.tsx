import React, { createContext, useContext, useState } from 'react';

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
  setEngagementData: React.Dispatch<React.SetStateAction<EngagementData>>;
}>({
  engagementData: defaultData,
  setEngagementData: () => {},
});

export const useEngagement = () => useContext(EngagementContext);

export const EngagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engagementData, setEngagementData] = useState(defaultData);
  return (
    <EngagementContext.Provider value={{ engagementData, setEngagementData }}>
      {children}
    </EngagementContext.Provider>
  );
};