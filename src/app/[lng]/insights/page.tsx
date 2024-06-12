'use client';

import { Flex, Heading, View } from '@aws-amplify/ui-react';
import Container from '../components/Container';
import InsightCard from '../components/InsightCards';

//TODO: Convert inner-container and cards-container classes to their own components or convert to styled components?

const Insights: React.FC = () => (
  <Container>
    <View as='section' className='container section-padding'>
      <Heading level={2} style={{ color: '#F26B5F' }}>
        insights
      </Heading>
      <Flex className='inner-container'>
        <Flex className='cards-container'>
          <InsightCard
            title='A Day in the Life'
            dataset='Real Affordability Index'
            href='/'
            date={2022}
            description='Using data from our 2022 Real Affordability Index, we crafted a story of what it is like to live as youth, trying to thrive financially in Canada.'
            color='#B8D98C'
          />
          <InsightCard
            title='Best Work City'
            dataset='Urban Work Index'
            href='/'
            date={2023}
            description='Curious where your best work city is based on your needs? Try out our Best Work City Quiz!'
            color='#F6D8D5'
          />
        </Flex>
      </Flex>
    </View>
  </Container>
);

export default Insights;
