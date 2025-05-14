import useDownloadFile from '@/hooks/useDownloadFile';
import { Button, Card, Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import React from 'react';
import styled from 'styled-components';

interface FeatureProps {
  color?: string;
  value?: string;
}

const StyledImage = styled.img`
  aspect-ratio: 8 / 10;
  object-fit: contain;
  width: 100%;
  max-width: 400px;
`;

const Feature: React.FC<FeatureProps> = ({ color = 'blue', value = '60' }) => {
  const { downloadFile } = useDownloadFile();

  return (
    <Card
      backgroundColor={`${color}.${value}`}
      variation='elevated'
      borderRadius='xl'
      padding='xl'
      marginTop='xxl'
      marginBottom='xxl'
    >
      <Flex
        direction={{ base: 'column', medium: 'row' }}
        gap='xl'
        alignItems='center'
        justifyContent='space-between'
        wrap='nowrap'
      >
        <StyledImage
          src='https://www.youthfulcities.com/wp-content/uploads/2025/05/insight-part-1.3.png'
          alt='Building Bridges: Connecting Youth Skills to the Future of Work'
        />
        <Flex
          direction='column'
          justifyContent='center'
          maxWidth={{ base: '100%', medium: '60%' }}
          paddingTop={{ base: 'medium', medium: '0' }}
        >
          <View marginBottom='small'>
            <Heading level={5} color='yellow.60'>
              FEATURED
            </Heading>
            <Heading level={3}>
              Building Bridges: Connecting Youth Skills to the Future of Work
            </Heading>
          </View>
          <Text marginBottom='medium'>
            Download part one of the DEVlab insights report, taking a deep dive
            into youth data insights and stories from the DEVlab project.
          </Text>
          <Button
            data-ga-download='download-insight-part-1-final-small.pdf'
            id='feature-download-insight-part-1-final-small.pdf'
            onClick={() => downloadFile('insight-part-1-final-small.pdf', true)}
            variation='primary'
          >
            Download Now
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Feature;
