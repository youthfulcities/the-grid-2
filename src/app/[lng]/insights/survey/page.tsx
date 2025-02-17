'use client';

import Container from '@/app/components/Background';
import Drawer from '@/app/components/Drawer';
import BarChart from '@/app/components/dataviz/BarChart';
import Clusters from '@/app/components/dataviz/Clusters';
import Demographics from '@/app/components/dataviz/Demographics';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Flex, Heading, Tabs, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import config from '../../../../amplifyconfiguration.json';

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
const defaultFiles: Record<string, string> = {
  '1': 'org-attractive-cluster.csv',
  '2': 'org-attractive-city.csv',
  '3': 'org-attractive-gender.csv',
};

const Survey: React.FC = () => {
  const margin = { top: 20, bottom: 60, left: 150, right: 40 };
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const height = 800;
  const [activeFile, setActiveFile] = useState('org-attractive-cluster.csv');
  const [currentCluster, setCurrentCluster] = useState('all');
  const [tab, setTab] = useState('1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const changeTab = (newTab: string) => {
    setActiveFile(defaultFiles[newTab]);
    setTab(newTab);
  };
  return (
    <Container>
      <View className='container padding'>
        <Heading level={1}>
          What’s up with <span className='highlight'>work lately?</span>
        </Heading>
        <div className='inner-container' ref={containerRef}>
          <Heading level={3} color='font.inverse'>
            Survey Preview
          </Heading>
          <Heading level={2} marginTop='xxxl'>
            Skills Mismatch
          </Heading>
          <Heading level={5} color='font.inverse' textAlign='center'>
            Select a segment
          </Heading>
          <Tabs.Container
            defaultValue='1'
            value={tab}
            onValueChange={(newTab) => changeTab(newTab)}
          >
            <Tabs.List>
              <Tabs.Item value='1'>Psychographic</Tabs.Item>
              <Tabs.Item value='2'>City</Tabs.Item>
              <Tabs.Item value='3'>Identity</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel value='1'>
              <Flex justifyContent='center' wrap='wrap' marginTop='xl'>
                <StyledButton
                  $active={activeFile === 'org-attractive-cluster.csv'}
                  variation='primary'
                  onClick={() => setActiveFile('org-attractive-cluster.csv')}
                >
                  Importance/performance cluster
                </StyledButton>
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value='2'>
              <Flex justifyContent='center' wrap='wrap' marginTop='xl'>
                <StyledButton
                  $active={activeFile === 'org-attractive-city.csv'}
                  variation='primary'
                  onClick={() => setActiveFile('org-attractive-city.csv')}
                >
                  City
                </StyledButton>
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value='3'>
              <Flex justifyContent='center' wrap='wrap' marginTop='xl'>
                <StyledButton
                  $active={activeFile === 'org-attractive-gender.csv'}
                  variation='primary'
                  onClick={() => setActiveFile('org-attractive-gender.csv')}
                >
                  Gender
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
            </Tabs.Panel>
          </Tabs.Container>
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
            tooltipState={tooltipState}
            setTooltipState={setTooltipState}
          />
        </div>
        <Heading level={2} marginTop='xxxl'>
          Go Deeper
        </Heading>
        <Clusters
          getKeyFromValue={getKeyFromValue}
          currentCluster={currentCluster}
          setCurrentCluster={setCurrentCluster}
          clusterMap={clusterMap}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
      </View>
      <Drawer
        isopen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentCluster('all');
        }}
        tabText='Demographics'
      >
        <Demographics
          currentCluster={currentCluster}
          currentClusterName={getKeyFromValue(currentCluster)}
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
        />
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

export default Survey;
