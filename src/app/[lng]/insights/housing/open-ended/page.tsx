'use client';

import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import BubbleChartJSON from '@/app/components/dataviz/BubbleChart/BubbleChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import Quote from '@/app/components/Quote';
import { useDimensions } from '@/hooks/useDimensions';
import {
  Flex,
  Heading,
  Text,
  View,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';

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
  const quotesRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
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
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [data, setData] = useState<DataItem>();
  const [quotes, setQuotes] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [visibleQuotes, setVisibleQuotes] = useState<string[]>([]);

  const batchSize = 10;
  const quoteCols = useBreakpointValue({
    base: 1,
    small: 1,
    medium: 2,
    large: 2,
    xl: 3,
  });

  const fetchMoreQuotes = () => {
    if (!loading && offset < quotes.length) {
      setVisibleQuotes((prev) => [
        ...prev,
        ...quotes.slice(offset, offset + batchSize),
      ]);
      setOffset((prev) => prev + batchSize);
    }
  };

  const updateTooltipState = useCallback(
    (newState: Partial<typeof tooltipState>) => {
      setTooltipState((prev) => {
        const hasChanged = (
          Object.keys(newState) as Array<keyof typeof tooltipState>
        ).some((key) => prev[key] !== newState[key]);

        return hasChanged ? { ...prev, ...newState } : prev;
      });
    },
    []
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const jsonData = await fetchData();
      setData(jsonData); // Store parsed JSON in state
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isDrawerOpen) updateTooltipState({ position: null });
    if (isDrawerOpen === false) setQuotes([]);
    if (isDrawerOpen === false) setVisibleQuotes([]);
  }, [isDrawerOpen, updateTooltipState]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreQuotes();
      }
    });

    if (containerRef.current) {
      const lastQuote = quotesRef.current?.querySelector('.quote:last-child');
      if (lastQuote) observerRef.current.observe(lastQuote);
    }

    return () => observerRef.current?.disconnect();
  }, [visibleQuotes]);

  const handleSetQuotes = (incomingQuotes: string[]) => {
    setQuotes(incomingQuotes);
    setVisibleQuotes(incomingQuotes.slice(0, batchSize));
    setOffset(batchSize);
  };

  useEffect(() => {
    if (quotes) {
      const element = document.getElementById('quotes-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling
      }
    }
  }, [quotes]);

  return (
    <View ref={containerRef} style={{ overflowX: 'hidden' }}>
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
              Canada? This visualization is generated with the help of AI. Click
              on a node to view quotes.
            </Text>
          </View>
        </View>
        <Flex justifyContent='center'>
          (
          <BubbleChartJSON
            data={data}
            handleSetQuotes={handleSetQuotes}
            setCode={setCode}
            width={width}
            setIsDrawerOpen={setIsDrawerOpen}
            setTooltipState={updateTooltipState}
          />
          )
        </Flex>
        {visibleQuotes?.length > 0 && (
          <Flex
            direction='column'
            className='short-container'
            id='quotes-container'
            paddingBottom='xxl'
          >
            <Heading level={3} color='font.inverse' marginBottom={0}>
              Quotes tagged with theme {code}
            </Heading>
            <View ref={quotesRef}>
              <Masonry
                className='masonry-grid'
                breakpointCols={quoteCols as number}
                columnClassName='masonry-grid_column'
              >
                {visibleQuotes &&
                  visibleQuotes.map((item, index) => (
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
                      key={index}
                      quote={item}
                      left
                    />
                  ))}
              </Masonry>
            </View>
          </Flex>
        )}
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
