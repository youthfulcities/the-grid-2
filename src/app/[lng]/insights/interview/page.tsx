'use client';

import config from '@/amplifyconfiguration.json';
import Container from '@/app/components/Background';
import CrosslinkCard from '@/app/components/CrosslinkCard';
import BubbleChart from '@/app/components/dataviz/BubbleChart/BubbleChart';
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
  Loader,
  Tabs,
  Text,
  View,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { downloadData } from 'aws-amplify/storage';
import * as d3 from 'd3';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';

Amplify.configure(config);

const colors = ['red', 'green', 'yellow', 'pink', 'blue'];
const filename = 'DEV_WUWWL_2024_Full_National.xlsx';

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
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'WUWWL_interview');

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
  const [city, setCity] = useState('ALL');
  const [code, setCode] = useState('');
  const [data, setData] = useState<d3.DSVRowString<string>[]>([]);
  const [offset, setOffset] = useState(0);
  const [visibleQuotes, setVisibleQuotes] = useState<d3.DSVRowString<string>[]>(
    []
  );
  const quoteSize = useBreakpointValue({
    base: 90,
    small: 90,
    medium: 70,
    large: 60,
    xl: 40,
  });
  const posts = useFilteredPosts(47, lng);

  const batchSize = 10;

  const fetchMoreQuotes = () => {
    if (!loading && offset < data.length) {
      setVisibleQuotes((prev) => [
        ...prev,
        ...data.slice(offset, offset + batchSize),
      ]);
      setOffset((prev) => prev + batchSize);
    }
  };

  const [tab, setTab] = useState('ALL');
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
    if (code_parent === 'Root') {
      const filteredData = parsedData.filter((quote) => quote.code_2 === '');
      const finalData = filteredData.length > 0 ? filteredData : parsedData;
      setData(finalData);
      setVisibleQuotes(finalData.slice(0, batchSize));
      setOffset(batchSize);
      setCode(code_child || code_parent);
      setLoading(false);
    } else {
      const filteredData = parsedData.filter((quote) =>
        quote.code_2.includes(code_child)
      );

      const finalData = filteredData.length > 0 ? filteredData : parsedData;
      setData(finalData);
      setVisibleQuotes(finalData.slice(0, batchSize));
      setOffset(batchSize);
      setCode(code_child || code_parent);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) setTooltipState({ position: null });
    if (isDrawerOpen === false) setData([]);
    if (isDrawerOpen === false) setVisibleQuotes([]);
  }, [isDrawerOpen, setTooltipState]);

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

  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1}>
          <Trans
            t={t}
            i18nKey='title'
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <div className='inner-container'>
          <Heading marginBottom='xl' level={3} color='font.inverse'>
            {t('youth_cite')}
          </Heading>
        </div>
        <Trans t={t} i18nKey='blurb' components={{ p: <Text /> }} />
        <Tabs.Container
          defaultValue='1'
          value={tab}
          onValueChange={(newTab) => changeTab(newTab)}
        >
          <Tabs.List style={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Tabs.Item value='ALL'>{t('national')}</Tabs.Item>
            <Tabs.Item value='TO'>Toronto</Tabs.Item>
            <Tabs.Item value='CAL'>Calgary</Tabs.Item>
            <Tabs.Item value='MTL'>Montréal</Tabs.Item>
            <Tabs.Item value='VAN'>Vancouver</Tabs.Item>
            <Tabs.Item value='MON'>Moncton</Tabs.Item>
            <Tabs.Item value='REG'>Regina</Tabs.Item>
            <Tabs.Item value='WTH'>Whitehorse</Tabs.Item>
            <Tabs.Item value='YKN'>Yellowknife</Tabs.Item>
          </Tabs.List>
          <Tabs.Panel value='ALL'>
            <Text />
          </Tabs.Panel>
          <Tabs.Panel value='TO'>
            <Text>{t('toronto_profile')}</Text>
          </Tabs.Panel>
          <Tabs.Panel value='CAL'>
            <Text>{t('calgary_profile')}</Text>
          </Tabs.Panel>
          <Tabs.Panel value='MTL'>
            <Text>{t('montreal_profile')}</Text>
          </Tabs.Panel>
          <Tabs.Panel value='VAN'>
            <Text>{t('vancouver_profile')}</Text>
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
        <Heading level={2} marginTop='xxl'>
          {t('theme_title')}
        </Heading>
        <Heading level={3} color='secondary.60'>
          {t('theme_ecosystems_title')}
        </Heading>
        <Trans
          t={t}
          i18nKey='theme_ecosystems_content'
          components={{ p: <Text /> }}
        />
        <Heading level={3} marginTop='large' color='secondary.60'>
          {t('theme_future_title')}
        </Heading>
        <Trans
          t={t}
          i18nKey='theme_future_content'
          components={{ p: <Text /> }}
        />
        <Heading level={3} marginTop='large' color='secondary.60'>
          {t('theme_transition_title')}
        </Heading>
        <Trans
          t={t}
          i18nKey='theme_transition_content'
          components={{ p: <Text /> }}
        />
        <Heading level={3} marginTop='large' color='secondary.60'>
          {t('theme_org_title')}
        </Heading>
        <Trans t={t} i18nKey='theme_org_content' components={{ p: <Text /> }} />
        <Heading level={2} marginTop='xxl'>
          {t('dig_deeper')}
        </Heading>
        <Heading level={4} color='secondary.60' marginBottom='xs'>
          {t('stories_heading')}
        </Heading>
        <Grid
          columnGap='small'
          rowGap='small'
          templateColumns={{
            base: '1fr',
            medium: '1fr 1fr',
            large: '1fr 1fr 1fr 1fr',
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
          {t('download')}
        </Heading>
        <Text>{t('download_desc')}</Text>
        <Button variation='primary' onClick={useDownloadFile(filename)}>
          {t('download_button')}
        </Button>
        <Heading
          level={4}
          color='secondary.60'
          marginTop='xxl'
          marginBottom='xs'
        >
          {t('chatbot_title')}
        </Heading>
        <Text>{t('chatbot_text')}</Text>
        <Link href='/chatbot' target='_blank'>
          <Button variation='primary' marginTop='xs' marginBottom='xl'>
            {t('chatbot_button')}
          </Button>
        </Link>
        <Heading level={2} marginTop='xxl' marginBottom='xs'>
          {t('data_details_title')}
        </Heading>
        <Trans
          t={t}
          i18nKey='data_details'
          components={{
            p: <Text />,
            a: (
              <a
                href='https://www.youthfulcities.com/devlab/'
                target='_blank'
              />
            ),
            ul: <ul />,
            li: <li />,
          }}
        />
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        tabText={t('drawer_tab')}
        maxWidth={quoteSize as number}
      >
        {visibleQuotes.length > 0 ? (
          <Flex direction='column' paddingTop='xxl' paddingBottom='xxl'>
            <Heading level={3} color='font.inverse' marginBottom={0}>
              <Trans t={t} i18nKey='drawer_heading' values={{ code }} />
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
                    key={item.UID}
                    quote={item.segment}
                    left={index % 2 === 0}
                  />
                ))}
            </View>
            {loading && <Loader />}
            <Text marginTop='xl'>{t('chatbot_text')}</Text>
            <Link href='/chatbot' target='_blank'>
              <Button variation='primary' marginBottom='xl'>
                {t('chatbot_button')}
              </Button>
            </Link>
          </Flex>
        ) : (
          <>
            <Text>{t('quotes_empty')}</Text>{' '}
            <Text marginTop='xl'>{t('chatbot_text')}</Text>
            <Link href='/chatbot' target='_blank'>
              <Button variation='primary' marginBottom='xl'>
                {t('chatbot_button')}
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
