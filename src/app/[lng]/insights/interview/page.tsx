'use client';

import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import BubbleChart from '@/app/components/dataviz/BubbleChart';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import Drawer from '@/app/components/Drawer';
import Quote from '@/app/components/Quote';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Flex, Heading, Tabs, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import Link from 'next/link';
import { ReactNode, useRef, useState } from 'react';

Amplify.configure(config);

const colors = ['red', 'green', 'yellow', 'pink', 'blue'];

const parseCSVData = (csvString: string) => {
  const parsed = d3.csvParse(csvString);
  return parsed;
};

const fetchData = async (city: string, code: string) => {
  try {
    const downloadResult = await downloadData({
      path: `internal/interview-outputs/city_code=${city}/code_1=${code}/data.csv`,
    }).result;
    const text = await downloadResult.body.text();
    return text;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const Interview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('TO');
  const [code, setCode] = useState('');
  const [data, setData] = useState<d3.DSVRowString<string>[]>([]);

  const [tab, setTab] = useState('TO');
  const changeTab = (newTab: string) => {
    setCity(newTab);
    setTab(newTab);
  };

  const onBubbleClick = async (code_parent: string, code_child: string) => {
    if (!code_parent) return;
    setLoading(true);
    const fetchedData = await fetchData(
      city,
      code_parent === 'Root' ? code_child : code_parent
    );
    const parsedData = parseCSVData(fetchedData as string);
    console.log(code_parent, code_child);
    if (code_parent === 'Root') {
      const filteredData = parsedData.filter((quote) => quote.code_2 === '');
      const finalData = filteredData.length > 0 ? filteredData : parsedData;

      //limit to 10 quotes
      setData(finalData.length > 10 ? finalData.slice(0, 9) : finalData);
      setCode(code_child || code_parent);
      setLoading(false);
    } else {
      const filteredData = parsedData.filter((quote) =>
        quote.code_2.includes(code_child)
      );

      const finalData = filteredData.length > 0 ? filteredData : parsedData;

      //limit to 10 quotes
      setData(finalData.length > 10 ? finalData.slice(0, 9) : finalData);
      setCode(code_child || code_parent);
      setLoading(false);
    }
  };

  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1}>Interview</Heading>
        <div className='inner-container'>
          <Heading level={3} color='font.inverse' marginBottom='xl' />
          <Text>
            Explore over 300 interviews with youth and industry leaders on the
            challenges, skills, and workplace expectations shaping young
            people’s experiences in Canada. This interactive visualization
            reveals key themes from more than 10,000 minutes of conversations:
            from preparing for the job market to adapting workplaces for youth.
            Larger circles highlight themes with more discussion, while
            branching nodes show subtopics and related insights.
          </Text>
          <Text>
            Use this tool to dive into what matters most to youth, uncover
            trends, and get the full story behind our data. Explore firsthand
            perspectives to understand how youth envision change across
            education, employment, and social accountability in cities.
          </Text>
        </div>
        <Tabs.Container
          defaultValue='1'
          value={tab}
          onValueChange={(newTab) => changeTab(newTab)}
        >
          <Tabs.List style={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Tabs.Item value='TO'>Toronto</Tabs.Item>
            <Tabs.Item value='CAL'>Calgary</Tabs.Item>
            <Tabs.Item value='MTL'>Montréal</Tabs.Item>
            <Tabs.Item value='VAN'>Vancouver</Tabs.Item>
            <Tabs.Item value='MON'>Moncton</Tabs.Item>
            <Tabs.Item value='REG'>Regina</Tabs.Item>
            <Tabs.Item value='WTH'>Whitehorse</Tabs.Item>
            <Tabs.Item value='YKN'>Yellowknife</Tabs.Item>
          </Tabs.List>
          <Tabs.Panel value='TO'>
            <Text>
              Toronto youth are highly educated, diverse, seeking good work
              environments and opportunities for growth. They value resource
              accessibility, affordability, connectedness.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='CAL'>
            <Text>
              Calgary youth are adaptive and highly educated, leading in trades,
              rising in entrepreneurship, and gaining increased opportunities to
              connect across diverse networks.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='MTL'>
            <Text>
              Montréal youth are versatile, value connectedness, environmental
              sustainability, and work-life balance. They value flexibility, and
              young people are able to leverage experiential learning and
              bilingualism to connect with more good youth jobs.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='VAN'>
            <Text>
              Vancouver youth are sustainability conscious and focused,
              interested in positive work environments that align with their
              values. They are keen on mentorship, entrepreneurial pathways, and
              holistic benefits.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='MON'>
            <Text />
          </Tabs.Panel>
          <Tabs.Panel value='REG'>
            <Text />
          </Tabs.Panel>
          <Tabs.Panel value='WTH'>
            <Text />
          </Tabs.Panel>
          <Tabs.Panel value='YKN'>
            <Text />
          </Tabs.Panel>
        </Tabs.Container>
        <BubbleChart
          city={city}
          width={width}
          tooltipState={tooltipState}
          setIsDrawerOpen={setIsDrawerOpen}
          setTooltipState={setTooltipState}
          onBubbleClick={onBubbleClick}
        />
        <Text>
          What to query quotes across all cities? Use the YDL Chatbot.
        </Text>
        <Link href='/chatbot' target='_blank'>
          <Button variation='primary' marginTop='small' marginBottom='xl'>
            Go to YDL Chatbot
          </Button>
        </Link>
        <Heading level={3} color='font.inverse'>
          Data Details
        </Heading>
        <Text>
          Tool data comes from interviews with over 300 youth and industry
          professionals which took place as part of the{' '}
          <a href='https://www.youthfulcities.com/devlab/' target='_blank'>
            DEVlab
          </a>{' '}
          research project. Some questions Youthful Cities representatives asked
          included:
        </Text>
        <ul>
          <li>
            How can educational institutions better prepare students for the
            skills needed in the current job market?
          </li>
          <li>
            What challenges have you personally faced in your skills development
            journey, whether through education or on the job?
          </li>
          <li>
            How would you explain the mismatch between employers’ expectations
            and those of young people in relation to skills? and in relation to
            work behaviors?
          </li>
          <li>
            What are some actionable steps to make youth more comfortable in the
            workplace and manage employers’ expectations?
          </li>
          <li>
            In your opinion, what are the main
            attributes/qualities/characteristics that young people look for in
            organizations when seeking employment? What would push an
            organization to acquire such attributes?
          </li>
          <li>
            From your perspective, to what extent should organizations be
            socially accountable?
          </li>
          <li>
            How can cities be more responsive to the needs of young people and
            specifically those transitioning into the workforce?
          </li>
          <li>
            What are your expectations for the future of work and education in
            Canada, particularly for young people?
          </li>
        </ul>
        <Text>
          We then found and categorized common themes across over 10,000 minutes
          of interview transcripts.
        </Text>
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        tabText='Quotes'
      >
        {data.length > 0 ? (
          <Flex direction='column' paddingTop='xxl' paddingBottom='xxl'>
            <Heading level={3} color='font.inverse' marginBottom={0}>
              Quotes tagged with theme {code}
            </Heading>
            {data &&
              data.map((item, index) => (
                <Quote
                  $color={
                    colors[index % colors.length] as
                      | 'red'
                      | 'green'
                      | 'yellow'
                      | 'pink'
                      | 'blue'
                      | 'neutral'
                      | undefined
                  }
                  key={item.UID}
                  quote={item.segment}
                  left={index % 2 === 0}
                />
              ))}
            <Text marginTop='xl'>
              What to query quotes across all cities? Use the YDL Chatbot.
            </Text>
            <Link href='/chatbot' target='_blank'>
              <Button variation='primary' marginBottom='xl'>
                Go to YDL Chatbot
              </Button>
            </Link>
          </Flex>
        ) : (
          <>
            <Text>Please click on a theme node to view quotes.</Text>{' '}
            <Text marginTop='xl'>
              What to query quotes across all cities? Use the YDL Chatbot.
            </Text>
            <Link href='/chatbot' target='_blank'>
              <Button variation='primary' marginBottom='xl'>
                Go to YDL Chatbot
              </Button>
            </Link>
          </>
        )}
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

export default Interview;
