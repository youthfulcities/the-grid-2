'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Image, View, Menu, MenuButton, MenuItem } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from './navbar.module.css';

const NavBar = () => {

  const [currentLangCode, setCurrentLangCode] = useState('en');
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { t } = useTranslation();

  return (
    <Flex
      as='nav'
      direction='row'
      justifyContent='space-around'
      alignItems='center'
      gap='10px'
      width='100%'
      overflow='hidden'
      position='relative'
      boxShadow='0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448)'
      padding='16px 32px'
      backgroundColor='rgba(251,208,101,1)'
    >
      <Flex alignItems='center'>
        <Link href='/'>
          <Image
            src='/assets/theme_image/THE_GRID_logo_RGB_black.png'
            alt='Logo'
            style={{ width: '100%', height: '80px', top: '-15.5px', left: '-24px' }}
          />
        </Link>
        <View>
          <Button
            colorTheme='overlay'
            border='0'
            width='30px'
            height='30px'
            size='small'
            fontWeight={currentLangCode === 'fr' ? 300 : 600}
            onClick={() => setCurrentLangCode('en')}
          >
            EN
          </Button>
          |
          <Button
            colorTheme='overlay'
            border='0'
            width='30px'
            height='30px'
            size='small'
            fontWeight={currentLangCode === 'en' ? 300 : 600}
            onClick={() => setCurrentLangCode('fr')}
          >
            FR
          </Button>
        </View>
      </Flex>
      {isMobile ? (
        <Menu menuAlign='end'>

          <MenuItem as="a" href='/'>{t('home')}</MenuItem>
          <MenuItem as="a" href='/datasets'>{t('datasets')}</MenuItem>
          <MenuItem as="a" href='/insights'>{t('insights')}</MenuItem>
          <MenuItem as="a" href='/about'>{t('about')}</MenuItem>
          <MenuItem as="a" href='/contact'>{t('contact')}</MenuItem>

        </Menu>
      ) : (
        <Flex
          className={styles.navigation}
          gap='48px'
          direction='row'
          justifyContent='flex-start'
          alignItems='flex-start'
          position='relative'
        >
          <Link href='/'>{t('home')}</Link>
          <Link href='/datasets'>{t('datasets')}</Link>
          <Link href='/insights'>{t('insights')}</Link>
          <Link href='/about'>{t('about')}</Link>
          <Link href='/contact'>{t('contact')}</Link>
        </Flex>
      )}
    </Flex>
  );
};

export default NavBar;