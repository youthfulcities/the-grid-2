'use client';

import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import BubbleChartJSON from '@/app/components/dataviz/BubbleChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import Drawer from '@/app/components/Drawer';
import Quote from '@/app/components/Quote';
import { useDimensions } from '@/hooks/useDimensions';
import { Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import { uniqueId } from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';

Amplify.configure(config);

interface DataItem {
  nodes: Array<{
    id: string;
    quotes: string[];
    value: number;
  }>;
  links: Array<{
    id: string;
    source: string;
    target: string;
    value: number;
  }>;
}

const colors = ['red', 'green', 'yellow', 'pink', 'blue'];

const fetchData = async () => {
  try {
    const downloadResult = await downloadData({
      path: `internal/HOM/survey/reduced_network_chart_data.json`,
    }).result;
    const text = await downloadResult.body.text();
    const jsonData = JSON.parse(text);
    return jsonData;
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
  const [code, setCode] = useState('');
  const [data, setData] = useState<DataItem[]>();
  const [quotes, setQuotes] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const jsonData = await fetchData();
      setData(jsonData); // Store parsed JSON in state
      setLoading(false);
    };
    loadData();
  }, []);

  console.log(data);

  return (
    <View ref={containerRef} style={{ overflow: 'hidden' }}>
      <Container>
        <View className='short-container' paddingTop='xxxl'>
          <Heading level={1}>
            Housing Survey —{' '}
            <span className='highlight'>Open-ended responses</span>
          </Heading>
          <View className='inner-container'>
            <Heading level={3} color='font.inverse' marginBottom='xl' />
            <Text>
              Explore answers to this question: Tell us any other ideas you may
              have about housing in Canada. What were your experiences like
              finding housing? What are you concerned about in the future? What
              would you like to see happen to solve the housing crisis in
              Canada? This visualization is generated with the help of AI.
            </Text>
          </View>
        </View>
        <Flex justifyContent='center' paddingBottom='xxxl'>
          <BubbleChartJSON
            data={data}
            setQuotes={setQuotes}
            setCode={setCode}
            width={width}
            tooltipState={tooltipState}
            setIsDrawerOpen={setIsDrawerOpen}
            setTooltipState={setTooltipState}
          />
        </Flex>
        <Drawer
          isopen={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          tabText='Quotes'
        >
          {quotes?.length > 0 ? (
            <Flex direction='column' paddingTop='xxl' paddingBottom='xxl'>
              <Heading level={3} color='font.inverse' marginBottom={0}>
                Quotes tagged with theme {code}
              </Heading>
              {quotes &&
                quotes.map((item, index) => (
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
                    key={uniqueId()}
                    quote={item}
                    left={index % 2 === 0}
                  />
                ))}
            </Flex>
          ) : (
            <>
              <Text>Please click on a theme node to view quotes.</Text>{' '}
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
    </View>
  );
};

export default Interview;