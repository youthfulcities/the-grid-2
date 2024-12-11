'use client';

import Background from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChartJSON';
import { useDimensions } from '@/hooks/useDimensions';
import fetchData from '@/lib/fetchData';
import { Heading, Text, View } from '@aws-amplify/ui-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  cluster?: string;
  child?: ReactNode | null;
  minWidth?: number;
}

interface ResponseGroup {
  [key: string]: number;
}

interface QuestionResponses {
  [key: string]: ResponseGroup;
}

interface SurveyData {
  [question: string]: QuestionResponses;
}

const HousingSurvey = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useDimensions(containerRef);
  const [data, setData] = useState<SurveyData>();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [segments, setSegments] = useState<string[]>([]);
  const [currentSegment, setCurrentSegment] = useState('');
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
    value: null,
    content: '',
    group: '',
    topic: '',
    child: null,
    minWidth: 0,
  });
  const activeFile = 'survey_results_processed_weighted.json';
  const path = 'internal/HOM/survey/quant';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setData(jsonData);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const getQuestions = () => {
      if (data) {
        const allQuestions = Object.keys(data);
        setQuestions(allQuestions ?? []);
        setCurrentQuestion(allQuestions[2]);
      }
    };

    getQuestions();
  }, [data]);

  useEffect(() => {
    const getSegments = () => {
      if (currentQuestion && data && data[currentQuestion]) {
        const allSegments = Object.keys(data[currentQuestion]).filter(
          (key) =>
            key !== 'question_id' &&
            key !== 'question_text' &&
            key !== 'question_type'
        );
        setSegments(allSegments ?? []);
        setCurrentSegment(allSegments[5]);
      }
    };

    getSegments();
  }, [data, currentQuestion]);

  return (
    <Background>
      <View className='container' padding='xxxl'>
        <Heading level={1}>Youth Housing Study</Heading>
        <View className='inner-container' ref={containerRef}>
          <Text>{currentQuestion}</Text>
          <Text>{currentSegment}</Text>
          <Text>
            Note: Segments below a sample size of 50 are not displayed.
          </Text>
          <BarChart
            data={
              data && currentQuestion && currentSegment
                ? data[currentQuestion][currentSegment]
                : null
            }
            width={width}
            tooltipState={tooltipState}
            setTooltipState={setTooltipState}
          />
        </View>
      </View>
    </Background>
  );
};

export default HousingSurvey;
