import FadeInUp from '@/app/components/FadeInUp';
import Feature from '@/app/components/Feature';
import InsightCards from '@/app/components/InsightCards';
import useTranslation from '@/app/i18n/client';
import { Flex, View, useTheme } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import styled from 'styled-components';

const HomeHeaderSection = styled(View)<{ $background: string }>`
  padding: 10% 0;
  height: 100%;
  z-index: 3;
  background-color: ${(props) => props.$background};
`;

const HeroLogo = styled.img`
  left: -80px;
  border: 1px;
  z-index: 5;
  @media screen and (max-width: 992px) {
    left: -50px;
    width: 250px;
  }

  @media screen and (max-width: 768px) {
    left: 10px;
    width: 300px;
  }

  @media screen and (max-width: 576px) {
    left: 0;
    width: 200px;
  }

  @media screen and (max-width: 480px) {
    left: 10px;
    width: 180px;
  }
`;

const HomeHeader = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'home');
  const { tokens } = useTheme();

  return (
    <HomeHeaderSection as='section' $background={tokens.colors.blue[60].value}>
      <Flex as='div' direction='column' className='container' gap='zero'>
        <FadeInUp>
          {lng === 'fr' ? (
            <img
              src='/assets/theme_image/YDL_white_fr.png'
              alt='Logo du Labo Data Jeunesse'
              width='300px'
            />
          ) : (
            <img
              src='/assets/theme_image/YDL_White.png'
              alt='Youth Data Lab logo'
              width='300px'
            />
          )}
          <h1>
            <Trans
              t={t}
              i18nKey='home-tagline'
              components={{ span: <span className='alt-highlight' /> }}
            />
          </h1>
          <Flex gap='zero' wrap='wrap' alignItems='center'>
            <h3 className='header-subtext'>
              <Trans t={t} i18nKey='home-sub-tagline' />
            </h3>
            {/* <a href='https://youthfulcities.com/' target='_blank'>
            <Image alt='Youthful Cities logo' src={ycLogo} width={200} />
            </a> */}
          </Flex>
        </FadeInUp>
        <FadeInUp>
          <Feature color='blue' value='90' />
        </FadeInUp>
        <FadeInUp>
          <InsightCards lng={lng} maxLength={4} />
        </FadeInUp>
      </Flex>
    </HomeHeaderSection>
  );
};
export default HomeHeader;
