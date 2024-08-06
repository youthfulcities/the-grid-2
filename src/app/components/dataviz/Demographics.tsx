'use client';

import { Flex, Text } from '@aws-amplify/ui-react';
import React from 'react';
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
  return (
    <>
      <Text marginBottom='xl' marginTop='xl'>
        Current cluster: {currentClusterName}
      </Text>
      <Flex wrap='wrap' justifyContent='space-between' marginBottom='xl'>
        <Pie
          width={drawerWidth}
          type='gender'
          title='Gender'
          cluster={currentCluster}
        />
        <Pie
          width={drawerWidth}
          type='status'
          title='Citizenship Status'
          cluster={currentCluster}
        />
        <Pie
          width={drawerWidth}
          type='disability'
          cluster={currentCluster}
          title='Ability'
        />
      </Flex>
    </>
  );
};

export default Demographics;
