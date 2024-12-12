'use client';

import Background from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import fetchData from '@/lib/fetchData';
import { Heading, SelectField, Text, View } from '@aws-amplify/ui-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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

const StyledSelect = styled(SelectField)`
  select: {
    max-width: 100%;
    word-wrap: break-word;
  }
  option: {
    word-wrap: break-word;
  }
`;

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
      if (!data || !data[currentQuestion]) return;
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

  const regex =
    /(\[Please choose all that apply\]_feature|_Feature|\[Please choose all that apply\]|_feature|_ feature|\[Please choose only one\]|Select as many as apply.|On a scale of 1 to 10 — with 1 being not at all_featurre interested, and 10 being extremely interested —|Choose as many as apply.)/;

  return (
    <Background>
      <View className='container' paddingTop='xxxl'>
        <Heading level={1} marginBottom='xl'>
          Youth Housing Study
        </Heading>
        {data && (
          <View ref={containerRef}>
            <View>
              <StyledSelect
                marginBottom='large'
                label='Select a question'
                color='font.inverse'
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
              >
                {questions.map((question) => (
                  <option value={question} key={question}>
                    {question.replace(regex, '').trim()}
                  </option>
                ))}
              </StyledSelect>
              <StyledSelect
                marginBottom='xl'
                label='Select a demographic segment'
                color='font.inverse'
                value={currentSegment}
                onChange={(e) => setCurrentSegment(e.target.value)}
              >
                {segments.map((segment) => (
                  <option value={segment} key={segment}>
                    {segment.replace(regex, '').trim()}
                  </option>
                ))}
              </StyledSelect>
              {currentSegment && (
                <>
                  <Heading level={3} textAlign='center' color='font.inverse'>
                    {currentQuestion.replace(regex, '').trim()}
                  </Heading>
                  <Heading level={5} textAlign='center' color='font.inverse'>
                    Broken down by: {currentSegment.replace(regex, '').trim()}
                  </Heading>
                  <Text fontSize='xs' textAlign='center'>
                    *Note: Segments below a sample size of 50 are not displayed.
                  </Text>
                </>
              )}
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
        )}
      </View>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x}
          content={tooltipState.content}
          y={tooltipState.position.y}
          group={tooltipState.group}
          child={tooltipState.child}
          minWidth={tooltipState.minWidth}
        />
      )}
    </Background>
  );
};

export default HousingSurvey;
