'use client';

import Accordion from '@/app/components/Accordion';
import Container from '@/app/components/Background';
import Drawer from '@/app/components/Drawer';
import Quote from '@/app/components/Quote';
import TabSelect from '@/app/components/TabSelect';
import BarChart from '@/app/components/dataviz/BarChart';
import Clusters from '@/app/components/dataviz/Clusters';
import Demographics from '@/app/components/dataviz/Demographics';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import config from '../../../../amplifyconfiguration.json';

const duration = 500;

Amplify.configure(config, {
  ssr: true,
});

const TabsContainer = styled(View)`
  position: sticky;
  top: 0;
  z-index: 980;
  background-color: rgba(33, 33, 33, 0.9);
  backdrop-filter: blur(10px);
  margin-bottom: var(--amplify-space-medium);
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
  const entry = Object.values(clusterMap).find((val) => val === value);
  return entry ? entry[0] : null; // Return the key if found, otherwise null
};

const defaultFiles: Record<string, string> = {
  '1': 'org-attractive-disability.csv',
  '2': 'org-attractive-cluster.csv',
  '3': 'org-attractive-city.csv',
};

const Survey: React.FC = () => {
  const margin = { top: 20, bottom: 60, left: 150, right: 40 };
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const height = 800;
  const [activeFile, setActiveFile] = useState('org-attractive-cluster.csv');
  const [currentCluster, setCurrentCluster] = useState('all');
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

  return (
    <Container>
      <View className='container padding'>
        <Heading level={1}>
          Skills <span className='highlight'>Development</span>
        </Heading>
        <div className='inner-container' ref={containerRef}>
          <Heading level={3} color='font.inverse'>
            What’s up with work lately? Survey 2024
          </Heading>
          <Text>
            Discover how young people view their work-life dynamics, their
            employability, the resources provided by their cities, and the
            skills needed to succeed in the current and future job markets.
          </Text>
          <TabsContainer>
            <Accordion
              title='Select data segment'
              open={0}
              border={false}
              padding={false}
            >
              <TabSelect
                setActiveFile={setActiveFile}
                activeFile={activeFile}
                defaultFiles={defaultFiles}
              />
            </Accordion>
          </TabsContainer>
          {activeFile === 'org-attractive-cluster.csv' && (
            <Accordion title='More about psychographic clusters'>
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
            </Accordion>
          )}
          <Heading level={2} id='mismatch' marginTop='xl' color='font.inverse'>
            Skill Mismatch
          </Heading>
          <Heading level={3} color='font.inverse'>
            Organizational Expectations and Preferences
          </Heading>
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
          <Quote
            $color='yellow'
            quote="“There are generalized specialists for everything. And employers sometimes want someone with a specific skill set. So there is a mismatch because if asked to identify your strongest skill and if the person is more of a generalist, they can't describe their skills as well.” - M.P (Youth, Toronto)"
          />
          <Quote
            $color='pink'
            left={false}
            quote='“The people graduating are expected to know everything. Communication, social media, graphic design. Technical writing, become an expert in all of the technology that the older generation may not understand, and then be able to coach them through it” - D. (Youth, Calgary)'
          />
          <Quote
            $color='green'
            quote='“So many people are applying to the jobs, and because the labour market right now is so tight, people who are probably way overqualified for the position are getting the job over someone who actually is more on the entry-level side. So the competition for general administrative roles. Or even accounting right now is pretty tough out there.” (Professional, Express Employment, Calgary)'
          />
          <Heading level={2} id='gap' marginTop='xl' color='font.inverse'>
            Skill Gap
          </Heading>
          <Heading level={3} color='font.inverse'>
            Gaps
          </Heading>
          <Heading level={3} color='font.inverse'>
            Networking & Job Seeking
          </Heading>
          <Heading level={2} id='future' marginTop='xl' color='font.inverse'>
            Future of work
          </Heading>
          <Heading level={3} color='font.inverse'>
            Work Styles
          </Heading>
          <Heading level={3} color='font.inverse'>
            AI Spotlight
          </Heading>
        </div>
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
