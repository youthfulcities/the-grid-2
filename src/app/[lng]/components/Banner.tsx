import cityCards from '@/data/city-cards.json';
import { Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import useTranslation from '../../i18n/client';

const Banner: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');

  return (
    <View className='highlight-bar soft-shadow' as='section'>
      <Flex
        className='short-container'
        justifyContent='space-between'
        alignItems='center'
        direction='row'
        wrap='wrap'
        gap='1rem'
      >
        <View className='fact'>
          <Heading level={4} className='light-heading'>
            {t('datasets')}
          </Heading>
          <Text as='h3' className='outline-text'>
            11
          </Text>
        </View>
        <View className='fact'>
          <Heading level={4} className='light-heading'>
            {t('cities')}
          </Heading>
          <Text as='h3' className='outline-text'>
            {cityCards.cityCards.length}
          </Text>
        </View>
        <View className='fact'>
          <Heading level={4} className='light-heading'>
            {t('records')}
          </Heading>
          <Text as='h3' className='outline-text'>
            454k
          </Text>
        </View>
      </Flex>
    </View>
  );
};

export default Banner;
