'use client';

import useTranslation from '@/app/i18n/client';
import { Flex, Heading, Text } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import React, { ReactNode, useRef } from 'react';
import Pie from './Pie';

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  cluster?: string;
  child?: ReactNode | null;
  minWidth?: number;
}

interface DemographicProps {
  currentCluster: string;
  drawerwidth?: number;
  tooltipState: TooltipState;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

const Demographics: React.FC<DemographicProps> = ({
  currentCluster,
  drawerwidth,
  tooltipState,
  setTooltipState,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'WUWWL_survey');
  const containerRef = useRef<HTMLDivElement>(null);
  console.log(drawerwidth);
  return (
    <>
      <Heading marginTop='xl' level={4} color='font.inverse'>
        {t('demo_title')}
      </Heading>
      <Text
        marginBottom='xl'
        dangerouslySetInnerHTML={{
          __html: t('demo_cluster', { value: currentCluster }),
        }}
      />

      {currentCluster === t('cluster_economic') && (
        <Text fontSize='small' marginBottom='xl'>
          The “Economic focus” cluster represents young people who identify
          affordability, good youth jobs, local economic growth, mental health
          and transportation as the key areas of focus to improve the
          performance of Canadian cities nationwide.
        </Text>
      )}
      {currentCluster === t('cluster_social') && (
        <Text fontSize='small' marginBottom='xl'>
          The “Social good” cluster represents young people who identified
          affordability, mental health, Indigenous culture, truth &
          reconciliation, and climate change as the key areas of focus to
          improve the performance of Canadian cities nationwide.
        </Text>
      )}
      {currentCluster === t('cluster_forming') && (
        <Text fontSize='small' marginBottom='xl'>
          The “Forming opinions” cluster represents young people who felt that
          affordability is the single most important focus to improve the
          performance of Canadian cities nationwide. They do not currently have
          strong opinions on the relative importance of the remaining topics.
        </Text>
      )}
      <Flex
        wrap='wrap'
        direction='column'
        justifyContent='center'
        alignItems='center'
        marginBottom='xl'
        ref={containerRef}
      >
        <Pie
          width={drawerwidth}
          type='gender'
          title={t('demo_gender')}
          cluster={currentCluster}
          containerRef={containerRef}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
        <Pie
          width={drawerwidth}
          type='status'
          title={t('demo_citizen')}
          cluster={currentCluster}
          containerRef={containerRef}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
        <Pie
          width={drawerwidth}
          type='disability'
          cluster={currentCluster}
          title={t('demo_ability')}
          containerRef={containerRef}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
      </Flex>
    </>
  );
};

export default Demographics;
