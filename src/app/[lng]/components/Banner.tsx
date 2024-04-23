import cityCards from '@/data/city-cards.json';
import { Flex, Text, View } from '@aws-amplify/ui-react';
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
        wrap='nowrap'
        gap='1rem'
      >
        <View className='fact'>
          <Text as='h4' className='light-heading'>
            {t('datasets')}
          </Text>
          <Text as='h3' className='outline-text'>
            11
          </Text>
        </View>
        <View className='fact'>
          <Text as='h4' className='light-heading'>
            {t('cities')}
          </Text>
          <Text as='h3' className='outline-text'>
            {cityCards.cityCards.length}
          </Text>
        </View>
        <View className='fact'>
          <Text as='h4' className='light-heading'>
            {t('records')}
          </Text>
          <Text as='h3' className='outline-text'>
            454k
          </Text>
        </View>
      </Flex>
    </View>
  );
};

export default Banner;
