import { Heading, Text, View } from '@aws-amplify/ui-react';
import { Trans } from 'react-i18next/TransWithoutContext';
import useTranslation from '../i18n/client';

const GridInfo: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'home');
  return (
    <View as='section' className='container section-padding'>
      <Heading level={2} color='primary.60'>
        <Trans
          t={t}
          i18nKey='what-is'
          components={{ span: <span className='highlight' /> }}
        />
      </Heading>
      <View className='inner-container'>
        <Text>{t('what-is-paragraph-1')}</Text>
        <Text>{t('what-is-paragraph-2')}</Text>
      </View>
    </View>
  );
};
export default GridInfo;
