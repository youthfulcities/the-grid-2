import useDownloadFile from '@/hooks/useDownloadFile';
import { Button, Card, Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import React from 'react';

interface FeatureProps {
  color?: string;
  value?: string;
}

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
      <Flex gap='xl'>
        <img
          src='https://www.youthfulcities.com/wp-content/uploads/2025/05/insight-part-1.3.png'
          alt='Building Bridges: Connecting Youth Skills to the Future
                of Work'
          width='50%'
        />
        <Flex direction='column' justifyContent='center'>
          <View>
            <Heading level={5} color='yellow.60'>
              FEATURED
            </Heading>
            <Heading level={3}>
              Building Bridges: Connecting Youth Skills to the Future of Work
            </Heading>
          </View>
          <Text>
            Download part one of the DEVlab insights report, taking a deep dive
            into youth data insights and stories from the DEVlab project.
          </Text>
          <Button
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
