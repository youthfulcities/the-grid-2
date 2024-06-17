'use client';

import useTranslation from '@/app/i18n/client';

import { Flex, Heading, View } from '@aws-amplify/ui-react';

import Container from '../components/Background';
import InsightCards from '../components/InsightCards';

//TODO: Convert inner-container and cards-container classes to their own components or convert to styled components?

interface InsightLayoutProps {
  params: { lng: string };
}

const Insights: React.FC<InsightLayoutProps> = ({ params: { lng } }) => {
  const { t } = useTranslation(lng, 'insights');

  return (
    <Container>
      <View as='section' className='container section-padding'>
        <Heading level={2} style={{ color: '#F26B5F' }}>
          {t('insights')}
        </Heading>
        <Flex className='inner-container'>
          <Flex className='cards-container'>
            <InsightCards lng={lng} />
          </Flex>
        </Flex>
      </View>
    </Container>
  );
};

export default Insights;
