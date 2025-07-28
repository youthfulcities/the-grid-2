'use client';

import { useHousingSurvey } from '@/app/[lng]/insights/housing/survey/context/HousingSurveyContext';
import Background from '@/app/components/Background';
import CrosslinkCards from '@/app/components/CrosslinkCards';
import BarChart from '@/app/components/dataviz/BarChartJSON';
import { FlexibleDataItem } from '@/app/components/dataviz/BarChartStacked';
import Tooltip from '@/app/components/dataviz/TooltipChart/TooltipChart';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import useDownloadFile from '@/hooks/useDownloadFile';
import useFilteredPosts from '@/hooks/useFilteredPosts';
import fetchData from '@/utils/fetchData';
import {
  Button,
  Heading,
  SelectField,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  useBreakpointValue,
  View,
} from '@aws-amplify/ui-react';
import _ from 'lodash';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { FaComments, FaFileArrowDown } from 'react-icons/fa6';
import styled from 'styled-components';

interface ResponseGroup {
  [key: string]: string | number;
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
    { start: 28, end: 32 },
  ],
  co: [{ start: 17, end: 28 }],
  preference: [
    { start: 32, end: 41 },
    { start: 51, end: 54 },
  ],
  mental: [{ start: 41, end: 50 }],
  income: [{ start: 58, end: 66 }],
};

const HousingSurvey = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'housing_chart');
  const { t: t_open } = useTranslation(lng, 'housing_open');
  const { t: t_survey } = useTranslation(lng, 'WUWWL_survey');

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
  const { width } = useDimensions(containerRef);
  const [questions, setQuestions] = useState<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const posts = useFilteredPosts(50, lng);
  const ismobile = useBreakpointValue({
    base: true,
    small: true,
    medium: true,
    large: false,
  });

  const activeFile = 'survey_results_processed_weighted.json';
  const path = 'internal/HOM/survey/quant';
  const filename = 'YC Housing Survey Analysis Totals.csv';
  const { downloadFile } = useDownloadFile();

  useEffect(() => {
    const loadData = async () => {
      const text = await fetchData(path, activeFile);
      const jsonData = JSON.parse(text as string);
      setData(jsonData);
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

  const tooltipFormatter = useCallback(
    (d: FlexibleDataItem) => (
      <Trans
        i18nKey='tooltip'
        t={t}
        values={{
          percent: d.value,
          age: d.option,
          answer: d.answer,
          average: d.average,
        }}
      />
    ),
    [t]
  );

  return (
    <Background>
      <View className='container' paddingTop='xxxl'>
        <Heading level={1}>
          <Trans
            i18nKey='title'
            t={t}
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <View className='inner-container'>
          <Heading level={3}>{t('subtitle')}</Heading>
          <Text marginBottom='xl'>{t('desc')}</Text>
        </View>
        <View ref={containerRef}>
          <Text marginBottom='0'>{t_survey('select_title')}</Text>
          <ToggleButtonGroup
            direction={ismobile ? 'column' : 'row'}
            alignItems='stretch'
            value={currentTopic}
            onChange={(value) => setCurrentTopic(value as string)}
            isExclusive
            marginBottom='medium'
          >
            <StyledToggleButton
              defaultPressed
              isDisabled={currentTopic === 'situation'}
              marginLeft={ismobile ? '-3px' : '0'}
              value='situation'
            >
              {t('topic_living')}
            </StyledToggleButton>
            <StyledToggleButton isDisabled={currentTopic === 'co'} value='co'>
              {t('topic_coliving')}
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'preference'}
              value='preference'
            >
              {t('topic_housing')}
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'mental'}
              value='mental'
            >
              {t('topic_mental')}
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'income'}
              value='income'
            >
              {t('topic_education')}
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'general'}
              value='general'
            >
              {t('topic_general')}
            </StyledToggleButton>
          </ToggleButtonGroup>
          {data && (
            <>
              <StyledSelect
                marginBottom='large'
                label={t_survey('select_question')}
                color='font.primary'
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
                label={t_survey('select_demo')}
                color='font.primary'
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
                  <Heading level={3} textAlign='center' color='font.primary'>
                    {currentQuestion?.replace(regex, '').trim()}
                  </Heading>
                  <Heading level={5} textAlign='center' color='font.primary'>
                    {t('chart_sub')} {currentSegment.replace(regex, '').trim()}
                  </Heading>
                </>
              )}
              <BarChart
                data={
                  data && currentQuestion && currentSegment
                    ? (data[currentQuestion][currentSegment] as ResponseGroup)
                    : undefined
                }
                width={width}
                xLabel={t('percent')}
                tooltipFormatter={tooltipFormatter}
              >
                <Text fontSize='xs'>{t('note')}</Text>
              </BarChart>
            </>
          )}
          {currentTopic === 'situation' && (
            <View>
              <Heading
                level={4}
                color='secondary.60'
                marginTop='xxl'
                marginBottom='xs'
              >
                {t('key_title')}
              </Heading>
              <Trans
                i18nKey='key_situation'
                t={t}
                components={{ ul: <ul />, li: <li />, p: <Text /> }}
              />
            </View>
          )}
          {currentTopic === 'preference' && (
            <View>
              <Heading
                level={4}
                color='secondary.60'
                marginTop='xxl'
                marginBottom='xs'
              >
                {t('key_title')}
              </Heading>
              <Trans
                i18nKey='key_preferences'
                t={t}
                components={{ ul: <ul />, li: <li />, p: <Text /> }}
              />
            </View>
          )}
          {currentTopic === 'mental' && (
            <View>
              <Heading
                level={4}
                color='secondary.60'
                marginTop='xxl'
                marginBottom='xs'
              >
                {t('key_title')}
              </Heading>
              <Trans
                i18nKey='key_mental'
                t={t}
                components={{ ul: <ul />, li: <li />, p: <Text /> }}
              />
            </View>
          )}
          <Heading
            level={4}
            color='secondary.60'
            marginBottom='xs'
            marginTop='xl'
          >
            {t_open('stories_heading')}
          </Heading>
          {posts.length > 0 && <CrosslinkCards posts={posts} />}
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            {t('explore_title')}
          </Heading>
          <Text>{t('explore_desc')}</Text>
          <Link href='/insights/housing/open-ended'>
            <Button variation='primary' gap='xs'>
              <FaComments fontSize='large' />
              {t('explore_button')}
            </Button>
          </Link>
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            {t('download_title')}
          </Heading>
          <Text>{t('download_desc')}</Text>
          <Button
            variation='primary'
            onClick={() => downloadFile(filename)}
            gap='xs'
          >
            <FaFileArrowDown fontSize='large' />
            {t('download_button')}
          </Button>
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            {t('methodology_title')}
          </Heading>
          <Heading level={5} color='secondary.60'>
            {t('methodology_sub1')}
          </Heading>
          <Text marginBottom='xl'>{t('methodology_p1')}</Text>
          <Heading level={5} color='secondary.60'>
            {t('methodology_sub2')}
          </Heading>
          <Text marginBottom='xl'>{t('methodology_p2')}</Text>
          <Heading level={5} color='secondary.60'>
            {t('methodology_sub3')}
          </Heading>
          <Trans
            t={t}
            i18nKey='methodology_p3'
            components={{ p: <Text />, ul: <ul />, li: <li /> }}
          />
        </View>
      </View>
      <Tooltip />
    </Background>
  );
};

export default HousingSurvey;
