'use client';

import Background from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useHousingSurvey } from '@/app/context/HousingSurveyContext';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import useDownloadFile from '@/hooks/useDownloadFile';
import fetchData from '@/lib/fetchData';
import {
  Button,
  Heading,
  SelectField,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  View,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
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
  question_id: number;
  [key: string]: ResponseGroup | number;
}

interface SurveyData {
  [question: string]: QuestionResponses;
}

type QuestionRange = { start: number; end: number };

const StyledSelect = styled(SelectField)`
  select: {
    max-width: 100%;
    word-wrap: break-word;
  }
  option: {
    word-wrap: break-word;
  }
`;

const StyledToggleButton = styled(ToggleButton)`
  &:disabled {
    background-color: var(--amplify-colors-secondary-60);
    color: #000;
    border-color: var(--amplify-colors-secondary-60);
  }
`;

const questionRanges: Record<string, QuestionRange[]> = {
  general: [
    { start: 1, end: 4 },
    { start: 54, end: 58 },
    { start: 66, end: 70 },
  ],
  situation: [
    { start: 4, end: 17 },
    { start: 28, end: 37 },
  ],
  co: [{ start: 17, end: 28 }],
  preference: [
    { start: 37, end: 41 },
    { start: 50, end: 54 },
  ],
  mental: [{ start: 41, end: 50 }],
  income: [{ start: 58, end: 66 }],
};

const HousingSurvey = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'housing');

  const {
    data,
    setData,
    currentQuestion,
    setCurrentQuestion,
    currentSegment,
    setCurrentSegment,
    currentTopic,
    setCurrentTopic,
  } = useHousingSurvey();

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useDimensions(containerRef);
  const [questions, setQuestions] = useState<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
    value: null,
    content: '',
    group: '',
    topic: '',
    child: null,
    minWidth: 0,
  });

  const isMobile = useBreakpointValue({
    base: true,
    small: true,
    medium: true,
    large: false,
  });

  const activeFile = 'survey_results_processed_weighted.json';
  const path = 'internal/HOM/survey/quant';
  const filename = 'YC Housing Survey Analysis Totals.csv';

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

  const filterQuestionsByTopic = (
    topic: keyof typeof questionRanges,
    currentData: SurveyData
  ) => {
    const ranges = questionRanges[topic];

    if (!currentData) {
      return;
    }
    if (!ranges) {
      // Handle the case where the topic is not defined
      return [];
    }

    const pickedData = _.pickBy(currentData, (question) =>
      ranges.some(
        (range) =>
          question.question_id >= range.start &&
          question.question_id < range.end
      )
    );
    return pickedData;
  };

  useEffect(() => {
    const getQuestions = () => {
      if (data) {
        const filteredData = filterQuestionsByTopic(currentTopic, data);
        const allQuestions = Object.keys(filteredData || data);
        setQuestions(allQuestions ?? []);
        setCurrentQuestion(allQuestions[0]);
      }
    };

    getQuestions();
  }, [data, currentTopic]);

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
        if (!currentSegment) {
          setCurrentSegment(allSegments[1]);
        }
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
          <Trans
            i18nKey='title'
            t={t}
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <View ref={containerRef}>
          <Text marginBottom='0'>Select a topic</Text>
          <ToggleButtonGroup
            direction={isMobile ? 'column' : 'row'}
            alignItems='stretch'
            value={currentTopic}
            onChange={(value) => setCurrentTopic(value as string)}
            isExclusive
            marginBottom='medium'
          >
            <StyledToggleButton
              marginLeft={isMobile ? '-3px' : '0'}
              defaultPressed
              isDisabled={currentTopic === 'general'}
              value='general'
            >
              General & Demographics
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'situation'}
              value='situation'
            >
              Living Situation
            </StyledToggleButton>
            <StyledToggleButton isDisabled={currentTopic === 'co'} value='co'>
              Co-living
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'preference'}
              value='preference'
            >
              Housing Preferences
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'mental'}
              value='mental'
            >
              Mental Wellbeing
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'income'}
              value='income'
            >
              Education & Income
            </StyledToggleButton>
          </ToggleButtonGroup>
          {data && (
            <>
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
                    {currentQuestion?.replace(regex, '').trim()}
                  </Heading>
                  <Heading level={5} textAlign='center' color='font.inverse'>
                    Broken down by: {currentSegment.replace(regex, '').trim()}
                  </Heading>
                  <Text fontSize='xs' textAlign='center'>
                    *Note: Segments below a sample size of 50 are not displayed.
                    The dotted lined represents the national average, which
                    includes segments not displayed on the chart.
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
            </>
          )}
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            {t('method_title')}
          </Heading>
          <Heading level={5} color='secondary.60'>
            {t('method_sub_1')}
          </Heading>
          <Text marginBottom='xl'>{t('method_p_1')}</Text>
          <Heading level={5} color='secondary.60'>
            {t('method_sub_2')}
          </Heading>
          <Text marginBottom='xl'>{t('method_p_2')}</Text>
          <Heading level={5} color='secondary.60'>
            {t('method_sub_3')}
          </Heading>
          <Trans
            t={t}
            i18nKey='method_p_3'
            components={{ p: <Text />, ul: <ul />, li: <li /> }}
          />
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            Download Raw Data
          </Heading>
          <Text>Create an account or sign in to download the dataset.</Text>
          <Button variation='primary' onClick={useDownloadFile(filename)}>
            Download
          </Button>
        </View>
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
