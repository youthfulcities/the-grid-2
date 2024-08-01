'use client';

import Container from '@/app/components/Background';
import BarChart from '@/app/components/dataviz/BarChart';
import Clusters from '@/app/components/dataviz/Clusters';
import Demographics from '@/app/components/dataviz/Demographics';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Flex, Heading, Tabs, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import config from '../../../../amplifyconfiguration.json';

interface DataItem {
  [key: string]: string | number;
}
const duration = 500;

Amplify.configure(config, {
  ssr: true,
});

const StyledButton = styled(Button)<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? 'var(--amplify-colors-brand-secondary-60)' : 'default'};
  color: ${(props) =>
    props.$active ? 'var(--amplify-colors-font-primary)' : 'default'};
`;

const clusterMap: {
  'Social good focus': string;
  'Forming opinions': string;
  'Affordability focus': string;
  All: string;
  [key: string]: string; // Index signature
} = {
  'Social good focus': 'social',
  'Forming opinions': 'forming',
  'Affordability focus': 'affordability',
  All: 'all',
};

// Function to get key from value
const getKeyFromValue = (value: string): string | null => {
  const entry = Object.entries(clusterMap).find(([key, val]) => val === value);
  return entry ? entry[0] : null; // Return the key if found, otherwise null
};

const getWidth = (width: number) => {
  if (width >= 1000) {
    return width / 3 - 30;
  }
  if (width >= 700 && width < 1000) {
    return width / 2 - 20;
  }
  if (width < 700) {
    return width;
  }
};

const Survey: React.FC = () => {
  const margin = { top: 60, bottom: 40, left: 100, right: 40 };
  const containerRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(containerRef);
  const height = 800;
  const { width } = chartSize;
  const [activeFile, setActiveFile] = useState('org-attractive-cluster.csv');
  const [currentCluster, setCurrentCluster] = useState('all');
  const [multiWidth, setMultiWidth] = useState(getWidth(width));

  useEffect(() => {
    setMultiWidth(getWidth(width));
  }, [width]);

  return (
    <Container>
      <View className='container padding'>
        <Heading level={1}>
          Skills <span className='highlight'>Mismatch</span>
        </Heading>
        <div className='inner-container' ref={containerRef}>
          <Heading level={3} color='font.inverse'>
            What's up with work lately? Survey 2024
          </Heading>
          <Heading
            className='padding'
            level={5}
            color='font.inverse'
            textAlign='center'
            marginTop='xl'
          >
            Select a segment
          </Heading>
          <Flex justifyContent='center' wrap='wrap'>
            <StyledButton
              $active={activeFile === 'org-attractive-cluster.csv'}
              variation='primary'
              onClick={() => setActiveFile('org-attractive-cluster.csv')}
            >
              Psychographics
            </StyledButton>
            <StyledButton
              $active={activeFile === 'org-attractive-gender.csv'}
              variation='primary'
              onClick={() => setActiveFile('org-attractive-gender.csv')}
            >
              Gender
            </StyledButton>

            <StyledButton
              $active={activeFile === 'org-attractive-city.csv'}
              variation='primary'
              onClick={() => setActiveFile('org-attractive-city.csv')}
            >
              City
            </StyledButton>
            <StyledButton
              $active={activeFile === 'org-attractive-citizen.csv'}
              variation='primary'
              onClick={() => setActiveFile('org-attractive-citizen.csv')}
            >
              Citizenship Status
            </StyledButton>
            <StyledButton
              $active={activeFile === 'org-attractive-disability.csv'}
              variation='primary'
              onClick={() => setActiveFile('org-attractive-disability.csv')}
            >
              Ability
            </StyledButton>
          </Flex>
          <Heading
            level={5}
            color='font.inverse'
            textAlign='center'
            marginTop='xl'
          >
            What makes an organization/company the most attractive to work for?
          </Heading>
          <BarChart
            width={width}
            height={height}
            margin={margin}
            duration={duration}
            activeFile={activeFile}
          />
          <Clusters
            width={width}
            getWidth={getWidth}
            getKeyFromValue={getKeyFromValue}
            currentCluster={currentCluster}
            setCurrentCluster={setCurrentCluster}
            clusterMap={clusterMap}
          />
          <Tabs.Container defaultValue='1' isLazy>
            <Tabs.List>
              <Tabs.Item value='1'>Demographics</Tabs.Item>
              <Tabs.Item value='2'>Results</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel value='1'>
              <Demographics
                currentCluster={currentCluster}
                currentClusterName={getKeyFromValue(currentCluster)}
                multiWidth={multiWidth}
              />
            </Tabs.Panel>
            <Tabs.Panel value='2'></Tabs.Panel>
          </Tabs.Container>
        </div>
      </View>
    </Container>
  );
};

export default Survey;
