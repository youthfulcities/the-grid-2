'use client';

import React, { createContext, useContext, useState } from 'react';

interface DataItem {
  option_en: string;
  question_ID: number;
  count_Total: number;
  percentage_Total: number;
  [key: string]: string | number | undefined;
}

type SurveyData = DataItem[] | null;

interface WUWWLSurveyContextType {
  data: SurveyData | undefined;
  setData: React.Dispatch<React.SetStateAction<SurveyData | undefined>>;
  currentQuestion: string;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<string>>;
  currentSegment: string;
  setCurrentSegment: React.Dispatch<React.SetStateAction<string>>;
  currentTopic: string;
  setCurrentTopic: React.Dispatch<React.SetStateAction<string>>;
}

const WUWWLSurveyContext = createContext<WUWWLSurveyContextType | undefined>(
  undefined
);

export const WUWWLSurveyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<SurveyData>();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentSegment, setCurrentSegment] = useState('');
  const [currentTopic, setCurrentTopic] = useState('future');

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
    <WUWWLSurveyContext.Provider value={value}>
      {children}
    </WUWWLSurveyContext.Provider>
  );
};

export const useWUWWLSurvey = () => {
  const context = useContext(WUWWLSurveyContext);
  if (!context) {
    throw new Error(
      'useWUWWLSurvey must be used within a HousingSurveyProvider'
    );
  }
  return context;
};
