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
      path: `internal/interview-outputs/doc_city=${city}/code_1=${code}/data.csv`,
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
  const [city, setCity] = useState('Toronto');
  const [code, setCode] = useState('');
  const [data, setData] = useState<d3.DSVRowString<string>[]>([]);

  const [tab, setTab] = useState('Toronto');
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
      setData(filteredData.length > 0 ? filteredData : parsedData);
      setCode(code_child || code_parent);
      setLoading(false);
    } else {
      const filteredData = parsedData.filter((quote) =>
        quote.code_2.includes(code_child)
      );
      setData(filteredData.length > 0 ? filteredData : parsedData);
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
        </div>
        <Tabs.Container
          defaultValue='1'
          value={tab}
          onValueChange={(newTab) => changeTab(newTab)}
        >
          <Tabs.List>
            <Tabs.Item value='Toronto'>Toronto</Tabs.Item>
            <Tabs.Item value='Calgary'>Calgary</Tabs.Item>
            <Tabs.Item value='Montreal'>Montréal</Tabs.Item>
            <Tabs.Item value='Vancouver'>Vancouver</Tabs.Item>
          </Tabs.List>
          <Tabs.Panel value='Toronto'>
            <Text>
              Toronto youth are highly educated, diverse, seeking good work
              environments and opportunities for growth. They value resource
              accessibility, affordability, connectedness.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='Calgary'>
            <Text>
              Calgary youth are adaptive and highly educated, leading in trades,
              rising in entrepreneurship, and gaining increased opportunities to
              connect across diverse networks.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='Montreal'>
            <Text>
              Montréal youth are versatile, value connectedness, environmental
              sustainability, and work-life balance. They value flexibility, and
              young people are able to leverage experiential learning and
              bilingualism to connect with more good youth jobs.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value='Vancouver'>
            <Text>
              Vancouver youth are sustainability conscious and focused,
              interested in positive work environments that align with their
              values. They are keen on mentorship, entrepreneurial pathways, and
              holistic benefits.
            </Text>
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
                  quote={item.Segment}
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
