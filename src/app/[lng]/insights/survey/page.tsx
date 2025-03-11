'use client';

import Clusters from '@/app/[lng]/insights/survey/components/Clusters';
import Demographics from '@/app/[lng]/insights/survey/components/Demographics';
import { useWUWWLSurvey } from '@/app/[lng]/insights/survey/context/WUWWLSurveyContext';
import Container from '@/app/components/Background';
import CrosslinkCard from '@/app/components/CrosslinkCard';
import Drawer from '@/app/components/Drawer';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
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
  Placeholder,
  SelectField,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  useBreakpointValue,
  View,
} from '@aws-amplify/ui-react';
import * as d3 from 'd3';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
// import config from '../../../../amplifyconfiguration.json';

// Amplify.configure(config, {
//   ssr: true,
// });

interface DataItem {
  option_en: string;
  question_ID: number;
  count_Total: number;
  percentage_Total: number;
  [key: string]: string | number | undefined;
}

type SurveyData = DataItem[] | null;

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
  future: [
    { start: 49, end: 50 },
    { start: 93, end: 94 },
  ],
  pandemic: [
    { start: 60, end: 62 },
    { start: 65, end: 67 },
  ],
  org: [
    { start: 68, end: 68 },
    { start: 71, end: 74 },
    { start: 95, end: 95 },
  ],
  transition: [
    { start: 56, end: 59 },
    { start: 90, end: 90 },
  ],
  other: [
    { start: 1, end: 48 },
    { start: 51, end: 55 },
    { start: 63, end: 64 },
    { start: 69, end: 70 },
    { start: 75, end: 89 },
    { start: 91, end: 92 },
    { start: 96, end: 97 },
  ],
};

const regex =
  /(\[Please choose all that apply\]_feature|_Feature|\[Please choose all that apply\]|_feature|_ feature|\[Please choose only one\]|Select as many as apply.|On a scale of 1 to 10 — with 1 being not at all_featurre interested, and 10 being extremely interested —|Choose as many as apply.)/;

const Survey: React.FC = () => {
  const {
    data,
    setData,
    currentQuestion,
    setCurrentQuestion,
    currentTopic,
    setCurrentTopic,
  } = useWUWWLSurvey();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'WUWWL_survey');
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useDimensions(containerRef);
  const [currentCluster, setCurrentCluster] = useState(t('cluster_all'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [tooltipState, setTooltipState] = useState<{
    position: { x: number; y: number } | null;
    value?: number | null;
    topic?: string;
    content?: string;
    group?: string;
    cluster?: string;
    child?: ReactNode | null;
    minWidth?: number;
  }>({
    position: null,
    value: null,
    content: '',
    group: '',
    topic: '',
    child: null,
    minWidth: 0,
  });
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<SurveyData>(null);
  const posts = useFilteredPosts(47, lng);

  const ismobile = useBreakpointValue({
    base: true,
    small: true,
    medium: true,
    large: false,
  });

  const activeFile = 'WUWWL_Full_National_ONLY - Questions.csv';
  const path = 'internal/DEV/survey';

  useEffect(() => {
    setCurrentCluster(t('cluster_all'));
  }, [lng]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const csvText = await fetchData(path, activeFile); //
        // Fetch CSV as text
        if (csvText) {
          const parsedData = d3.csvParse(csvText); // Parse CSV string to JSON
          // Convert count_Total and percentage_Total to numbers
          const jsonData = parsedData.map((d) => ({
            ...d,
            question_ID: +d.question_ID, // Convert ID to number
            count_Total: +d.count_Total, // Convert count to number
            percentage_Total:
              +d.percentage_Total.replace('%', '') < 1
                ? Math.round(+d.percentage_Total.replace('%', '') * 100)
                : +d.percentage_Total.replace('%', ''), // Remove "%" and convert to number
            option_en: d.option_en || '', // Ensure option_en is always a string
          }));

          setData(jsonData);
        }
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [path, activeFile]);

  // ** Filter Questions by Topic **
  useEffect(() => {
    if (!data) return;

    const filteredData = data.filter((d) =>
      questionRanges[currentTopic]?.some(
        (range) => d.question_ID >= range.start && d.question_ID <= range.end
      )
    );

    const uniqueQuestions = _.uniq(filteredData.map((d) => d.question_en));
    setQuestions(uniqueQuestions as string[]);
    setCurrentQuestion((uniqueQuestions[0] as string) || '');
  }, [data, currentTopic]);

  // ** Filter Data by Selected Question **
  useEffect(() => {
    if (!data || !currentQuestion) return;
    const filteredData = data.filter((d) => d.question_en === currentQuestion);
    setCurrentData(filteredData);
  }, [data, currentQuestion]);

  useEffect(() => {
    const filterDataByQuestion = () => {
      if (data && currentQuestion) {
        const filteredData = data.filter(
          (d) => d.question_en === currentQuestion
        );
        setCurrentData(filteredData);
      }
    };

    filterDataByQuestion();
  }, [data, currentQuestion]);

  // useEffect(() => {
  //   const getSegments = () => {
  //     if (!data || !data[currentQuestion]) return;
  //     if (currentQuestion && data && data[currentQuestion]) {
  //       const allSegments = Object.keys(data[currentQuestion]).filter(
  //         (key) =>
  //           key !== 'question_id' &&
  //           key !== 'question_text' &&
  //           key !== 'question_type'
  //       );
  //       setSegments(allSegments ?? []);
  //       if (!currentSegment) {
  //         setCurrentSegment(allSegments[1]);
  //       }
  //     }
  //   };

  //   getSegments();
  // }, [data, currentQuestion]);

  return (
    <Container>
      <View className='container padding'>
        <Heading level={1}>
          <Trans
            t={t}
            i18nKey='title'
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <View className='inner-container'>
          <Heading level={3} marginBottom='xl'>
            {t('subtitle')}
          </Heading>
        </View>
        <Text marginBottom='xl'>{t('desc')}</Text>
        <div ref={containerRef} data-testid='survey-container'>
          {data ? (
            <>
              <Text marginBottom='0'>{t('select_title')}</Text>
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
                  isDisabled={currentTopic === 'future'}
                  marginLeft={ismobile ? '-3px' : '0'}
                  value='future'
                >
                  {t('select_future')}
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'pandemic'}
                  value='pandemic'
                >
                  {t('select_pandemic')}
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'org'}
                  value='org'
                >
                  {t('select_org')}
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'transition'}
                  value='transition'
                >
                  {t('select_trans')}
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'other'}
                  value='other'
                >
                  {t('select_other')}
                </StyledToggleButton>
              </ToggleButtonGroup>
              <StyledSelect
                marginBottom='large'
                label={t('select_question')}
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
              {/* <StyledSelect
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
              </StyledSelect> */}
              {currentData && (
                <>
                  <Heading
                    level={3}
                    textAlign='center'
                    color='font.inverse'
                    marginTop='xxl'
                    marginBottom='xl'
                  >
                    {currentQuestion?.replace(regex, '').trim()}
                  </Heading>
                  {/* <Heading level={5} textAlign='center' color='font.inverse'>
                    Broken down by: {currentSegment.replace(regex, '').trim()}
                  </Heading> */}
                </>
              )}
              <BarChart
                data={currentData || []}
                width={width}
                tooltipState={tooltipState}
                setTooltipState={setTooltipState}
              >
                {/* <Text fontSize='xs'>
                  *Note: Segments below a sample size of 50 are not displayed.
                  The dotted lined represents the national average, which
                  includes segments not displayed on the chart. Hover or click
                  on bars to reveal values.
                </Text> */}
              </BarChart>
            </>
          ) : (
            <Placeholder
              height='1000px'
              data-testid='survey-page-placeholder'
            />
          )}
        </div>
        <Heading level={2} marginTop='xxxl'>
          {t('deeper_title')}
        </Heading>
        <Clusters
          currentCluster={currentCluster}
          setCurrentCluster={setCurrentCluster}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
        <Heading
          level={4}
          color='secondary.60'
          marginBottom='xs'
          marginTop='xl'
        >
          {t('stories_title')}
        </Heading>
        {posts?.length > 0 && (
          <Grid
            columnGap='small'
            rowGap='small'
            templateColumns={{
              base: '1fr',
              medium: '1fr 1fr',
              xl: '1fr 1fr 1fr fr',
            }}
          >
            {posts.map((post) => (
              <CrosslinkCard
                key={post?.id}
                heading={post?.title?.rendered}
                link={post?.link}
                src={post?.yoast_head_json?.og_image[0].url}
                alt={post?.yoast_head_json?.og_description}
              />
            ))}
          </Grid>
        )}
        <Heading
          level={4}
          color='secondary.60'
          marginTop='xxl'
          marginBottom='xs'
        >
          {t('download')}
        </Heading>
        <Text>{t('download_desc')}</Text>
        <Button variation='primary' onClick={useDownloadFile(activeFile)}>
          {t('download_button')}
        </Button>
        <Heading level={2} marginTop='xxxl'>
          {t('method_title')}
        </Heading>
        <Text marginBottom='xl'>{t('method_p1')}</Text>
        <Heading level={3} color='secondary.60'>
          {t('method_sample')}
        </Heading>
        <Text marginBottom='xl'>{t('method_sample_p1')}</Text>
        <Heading level={3} color='secondary.60'>
          {t('method_collection')}
        </Heading>
        <Text marginBottom='xl'>{t('method_collection_p1')}</Text>
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentCluster(t('cluster_all'));
        }}
        tabText={t('demo_tab')}
      >
        <Demographics
          currentCluster={currentCluster}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
      </Drawer>
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
    </Container>
  );
};

export default Survey;
