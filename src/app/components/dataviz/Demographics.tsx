'use client';

import { Flex, Heading, Text } from '@aws-amplify/ui-react';
import React, { useRef } from 'react';
import Pie from './Pie';

interface DemographicProps {
  currentCluster: string;
  currentClusterName: string | null;
  drawerWidth: number;
}

const Demographics: React.FC<DemographicProps> = ({
  currentCluster,
  currentClusterName,
  drawerWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Heading marginTop='xl' level={4} color='font.inverse'>
        Demographic breakdown
      </Heading>
      <Text marginBottom='xl'>Current cluster: {currentClusterName}</Text>
      {currentCluster === 'affordability' && (
        <Text fontSize='small' marginBottom='xl'>
          The “Economic focus” cluster represents young people who identify
          affordability, good youth jobs, local economic growth, mental health
          and transportation as the key areas of focus to improve the
          performance of Canadian cities nationwide.
        </Text>
      )}
      {currentCluster === 'social' && (
        <Text fontSize='small' marginBottom='xl'>
          The “Social good” cluster represents young people who identified
          affordability, mental health, Indigenous culture, truth &
          reconciliation, and climate change as the key areas of focus to
          improve the performance of Canadian cities nationwide.
        </Text>
      )}
      {currentCluster === 'forming' && (
        <Text fontSize='small' marginBottom='xl'>
          The “Forming opinions” cluster represents young people who felt that
          affordability is the single most important focus to improve the
          performance of Canadian cities nationwide. They do not currently have
          strong opinions on the relative importance of the remaining topics.
        </Text>
      )}
      <Flex
        wrap='wrap'
        justifyContent='space-between'
        marginBottom='xl'
        ref={containerRef}
      >
        <Pie
          width={drawerWidth}
          type='gender'
          title='Gender'
          cluster={currentCluster}
          containerRef={containerRef}
        />
        <Pie
          width={drawerWidth}
          type='status'
          title='Citizenship Status'
          cluster={currentCluster}
          containerRef={containerRef}
        />
        <Pie
          width={drawerWidth}
          type='disability'
          cluster={currentCluster}
          title='Ability'
          containerRef={containerRef}
        />
      </Flex>
    </>
  );
};

export default Demographics;
