import { Flex, View, useTheme } from '@aws-amplify/ui-react';
import Image from 'next/image';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';
import ycLogo from '../../../public/assets/theme_image/YC_SMALL_FULL_colour_white_RGB copy.png';
import useTranslation from '../i18n/client';

const HomeHeaderSection = styled(View)<{ $background: string }>`
  padding: 10% 0;
  height: 100%;
  z-index: 3;
  background-color: ${(props) => props.$background};
`;

const HeroLogo = styled.img`
  position: absolute;
  bottom: -50px;
  left: -80px;
  border: 1px;
  z-index: 5;
  @media screen and (max-width: 992px) {
    bottom: -20px;
    left: -50px;
    width: 250px;
  }

  @media screen and (max-width: 768px) {
    bottom: -20px;
    left: 10px;
    width: 300px;
  }

  @media screen and (max-width: 576px) {
    bottom: 0;
    left: 0;
    width: 200px;
  }

  @media screen and (max-width: 480px) {
    bottom: 0;
    left: 10px;
    width: 180px;
  }
`;

const HomeHeader: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'home');
  const { tokens } = useTheme();

  return (
    <HomeHeaderSection as='section' $background={tokens.colors.blue[60].value}>
      <Flex as='div' direction='column' className='container' gap='zero'>
        <h1 className='header-text'>
          <Trans
            t={t}
            i18nKey='home-tagline'
            components={{ span: <span className='highlight' /> }}
          />
        </h1>
        <Flex gap='zero' wrap='wrap' alignItems='center'>
          <h3 className='header-subtext'>
            <Trans t={t} i18nKey='home-sub-tagline' />
          </h3>
          <a href='https://youthfulcities.com/' target='_blank'>
            <Image alt='Youthful Cities logo' src={ycLogo} width={200} />
          </a>
        </Flex>
        <View as='div' className='relative-container' shrink={3}>
          <img
            className='clip hero-img'
            src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
            alt='New York City at sunset'
          />
          <HeroLogo
            src='/assets/theme_image/YDL_White.png'
            alt='Youth Data Lab logo'
          />
        </View>
      </Flex>
    </HomeHeaderSection>
  );
};
export default HomeHeader;