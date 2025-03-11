'use client';

// import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import CrosslinkCard from '@/app/components/CrosslinkCard';
import BubbleChartJSON from '@/app/components/dataviz/BubbleChart/BubbleChartJSON';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import Drawer from '@/app/components/Drawer';
import Quote from '@/app/components/Quote';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import useDownloadFile from '@/hooks/useDownloadFile';
import useFilteredPosts from '@/hooks/useFilteredPosts';
import {
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useBreakpointValue,
  View,
} from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import { useParams } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';

// Amplify.configure(config);

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
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'housing');

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
  const posts = useFilteredPosts(49, lng);
  const filename = 'Housing Survey Open-Ended Responses.csv';

  const batchSize = 10;
  const quoteSize = useBreakpointValue({
    base: 90,
    small: 90,
    medium: 70,
    large: 50,
    xl: 40,
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

  return (
    <View style={{ overflowX: 'hidden' }}>
      <Container>
        <View className='short-container' paddingTop='xxxl'>
          <Heading level={1}>
            <Trans
              t={t}
              i18nKey='title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Heading level={3} color='font.inverse' marginBottom='xl'>
              {t('subtitle')}
            </Heading>
          </View>
          <View ref={containerRef}>
            <Heading level={4} color='secondary.60' marginBottom='xs'>
              {t('description_sub_1')}
            </Heading>
            <Text marginBottom='xl'>{t('description_p_1')}</Text>
            <Heading level={4} color='secondary.60' marginBottom='xs'>
              {t('description_sub_2')}
            </Heading>
            <Text>{t('description_p_1.5')}</Text>
            <Text>{t('description_p_2')}</Text>
            <BubbleChartJSON
              data={data}
              handleSetQuotes={handleSetQuotes}
              setCode={setCode}
              width={width}
              setIsDrawerOpen={setIsDrawerOpen}
              setTooltipState={updateTooltipState}
            />
          </View>
        </View>

        <View
          className='short-container'
          paddingTop='medium'
          paddingBottom='xxxl'
        >
          <View>
            <Heading
              level={4}
              color='secondary.60'
              marginBottom='xs'
              marginTop='xxl'
            >
              {t('stories_heading')}
            </Heading>
            <Grid
              columnGap='small'
              rowGap='small'
              templateColumns={{
                base: '1fr',
                medium: '1fr 1fr',
                large: '1fr 1fr',
                xl: '1fr 1fr 1fr 1fr',
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
        <Drawer
          isopen={isDrawerOpen}
          onOpen={() => setIsDrawerOpen(true)}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          tabText={t('drawer_tab')}
        >
          {visibleQuotes?.length > 0 ? (
            <Flex direction='column'>
              <Heading level={3} color='font.inverse' marginBottom={0}>
                <Trans t={t} i18nKey='helper_text' values={{ code }} />
              </Heading>
              <View ref={quotesRef}>
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
                      left={index % 2 === 0}
                    />
                  ))}
              </View>
            </Flex>
          ) : (
            <Flex direction='column'>
              <Heading level={3} color='font.inverse' marginBottom={0}>
                {t('quotes_empty')}
              </Heading>
            </Flex>
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
