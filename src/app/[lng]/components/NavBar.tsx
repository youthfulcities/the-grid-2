'use client'

import { Button, Flex, Menu, MenuItem, View } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useTranslation from '../../i18n/client';
import styled from 'styled-components';

interface NavBarProps {
  lng: string;
}

const StyledFlex = styled(Flex)`
  display: flex;
  flex-direction: row; 
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448);
  padding: 16px 32px;
  background-color: rgba(251,208,101,1);
`;

const NavigationLinks = styled(Flex)`
  gap: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const NavLink = styled(Link)`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: rgba(0, 0, 0, 1);
  text-transform: uppercase;
  line-height: 24px;
  text-align: left;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: black;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
    border-radius: 5px;
  }
  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const NavBar: React.FC<NavBarProps> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleLanguageChange(locale: string) {
    const pathNoLocale = pathname.substring(3);
    const newPath = `/${locale}${pathNoLocale}`;
    router.prefetch(newPath);
    router.push(newPath, { scroll: false });
  }

  return (
    <StyledFlex as='nav'>
      <Flex alignItems='center'>
        <Link href='/'>
          <img
            src='/assets/theme_image/THE_GRID_logo_RGB_black.png'
            alt='Logo'
            style={{ height: '80px' }}
          />
        </Link>
        <View style={{ marginLeft: '20px' }}>
          <Button colorTheme='overlay' border='0' width='30px' height='30px' size='small' fontWeight={lng === 'en' ? 600 : 300} onClick={() => handleLanguageChange('en')}>
            EN
          </Button>
          |
          <Button colorTheme='overlay' border='0' width='30px' height='30px' size='small' fontWeight={lng === 'fr' ? 600 : 300} onClick={() => handleLanguageChange('fr')}>
            FR
          </Button>
        </View>
      </Flex>
      {isMobile ? (
        <Menu menuAlign='end'>
          <MenuItem as='a' href={`/${lng}/`}>
            {t('home')}
          </MenuItem>
          <MenuItem as='a' href={`/${lng}/datasets`}>
            {t('datasets')}
          </MenuItem>
          <MenuItem as='a' href={`/${lng}/insights`}>
            {t('insights')}
          </MenuItem>
          <MenuItem as='a' href={`/${lng}/about`}>
            {t('about')}
          </MenuItem>
          <MenuItem as='a' href={`/${lng}/contact`}>
            {t('contact')}
          </MenuItem>
        </Menu>
      ) : (
        <NavigationLinks>
          <NavLink href={`/${lng}/`}>{t('home')}</NavLink>
          <NavLink href={`/${lng}/datasets`}>{t('datasets')}</NavLink>
          <NavLink href={`/${lng}/insights`}>{t('insights')}</NavLink>
          <NavLink href={`/${lng}/about`}>{t('about')}</NavLink>
          <NavLink href={`/${lng}/contact`}>{t('contact')}</NavLink>
        </NavigationLinks>
      )}
    </StyledFlex>
  );
};

export default NavBar;
