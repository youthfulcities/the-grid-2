import { Button, Flex, Tabs } from '@aws-amplify/ui-react';
import { useState } from 'react';
import styled from 'styled-components';
import Accordion from './Accordion';
import Clusters from './dataviz/Clusters';

const StyledButton = styled(Button)<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? 'var(--amplify-colors-brand-secondary-60)' : 'default'};
  color: ${(props) =>
    props.$active ? 'var(--amplify-colors-font-primary)' : 'default'};
`;

const TabSelect = ({ setActiveFile, activeFile, defaultFiles }) => {
  const [tab, setTab] = useState('1');

  const changeTab = (newTab: string) => {
    setActiveFile(defaultFiles[newTab]);
    setTab(newTab);
  };
  return (
    <Tabs.Container
      defaultValue='1'
      value={tab}
      onValueChange={(newTab) => changeTab(newTab)}
    >
      <Tabs.List>
        <Tabs.Item value='1'>Identity</Tabs.Item>
        <Tabs.Item value='2'>Psychographic</Tabs.Item>
        <Tabs.Item value='3'>City</Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value='1'>
        <Flex wrap='wrap'>
          <StyledButton
            $active={activeFile === 'org-attractive-city.csv'}
            variation='primary'
            onClick={() => setActiveFile('org-attractive-city.csv')}
          >
            Age group
          </StyledButton>
          <StyledButton
            $active={activeFile === 'org-attractive-disability.csv'}
            variation='primary'
            onClick={() => setActiveFile('org-attractive-disability.csv')}
          >
            [Dis]Ability
          </StyledButton>
          <StyledButton
            $active={activeFile === 'org-attractive-city.csv'}
            variation='primary'
            onClick={() => setActiveFile('org-attractive-city.csv')}
          >
            Ethnicity
          </StyledButton>
          <StyledButton
            $active={activeFile === 'org-attractive-city.csv'}
            variation='primary'
            onClick={() => setActiveFile('org-attractive-city.csv')}
          >
            COVID Impact
          </StyledButton>
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value='2'></Tabs.Panel>
      <Tabs.Panel value='3' />
    </Tabs.Container>
  );
};

export default TabSelect;
