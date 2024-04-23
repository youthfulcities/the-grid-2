import { Flex, View } from '@aws-amplify/ui-react';
import { Trans } from 'react-i18next/TransWithoutContext';
import useTranslation from '../../i18n/client';

const HomeHeader: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'home');

  return (
    <View as='section' className='home-header'>
      <Flex as='div' direction='column' className='container'>
        <h1 className='header-text'>
          <Trans
            t={t}
            i18nKey='home-tagline'
            components={{ span: <span className='highlight' /> }}
          />
        </h1>
        <h3 className='header-subtext'>
          <Trans
            t={t}
            i18nKey='home-sub-tagline'
            // eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            components={{ a: <a href='https://youthfulcities.com/' /> }}
          />
        </h3>
        <View as='div' className='relative-container' shrink={3}>
          <img
            className='clip hero-img'
            src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
            alt='New York City at sunset'
          />
          <img
            className='hero-logo'
            src='/assets/theme_image/THE_GRID_logo_RGB_yellow.png'
            alt='THE GRID logo'
          />
        </View>
      </Flex>
    </View>
  );
};
export default HomeHeader;
