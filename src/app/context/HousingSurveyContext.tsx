'use client';

import React, { createContext, useContext, useState } from 'react';

interface ResponseGroup {
  [key: string]: number;
}

interface QuestionResponses {
  question_id: number;
  [key: string]: ResponseGroup | number;
}

interface SurveyData {
  [question: string]: QuestionResponses;
}

interface HousingSurveyContextType {
  data: SurveyData | undefined;
  setData: React.Dispatch<React.SetStateAction<SurveyData | undefined>>;
  currentQuestion: string;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<string>>;
  currentSegment: string;
  setCurrentSegment: React.Dispatch<React.SetStateAction<string>>;
  currentTopic: string;
  setCurrentTopic: React.Dispatch<React.SetStateAction<string>>;
}

const HousingSurveyContext = createContext<
  HousingSurveyContextType | undefined
>(undefined);

export const HousingSurveyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<SurveyData>();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentSegment, setCurrentSegment] = useState('');
  const [currentTopic, setCurrentTopic] = useState('general');

  const value = React.useMemo(
    () => ({
      data,
      setData,
      currentQuestion,
      setCurrentQuestion,
      currentSegment,
      setCurrentSegment,
      currentTopic,
      setCurrentTopic,
    }),
    [data, currentQuestion, currentSegment, currentTopic]
  );

  return (
    <HousingSurveyContext.Provider value={value}>
      {children}
    </HousingSurveyContext.Provider>
  );
};

export const useHousingSurvey = () => {
  const context = useContext(HousingSurveyContext);
  if (!context) {
    throw new Error(
      'useHousingSurvey must be used within a HousingSurveyProvider'
    );
  }
  return context;
};
