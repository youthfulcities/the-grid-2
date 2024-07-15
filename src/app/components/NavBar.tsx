'use client';

import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  View,
  useTheme,
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import styled from 'styled-components';
import useTranslation from '../i18n/client';
import AuthLink from './AuthLink';

interface NavBarProps {
  lng: string;
}

const StyledFlex = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  color: var(--amplify-colors-font-inverse);
  padding: var(--amplify-space-xs) 0;
  position: relative;
  box-shadow: 0px 2px 6px
    rgba(
      0.05098039284348488,
      0.10196078568696976,
      0.14901961386203766,
      0.15000000596046448
    );
  background-color: var(--amplify-colors-neutral-100);
  z-index: 100;
`;

const NavigationLinks = styled(Flex)`
  gap: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const NavLink = styled(Link)<{ $currentPage: boolean }>`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: var(--amplify-colors-font-inverse);
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
    background-color: white;
    transform: ${(props) => (props.$currentPage ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
    border-radius: 5px;
  }
  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const StyledMenuButton = styled(MenuButton)`
  border-color: transparent;
  color: var(--amplify-colors-font-inverse);
  &:hover {
    background-color: var(--amplify-colors-neutral-80);
  }
  &:focus {
    background-color: var(--amplify-colors-neutral-80);
  }
  &:active {
    background-color: var(--amplify-colors-neutral-80);
    border-color: transparent;
  }
`;

const StyledMenuItem = styled(MenuItem)<{ $currentPage: boolean }>``;

const NavBar: React.FC<NavBarProps> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');
  const pathname = usePathname();
  const pathNoLocale = pathname.substring(3);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const { tokens } = useTheme();
  console.log(pathname);

  //TODO: Refactor into reusable hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleLanguageChange(locale: string) {
    const newPath = `/${locale}${pathNoLocale}`;
    router.prefetch(newPath);
    router.push(newPath, { scroll: false });
  }

  return (
    <StyledFlex as='nav'>
      <Flex justifyContent='space-between' className='short-container' alignItems='center'>
        <Flex alignItems='center'>
          <Link href='/'>
            <img
              src='/assets/theme_image/YDL_White.png'
              alt='Logo'
              height='60px'
            />
          </Link>
          <View style={{ marginLeft: '20px' }}>
            <Button
              color={tokens.colors.font.inverse}
              colorTheme='overlay'
              border='0'
              width='30px'
              height='30px'
              size='small'
              fontWeight={lng === 'en' ? 600 : 300}
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </Button>
            |
            <Button
              color={tokens.colors.font.inverse}
              colorTheme='overlay'
              border='0'
              width='30px'
              height='30px'
              size='small'
              fontWeight={lng === 'fr' ? 600 : 300}
              onClick={() => handleLanguageChange('fr')}
            >
              FR
            </Button>
          </View>
        </Flex>
        {isMobile ? (
          <Menu
            menuAlign='end'
            trigger={
              <StyledMenuButton>
                <FaBars />
              </StyledMenuButton>
            }
          >
            <MenuItem isDisabled={pathNoLocale === ''} as='a' href={`/${lng}/`}>
              {t('home')}
            </MenuItem>
            <MenuItem
              isDisabled={pathNoLocale === 'datasets'}
              as='a'
              href={`/${lng}/datasets`}
            >
              {t('datasets')}
            </MenuItem>
            <MenuItem
              isDisabled={pathNoLocale === 'insights'}
              as='a'
              href={`/${lng}/insights`}
            >
              {t('insights')}
            </MenuItem>
            {/* <MenuItem as='a' href={`/${lng}/about`}>
            {t('about')}
          </MenuItem> */}
            <MenuItem
              isDisabled={pathNoLocale === 'contact'}
              as='a'
              href={`/${lng}/contact`}
            >
              {t('contact')}
            </MenuItem>
          </Menu>
        ) : (
          <NavigationLinks>
            <NavLink $currentPage={pathNoLocale === ''} href={`/${lng}/`}>
              {t('home')}
            </NavLink>
            <NavLink
              $currentPage={pathNoLocale === '/datasets'}
              href={`/${lng}/datasets`}
            >
              {t('datasets')}
            </NavLink>
            <NavLink
              $currentPage={pathNoLocale === '/insights'}
              href={`/${lng}/insights`}
            >
              {t('insights')}
            </NavLink>
            {/* <NavLink href={`/${lng}/about`}>{t('about')}</NavLink> */}
            <NavLink
              $currentPage={pathNoLocale === '/contact'}
              href={`/${lng}/contact`}
            >
              {t('contact')}
            </NavLink>
          </NavigationLinks>
        )}
        <AuthLink />
      </Flex>
    </StyledFlex>
  );
};

export default NavBar;
