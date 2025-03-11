'use client';

import { useHousingSurvey } from '@/app/[lng]/insights/housing/survey/context/HousingSurveyContext';
import Background from '@/app/components/Background';
import CrosslinkCard from '@/app/components/CrosslinkCard';
import BarChart from '@/app/components/dataviz/BarChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import useDownloadFile from '@/hooks/useDownloadFile';
import useFilteredPosts from '@/hooks/useFilteredPosts';
import fetchData from '@/lib/fetchData';
import {
  Button,
  Grid,
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
          <Heading level={3}>Youth Chart</Heading>
          <Text marginBottom='xl'>
            Explore 1500 youth perspectives on housing affordability, equity,
            and shared housing alternatives in Canada, gathered from our State
            of Housing for Young People in Canada survey. This interactive
            visualization offers insights into how young people view their
            housing options and the challenges they face.
          </Text>
        </View>
        <View ref={containerRef}>
          <Text marginBottom='0'>Select a topic</Text>
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
              Living Situation
            </StyledToggleButton>
            <StyledToggleButton isDisabled={currentTopic === 'co'} value='co'>
              Co-living
            </StyledToggleButton>
            <StyledToggleButton
              isDisabled={currentTopic === 'preference'}
              value='preference'
            >
              Housing Search & Preferences
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
            <StyledToggleButton
              isDisabled={currentTopic === 'general'}
              value='general'
            >
              General & Demographics
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
              >
                <Text fontSize='xs'>
                  *Note: Segments below a sample size of 50 are not displayed.
                  The dotted lined represents the national average, which
                  includes segments not displayed on the chart. Hover or click
                  on bars to reveal values.
                </Text>
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
                Key Takeaways
              </Heading>
              <ul>
                <li>
                  <Text>58% of young people rent.</Text>
                  <ul>
                    <li>
                      <Text>
                        Renting is higher than average for black (69%) and
                        Indigenous youth (61%).
                      </Text>
                    </li>
                    <li>
                      <Text>
                        18% live rent and mortgage free (do not contribute, own,
                        or rent).
                      </Text>
                    </li>
                    <li>
                      <Text>27% of men own vs only 17% of women.</Text>
                    </li>
                    <li>
                      <Text>
                        Ownership is lowest in prairie provinces (16%) & highest
                        in Maritimes (28%). Prairies also have highest
                        percentage of youth living rent/mortgage free (24%).
                      </Text>
                    </li>
                  </ul>
                </li>

                <li>
                  <Text>
                    Geographically, nearly half of youth (43%) live outside city
                    centres, drawn to slightly more affordable housing but
                    facing challenges like car dependency and limited
                    infrastructure, while 34% live in suburbs and 19% live
                    downtown.
                  </Text>
                </li>
                <li>
                  <Text>
                    44% of youth decide to live with others to reduce housing
                    costs. Between 18-25 years old it increases to 52.5%.
                  </Text>
                  <ul>
                    <li>
                      <Text>
                        26% of all youth live with their parents, but this rises
                        to 34% among youth of color.
                      </Text>
                    </li>
                  </ul>
                </li>
                <li>
                  <Text>
                    The majority of youth live in two-bedroom (24%) or
                    three-bedroom (21%) units, with smaller spaces like
                    one-bedroom (14%) and studios (5%) being less common and
                    often costly.
                  </Text>
                </li>
                <li>
                  <Text>
                    While 50% move out between 18-21, among them 53% have also
                    returned home.
                  </Text>
                  <ul>
                    <li>
                      <Text>
                        Overall, 93% of young people have moved out of their
                        childhood living situation before the age of 26.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        A significantly higher percentage (38%) of Indigenous
                        youth moved out of their childhood living situation
                        before turning 18.
                      </Text>
                    </li>
                  </ul>
                </li>
              </ul>
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
                Key Takeaways
              </Heading>
              <ul>
                <li>
                  <Text>
                    50% of youth stated that finding a place within their price
                    range was the most challenging part of their rental
                    experience, followed by 39% who stated finding a place in
                    the area they wanted to be in was the most challenging.
                  </Text>
                  <ul>
                    <li>
                      <Text>
                        Among regions, youth in the Maritimes (62%) and in
                        Quebec (62%) found it most challenging to find a rental
                        within their price range. That is compared to 46% in
                        Ontario, 48% in BC and 39% in the Prairies.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        61% of Black youth found finding a rental within price
                        range most challenging, higher than the average.
                      </Text>
                    </li>
                  </ul>
                </li>
                <li>
                  <Text>
                    When searching for a place to live, young people’s
                    priorities reflect practical needs. Over half (51%) cite
                    monthly costs as their top concern, followed by safety
                    (14%), proximity to work (11%), and access to nearby
                    services (10%).
                  </Text>
                </li>
                <li>
                  <Text>
                    Public transit emerges as a critical component of youth
                    housing needs, with 62% of respondents regularly using
                    transit, highlighting the connection between housing and
                    mobility.
                  </Text>
                  <ul>
                    <li>
                      <Text>55% walk regularly.</Text>
                    </li>
                    <li>
                      <Text>42% use a personal vehicle.</Text>
                    </li>
                  </ul>
                </li>
                <li>
                  <Text>
                    29% of youth find the idea of building their own home
                    exciting, showing resilience and creativity in imagining
                    their housing futures.
                  </Text>
                </li>
              </ul>
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
                Key Takeaways
              </Heading>
              <ul>
                <li>
                  <Text>
                    Three quarters of young people reported feeling “on edge”
                    while searching for housing, and 50% expressed anxiety over
                    the stability or cost of their current housing situation.
                  </Text>
                  <ul>
                    <li>
                      <Text>
                        Alberta youth experience this anxiety at a higher rate
                        (55%) than the national average.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        While youth report other, compounding pressures like
                        concerns about global events (41%), national issues in
                        Canada (38%), and local occurrences in their cities
                        (26%), the rates of incidence are much lower nationally
                        than the rate of worry about housing.
                      </Text>
                    </li>
                  </ul>
                </li>
                <li>
                  <Text>
                    68% percent of youth selected that the most challenging part
                    of finding housing is finding something they can afford.
                  </Text>
                </li>
                <ul>
                  <li>
                    <Text>
                      More women (73%) than men (61%) found it challenging to
                      find a place they can afford.
                    </Text>
                  </li>
                </ul>
              </ul>
            </View>
          )}
          <Heading
            level={4}
            color='secondary.60'
            marginBottom='xs'
            marginTop='xl'
          >
            {t('stories_heading')}
          </Heading>
          <Grid
            columnGap='small'
            rowGap='small'
            templateColumns={{
              base: '1fr',
              medium: '1fr 1fr',
              xl: '1fr 1fr 1fr fr',
            }}
          >
            {posts?.length > 0 &&
              posts.map((post) => (
                <CrosslinkCard
                  key={post?.id}
                  heading={post?.title?.rendered}
                  link={post?.link}
                  src={post?.yoast_head_json?.og_image[0].url}
                  alt={post?.yoast_head_json?.og_description}
                />
              ))}
          </Grid>
          <Heading
            level={4}
            color='secondary.60'
            marginTop='xxl'
            marginBottom='xs'
          >
            Explore Open-ended Responses
          </Heading>
          <Text>
            Want to know what youth are saying about housing? Use the Youth Cite
            tool to explore quotes from the State of Housing for Young People in
            Canada survey.
          </Text>
          <Link href='/insights/housing/open-ended'>
            <Button variation='primary'>Go to Youth Cite</Button>
          </Link>
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
