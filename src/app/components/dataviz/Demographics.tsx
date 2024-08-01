'use client';

import { Flex, Text } from '@aws-amplify/ui-react';
import React from 'react';
import Pie from './Pie';

interface DemographicProps {
  multiWidth: number | undefined;
  currentCluster: string;
  currentClusterName: string | null;
}

const Demographics: React.FC<DemographicProps> = ({
  multiWidth,
  currentCluster,
  currentClusterName,
}) => {
  return (
    <>
      <Text marginBottom='xl' marginTop='xl'>
        Click on a data point to see the demographic breakdown of that cluster.
        Current cluster: {currentClusterName}
      </Text>
      <Flex wrap='wrap' justifyContent='space-between' marginBottom='xl'>
        <Pie
          width={multiWidth}
          type='gender'
          title='Gender'
          cluster={currentCluster}
        />
        <Pie
          width={multiWidth}
          type='status'
          title='Citizenship Status'
          cluster={currentCluster}
        />
        <Pie
          width={multiWidth}
          type='disability'
          cluster={currentCluster}
          title='Ability'
        />
      </Flex>
    </>
  );
};

export default Demographics;
