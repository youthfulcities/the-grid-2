'use client';

import Container from '@/app/components/Background';
import CrosslinkCard from '@/app/components/CrosslinkCard';
import Drawer from '@/app/components/Drawer';
import BarChart from '@/app/components/dataviz/BarChartGeneral';
import Clusters from '@/app/components/dataviz/Clusters';
import Demographics from '@/app/components/dataviz/Demographics';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useWUWWLSurvey } from '@/app/context/WUWWLSurveyContext';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import useFilteredPosts from '@/hooks/useFilteredPosts';
import fetchData from '@/lib/fetchData';
import {
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
import { Amplify } from 'aws-amplify';
import * as d3 from 'd3';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import config from '../../../../amplifyconfiguration.json';

Amplify.configure(config, {
  ssr: true,
});

interface DataItem {
  option_en: string;
  question_ID: number;
  count_Total: number;
  percentage_Total: number;
  [key: string]: string | number | undefined;
}

type SurveyData = DataItem[] | null;

type QuestionRange = { start: number; end: number };

const clusterMap: {
  'Social good focus': string;
  'Forming opinions': string;
  'Economic focus': string;
  All: string;
  [key: string]: string; // Index signature
} = {
  'Social good focus': 'social',
  'Forming opinions': 'forming',
  'Economic focus': 'affordability',
  All: 'all',
};

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

// Function to get key from value
const getKeyFromValue = (value: string): string | null => {
  const entry = Object.entries(clusterMap).find(([key, val]) => val === value);
  return entry ? entry[0] : null; // Return the key if found, otherwise null
};

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
    currentSegment,
    setCurrentSegment,
    currentTopic,
    setCurrentTopic,
  } = useWUWWLSurvey();
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'housing');
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useDimensions(containerRef);
  const [currentCluster, setCurrentCluster] = useState('all');
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
  const [segments, setSegments] = useState<string[]>([]);
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
    const loadData = async () => {
      setLoading(true);
      try {
        const csvText = await fetchData(path, activeFile); // Fetch CSV as text
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
          What’s up with <span className='highlight'>work lately?</span>
        </Heading>
        <View className='inner-container'>
          <Heading level={3} marginBottom='xl'>
            Youth Chart
          </Heading>
        </View>
        <div ref={containerRef}>
          {data ? (
            <>
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
                  isDisabled={currentTopic === 'future'}
                  marginLeft={ismobile ? '-3px' : '0'}
                  value='future'
                >
                  Paving the way for the future of work in cities
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'pandemic'}
                  value='pandemic'
                >
                  Engaging with post-pandemic work ecosystems
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'org'}
                  value='org'
                >
                  Envisioning an ideal organization
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'transition'}
                  value='transition'
                >
                  Navigating the transition from education to work
                </StyledToggleButton>
                <StyledToggleButton
                  isDisabled={currentTopic === 'other'}
                  value='other'
                >
                  Other
                </StyledToggleButton>
              </ToggleButtonGroup>
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
            <Placeholder height='1000px' />
          )}
        </div>
        <Heading level={2} marginTop='xxxl'>
          Dig Deeper
        </Heading>
        <Clusters
          getKeyFromValue={getKeyFromValue}
          currentCluster={currentCluster}
          setCurrentCluster={setCurrentCluster}
          clusterMap={clusterMap}
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
          Data Stories
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
        <Heading level={2} marginTop='xxxl'>
          Methodology
        </Heading>
        <Text marginBottom='xl'>
          The bilingual survey investigated how Canada&apos;s youth workforce
          and work ecosystems changed after the COVID-19 pandemic. The primary
          objective of this survey was to collect insights from youth
          nationally, to support the development of evidence-based solutions
          focused on improving community-specific pathways towards skills
          development and meaningful employment. It was designed in
          collaboration with policy experts and local actors to ensure that the
          questions were relevant and aligned with the project&apos;s goals. The
          Equity, Diversity, Inclusivity, Justice and Reconciliation team
          (EDIJR) at Tamarack Institute validated the survey design. It ensured
          the content was inclusive and suitable for youth of different
          identities and lived experiences.
        </Text>
        <Heading level={3} color='secondary.60'>
          Sampling Design
        </Heading>
        <Text marginBottom='xl'>
          The survey targeted a representative sample of young people aged 16 to
          30, reaching 1626 respondents across Canada. The sampling frame was
          designed based on Statistics Canada Census 2021 data. Respondents were
          identified using voluntary sampling through promotion on the Youthful
          Cities and Tamarack Institute media channels. To align with the values
          and scope of the DEVlab project, the sample focused on eight
          cities—Toronto, Vancouver, Montreal, Calgary, Regina, Moncton,
          Yellowknife, and Whitehorse—where solutions based on the findings were
          implemented. Furthermore, the survey design prioritized increasing the
          representation of equity-deserving groups within the sample.
        </Text>
        <Heading level={3} color='secondary.60'>
          Data Collection
        </Heading>
        <Text marginBottom='xl'>
          The survey was in the field between November 2023 and May 2024,
          exclusively through online collection. It was hosted on Typeform, a
          common data collection platform. The data collected through Typeform
          is protected by leading Canadian and international cybersecurity and
          data protection standards. While the survey was in the field, Youthful
          Cities purchased a panel sample, totalling 1090 respondents
          (pre-exclusion and data cleaning), from CICIC research, a Canadian,
          Dynata-affiliated and ESOMAR-recognized market research organization.
          The survey complied with ethical guidelines for research involving
          human participants. All participants were provided with an informed
          consent form detailing the purpose of the study, the voluntary nature
          of participation, and assurances of anonymity and confidentiality.
          Respondents were informed of their right to withdraw from the survey
          at any point without penalty, and the data collection process was
          designed to minimize any potential discomfort or risk to participants.
        </Text>
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentCluster('all');
        }}
        tabText='Demographics'
      >
        <Demographics
          currentCluster={currentCluster}
          currentClusterName={getKeyFromValue(currentCluster)}
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
