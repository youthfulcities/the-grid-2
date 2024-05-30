'use client';

import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import useTranslation from '../../i18n/client';

interface FooterProps {
  lng: string;
}

const FooterBase = styled(View)<{ $background: string }>`
  background-color: ${(props) => props.$background};
  padding: 40px 0;
`;

const FooterTopSection = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const StyledTextField = styled(TextField)<{ $border: string }>`
  max-width: 100%;
  flex-grow: 2;
  background-color: white;
  input {
    border-color: transparent;
  }

  input:focus {
    border-color: ${(props) => props.$border};
  }
`;

const LinkSection = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 10px 0;
  gap: 200px;
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

const HoverLink = styled(Link)<{ $hover: string; $color: string }>`
  text-decoration: none;
  color: var(--amplify-colors-font-inverse);
  &:hover {
    color: var(--amplify-colors-secondary-60);
  }
`;

const OffsetImg = styled.img`
  margin-left: -14px;
`;

const FooterComponent: React.FC<FooterProps> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');
  const { tokens } = useTheme();

  return (
    <FooterBase as='footer' $background={tokens.colors.blue[100].value}>
      <Flex className='short-container' direction='column' alignItems='stretch'>
        <FooterTopSection>
          <Flex
            direction='column'
            gap='5px'
            maxWidth={{ base: '100%', medium: '50%' }}
          >
            <Heading level={6} color={tokens.colors.font.inverse.value}>
              {t('sign-up')}
            </Heading>
            <Text as='h1' color={tokens.colors.font.inverse.value}>
              {t('sign-up-text')}
            </Text>
          </Flex>
          <Flex direction='row' alignContent='stretch' gap='10px'>
            <StyledTextField
              $border={tokens.colors.secondary[60].value}
              label={t('newsletter-email')}
              labelHidden
              placeholder={t('email')}
            />
            <Button colorTheme='error' variation='primary'>
              {t('subscribe')}
            </Button>
          </Flex>
        </FooterTopSection>

        <LinkSection>
          <LinkColumn>
            <HoverLink
              href={`${lng}/`}
              passHref
              $hover={tokens.colors.primary[60].value}
              $color={tokens.colors.font.inverse.value}
            >
              {t('home')}
            </HoverLink>
            <HoverLink
              href={`${lng}/about`}
              passHref
              $hover={tokens.colors.primary[60].value}
              $color={tokens.colors.font.inverse.value}
            >
              {t('about')}
            </HoverLink>
            <HoverLink
              href={`${lng}/datasets`}
              passHref
              $hover={tokens.colors.primary[60].value}
              $color={tokens.colors.font.inverse.value}
            >
              {t('datasets')}
            </HoverLink>
          </LinkColumn>
          <LinkColumn>
            <HoverLink
              href={`${lng}/insights`}
              passHref
              $hover={tokens.colors.primary[60].value}
              $color={tokens.colors.font.inverse.value}
            >
              {t('insights')}
            </HoverLink>
            <HoverLink
              href={`${lng}/contact`}
              passHref
              $hover={tokens.colors.primary[60].value}
              $color={tokens.colors.font.inverse.value}
            >
              {t('contact')}
            </HoverLink>
          </LinkColumn>
        </LinkSection>

        <FooterBottomSection>
          <OffsetImg
            src='/assets/theme_image/THE_GRID_logo_RGB_orange.png'
            alt='Your Logo'
            width='100px'
          />
          <Text fontSize='12px' color='white'>
            © 2023 The Grid. {t('rights')}
          </Text>
        </FooterBottomSection>
      </Flex>
    </FooterBase>
  );
};

export default FooterComponent;
