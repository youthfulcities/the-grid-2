'use client';

import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import BubbleChart from '@/app/components/dataviz/BubbleChart';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import Drawer from '@/app/components/Drawer';
import Quote from '@/app/components/Quote';
import { useDimensions } from '@/hooks/useDimensions';
import { Flex, Heading, Loader, Tabs, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import { ReactNode, useEffect, useRef, useState } from 'react';

Amplify.configure(config);
const colors = ['red', 'green', 'yellow', 'pink', 'blue'];

const useFetchQuoteData = (city: string, code: string) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (data[city]) return;
      try {
        const downloadResult = await downloadData({
          path: `internal/doc_city=${city}/code_1=${code}/data.csv`,
        }).result;
        const text = await downloadResult.body.text();
        console.log(text);
        setData((prevData) => ({ ...prevData, [city]: text }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [city, data]);

  return data[city];
};

const parseCSVData = (csvString: string, code: string) => {
  const parsed = d3.csvParse(csvString);
  console.log(parsed);
  return parsed;
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
  const [code, setCode] = useState('Ideal Work Model');
  const allQuotes = useFetchQuoteData(city, code);
  const [data, setData] = useState(null);

  const [tab, setTab] = useState('Toronto');
  const changeTab = (newTab: string) => {
    setCity(newTab);
    setTab(newTab);
  };

  useEffect(() => {
    if (allQuotes) setData(parseCSVData(allQuotes, code));
  }, [allQuotes]);

  console.log(data);
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
          setCode={setCode}
        />
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        tabText='Quotes'
      >
        {data ? (
          <Flex direction='column' paddingTop='xxl' paddingBottom='xxl'>
            <Heading level={3} color='font.inverse' marginBottom={0}>
              Quotes with tag: {code}
            </Heading>
            {data &&
              data.map((item, index) => (
                <Quote
                  $color={colors[index % colors.length]}
                  key={item.UID}
                  quote={item.Segment}
                  left={index % 2 === 0}
                />
              ))}
          </Flex>
        ) : (
          <Text>Please click on a theme node to view quotes.</Text>
        )}
        {loading && <Loader />}
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
