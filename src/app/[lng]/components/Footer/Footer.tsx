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
import useTranslation from '../../../i18n/client';
import styles from './footer.module.css';

interface FooterProps {
  lng: string;
}

const FooterView = styled(View)<{ background: string }>`
  background-color: ${(props) => props.background};
  position: relative;
  padding: 40px 0;
`;

const FooterComponent: React.FC<FooterProps> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');
  const { tokens } = useTheme();

  return (
    <FooterView as='footer' background={tokens.colors.primary[60].value}>
      <Flex className='short-container' direction='column' alignItems='stretch'>
        <Flex className={styles.topSection}>
          <Flex direction='column' gap='5px'>
            <Heading level={6} color={tokens.colors.font.inverse.value}>
              Sign up for our newsletter
            </Heading>
            <Text as='h1' color={tokens.colors.font.inverse.value}>
              postings.” Stay connected and up to date on new data, insights, or
              job
            </Text>
          </Flex>
          <Flex direction='row' alignContent='stretch' gap='10px' width='100%'>
            <TextField
              className={styles.textField}
              width='100%'
              label='Newsletter Email'
              labelHidden
              placeholder='Your Email'
              backgroundColor='white'
            />
            <Button colorTheme='error' variation='primary'>
              Subscribe
            </Button>
          </Flex>
        </Flex>

        <Flex className={styles.linkSection}>
          <Flex className={styles.linkColumn}>
            <Link href={`${lng}/`} passHref>
              <Text className={styles.smallText}>{t('home')}</Text>
            </Link>
            <Link href={`${lng}/about`} passHref>
              <Text className={styles.smallText}>{t('about')}</Text>
            </Link>
            <Link href={`${lng}/datasets`} passHref>
              <Text className={styles.smallText}>{t('datasets')}</Text>
            </Link>
          </Flex>
          <Flex className={styles.linkColumn}>
            <Link href={`${lng}/insights`} passHref>
              <Text className={styles.smallText}>{t('insights')}</Text>
            </Link>
            <Link href={`${lng}/contact`} passHref>
              <Text className={styles.smallText}>{t('contact')}</Text>
            </Link>
          </Flex>
        </Flex>

        <Flex className={styles.logoAndRightsContainer}>
          <View>
            <img
              src='/assets/theme_image/THE_GRID_logo_RGB_orange.png'
              alt='Your Logo'
              className={styles.logoImage}
            />
          </View>
          <Text fontSize='12px' color='white'>
            © 2023 The Grid. All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </FooterView>
  );
};

export default FooterComponent;
