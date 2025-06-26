'use client';

import useTranslation from '@/app/i18n/client';
import {
  Flex,
  Heading,
  Text,
  View,
  defaultTheme,
  useTheme,
} from '@aws-amplify/ui-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6';
import styled from 'styled-components';
import Newsletter from './Newsletter';

const FooterBase = styled(View)<{ $background: string }>`
  background-color: ${(props) => props.$background};
  padding: 40px 0;
  z-index: 10;
`;

const FooterTopSection = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  z-index: 1;
`;

const LinkAndIconSection = styled(Flex)`
  margin: var(--amplify-space-xl) 0;
`;

const LinkSection = styled(Flex)<{
  $breakpoint: { small: number; medium: number; large: number };
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 10px 0;
  width: 50%;
  @media (min-width: ${(props) => props.$breakpoint.large}px) {
    width: 30%;
  }
  @media (max-width: ${(props) => props.$breakpoint.small}px) {
    width: 100%;
  }
`;

const LinkColumn = styled(Flex)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FooterBottomSection = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HoverLink = styled(Link)<{ $hover: string }>`
  text-decoration: none;
  color: white;
  &:hover {
    color: var(--amplify-colors-secondary-60);
  }
`;

const SocialMediaIcons = styled(Flex)``;

const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  background-color: var(--amplify-colors-yellow-60);
  color: var(--amplify-colors-blue-100);
  border-radius: 35px;
  text-decoration: none;
  font-size: 23px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  &:hover {
    background-color: var(--amplify-colors-blue-100);
    color: var(--amplify-colors-yellow-60);
  }
`;

const FooterComponent = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');
  const { tokens } = useTheme();

  //access default breakpoint values
  const {
    breakpoints: { values: breakpoint },
  } = defaultTheme;

  return (
    <FooterBase as='footer' $background={tokens.colors.blue[100].value}>
      <Flex className='short-container' direction='column' alignItems='stretch'>
        <FooterTopSection>
          <Flex
            direction='column'
            gap='5px'
            maxWidth={{ base: '100%', medium: '50%' }}
          >
            <Heading level={6} color='white'>
              {t('sign-up')}
            </Heading>
            <Text as='h1' color='white'>
              {t('sign-up-text')}
            </Text>
          </Flex>
          <Flex direction='column' alignItems='flex-end'>
            <Newsletter lng={lng} />
          </Flex>
        </FooterTopSection>
        <LinkAndIconSection
          wrap='wrap'
          direction={{ medium: 'row-reverse', base: 'column' }}
          justifyContent='space-between'
        >
          <SocialMediaIcons>
            <IconLink
              href='https://www.facebook.com/youthfulcities'
              target='_blank'
              aria-label='Facebook'
            >
              <FaFacebook />
            </IconLink>
            <IconLink
              href='https://x.com/youthfulcities?s=09'
              target='_blank'
              aria-label='X'
            >
              <FaXTwitter />
            </IconLink>
            <IconLink
              href='https://www.instagram.com/youthfulcities/'
              target='_blank'
              aria-label='Instagram'
            >
              <FaInstagram />
            </IconLink>
            <IconLink
              href='https://www.linkedin.com/company/youthfulcities/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <FaLinkedin />
            </IconLink>
          </SocialMediaIcons>

          <LinkSection $breakpoint={breakpoint}>
            <LinkColumn>
              <HoverLink
                href='/'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('home')}
              </HoverLink>
              <HoverLink
                href='/downloads'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('datasets')}
              </HoverLink>
              <HoverLink
                href='/insights'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('insights')}
              </HoverLink>
              <HoverLink
                href='/about'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('about')}
              </HoverLink>
              <HoverLink
                href='/contact'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('contact')}
              </HoverLink>
            </LinkColumn>
            <LinkColumn>
              <HoverLink
                href='/chatbot'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('chatbot')}
              </HoverLink>
              <HoverLink
                href='/cookie-policy'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('cookie')}
              </HoverLink>
              <HoverLink
                href='/terms'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('terms')}
              </HoverLink>
              <HoverLink
                href='/privacy-policy'
                passHref
                $hover={tokens.colors.primary[60].value}
              >
                {t('privacy')}
              </HoverLink>
            </LinkColumn>
          </LinkSection>
        </LinkAndIconSection>
        <FooterBottomSection>
          <Flex alignItems='center'>
            <Link href={`/${lng}/`}>
              {lng === 'fr' ? (
                <Image
                  src='/assets/theme_image/YDL_white_fr.png'
                  alt='Logo du Labo Data Jeunesse'
                  width={100}
                  height={46}
                />
              ) : (
                <Image
                  src='/assets/theme_image/YDL_White.png'
                  alt='Youth Data Lab Logo'
                  width={100}
                  height={46}
                />
              )}
            </Link>
            <a href='https://www.youthfulcities.com/' target='_blank'>
              <Image
                src='/assets/theme_image/YC_SMALL_ALT_colour_white_RGB.png'
                alt='Youthful Cities Logo'
                width={100}
                height={100}
              />
            </a>
          </Flex>
          <Text fontSize='12px' color='white'>
            © 2024 Youthful Cities. {t('rights')}. Version 1.1.3
          </Text>
        </FooterBottomSection>
      </Flex>
    </FooterBase>
  );
};

export default FooterComponent;
