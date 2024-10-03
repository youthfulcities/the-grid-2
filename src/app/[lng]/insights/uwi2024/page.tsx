'use client';

import Container from '@/app/components/Background';
import IndexHeatmap from '@/app/components/dataviz/IndexHeatmap';
import CustomMap from '@/app/components/dataviz/Map';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import config from '../../../../amplifyconfiguration.json';

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  child?: ReactNode | null;
}

Amplify.configure(config, {
  ssr: true,
});

const Index = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'uwi2024');

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
    value: null,
    content: '',
    group: '',
    topic: '',
    child: null,
  });

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
          <Heading level={3} color='font.inverse' marginBottom='xl'>
            {t('subtitle')}
          </Heading>
          <Text marginBottom='xl'>{t('blurb')}</Text>
          <Heading level={2} color='brand.primary.60'>
            {t('map_heading')}
          </Heading>
          <Text marginBottom='xl'>{t('map_blurb')}</Text>
          <CustomMap
            width={width}
            mapStyle='mapbox://styles/youthfulcities/cm1qlm8y0006o01pb18e49tf9'
            dataset='uwi-2024'
          />
          <Heading level={2} color='brand.primary.60' marginTop='xl'>
            {t('topic_heading')}
          </Heading>
          <Text marginBottom='xl'>{t('topic_blurb')}</Text>
          <Heading level={5} color='brand.primary.60'>
            {t('scoring_heading')}
          </Heading>
          <Text>{t('scoring_blurb')}</Text>
          <IndexHeatmap
            activeFile='heatmap_unpivot.csv'
            width={width}
            setTooltipState={setTooltipState}
          />
          <Heading level={2} color='brand.primary.60' marginTop='xl'>
            {t('more_heading')}
          </Heading>
          <Heading level={3} color='brand.primary.60'>
            {t('chatbot_heading')}
          </Heading>
          <Text>{t('chatbot_blurb')}</Text>
          <ul>
            <li>
              <Text>
                <em>{t('chatbot_prompt1')}</em>
              </Text>
            </li>
            <li>
              <Text>
                <em>{t('chatbot_prompt2')}</em>
              </Text>
            </li>
            <li>
              <Text>
                <em>{t('chatbot_prompt3')}</em>
              </Text>
            </li>
          </ul>
          <Link href='/chatbot' target='_blank'>
            <Button variation='primary' marginTop='small' marginBottom='xl'>
              {t('chatbot_button')}
            </Button>
          </Link>
          <Heading level={3} color='brand.primary.60'>
            {t('stories_heading')}
          </Heading>
          <Text>{t('stories-blurb')}</Text>
          <a
            href='https://www.youthfulcities.com/blog/tag/devlab/'
            target='_blank'
          >
            <Button variation='primary' marginTop='small'>
              {t('stories_button')}
            </Button>
          </a>
        </div>
      </View>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x}
          content={tooltipState.content}
          y={tooltipState.position.y}
          group={tooltipState.group}
          child={tooltipState.child}
        />
      )}
    </Container>
  );
};

export default Index;
