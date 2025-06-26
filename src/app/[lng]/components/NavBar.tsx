'use client';

// import config from '@/amplifyconfiguration.json';
import { useThemeContext } from '@/app/context/ThemeContext';
import useTranslation from '@/app/i18n/client';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  Text,
  View,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { FaBars, FaMoon, FaRegMoon, FaRegSun, FaSun } from 'react-icons/fa6';
import styled from 'styled-components';
import AuthLink from './AuthLink';

const StyledFlex = styled(Flex)`
  display: flex;
  flex-direction: row;
  color: white;
  align-items: center;
  gap: 10px;
  padding: var(--amplify-space-xs) 0;
  position: relative;
  background-color: var(--amplify-colors-neutral-100);
  box-shadow: 0px 2px 6px
    rgba(
      0.05098039284348488,
      0.10196078568696976,
      0.14901961386203766,
      0.15000000596046448
    );
  z-index: 100;
`;

const NavigationLinks = styled(Flex)`
  color: white;
  gap: var(--amplify-space-xl);
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: inherit;
  align-items: center;
  position: relative;
`;

const NavLink = styled(Link)<{ $currentPage: boolean }>`
  font-family: 'Gotham Narrow Medium';
  color: white;
  text-align: center;
  font-size: 16px;
  border-radius: inherit;
  font-weight: 450;
  max-width: 110px;
  text-transform: uppercase;
  line-height: 24px;
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
  border-radius: inherit;
  color: white;
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

const MobileLink = styled(Link)`
  color: black;
  border-radius: inherit;
  width: 100%;
`;

const MobileMenuItem = styled(MenuItem)<{ isDisabled: boolean }>`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  text-transform: uppercase;
  line-height: 24px;
  border-radius: 0px;
  width: 100%;
  text-transform: uppercase;
  color: ${({ isDisabled }) =>
    isDisabled ? 'var(--amplify-colors-neutral-80)' : 'black'};
`;

const SmallText = styled(Text)`
  font-size: var(--amplify-font-sizes-xs);
  color: white;
  margin: 0;
`;

const NavBar = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');
  const pathname = usePathname();
  const pathNoLocale = pathname.substring(3);
  const router = useRouter();
  const ismobile = useBreakpointValue({
    base: true,
    small: true,
    medium: true,
    large: true,
    xl: false,
  });
  const { colorMode, setColorMode } = useThemeContext();

  function handleLanguageChange(locale: string) {
    const newPath = `/${locale}${pathNoLocale}`;
    router.prefetch(newPath);
    router.push(newPath, { scroll: false });
  }

  const handleModeChange = (value: 'light' | 'dark') => {
    setColorMode(value);
  };

  return (
    <StyledFlex as='nav' className='soft-shadow'>
      <Flex
        justifyContent='space-between'
        className='short-container'
        alignItems='center'
      >
        <Flex alignItems='center'>
          <Link href='/'>
            {lng === 'fr' ? (
              <img
                src='/assets/theme_image/YDL_white_fr.png'
                alt='Logo du Labo Data Jeunesse'
                height='60px'
              />
            ) : (
              <img
                src='/assets/theme_image/YDL_White.png'
                alt='Youth Data Lab Logo'
                height='60px'
              />
            )}
            <SmallText> Powered by Youthful Cities</SmallText>
          </Link>

          <View marginLeft='small' color='white'>
            <Button
              color='white'
              colorTheme='overlay'
              border='0'
              width='30px'
              height='30px'
              aria-label='English'
              size='small'
              fontWeight={lng === 'en' ? 600 : 300}
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </Button>
            |
            <Button
              color='white'
              colorTheme='overlay'
              border='0'
              width='30px'
              height='30px'
              aria-label='French'
              size='small'
              fontWeight={lng === 'fr' ? 600 : 300}
              onClick={() => handleLanguageChange('fr')}
            >
              FR
            </Button>
            <Flex gap='0' alignItems='center'>
              <Button
                color='white'
                colorTheme='overlay'
                border='0'
                size='small'
                fontSize='medium'
                aria-label='Light mode'
                margin='0'
                paddingRight='6px'
                paddingLeft='6px'
                onClick={() => handleModeChange('light')}
              >
                {colorMode === 'light' ? <FaSun /> : <FaRegSun />}
              </Button>
              |
              <Button
                color='white'
                colorTheme='overlay'
                border='0'
                size='small'
                margin='0'
                paddingRight='6px'
                aria-label='Dark mode'
                paddingLeft='6px'
                fontSize='medium'
                onClick={() => handleModeChange('dark')}
              >
                {colorMode === 'dark' ? <FaMoon /> : <FaRegMoon />}
              </Button>
            </Flex>
          </View>
        </Flex>
        {ismobile ? (
          <Menu
            borderRadius='0px'
            menuAlign='end'
            trigger={
              <StyledMenuButton>
                <FaBars />
              </StyledMenuButton>
            }
          >
            <MobileLink href='/'>
              <MobileMenuItem isDisabled={pathNoLocale === ''}>
                {t('home')}
              </MobileMenuItem>
            </MobileLink>
            <MobileLink href='/insights'>
              <MobileMenuItem isDisabled={pathNoLocale === '/insights'}>
                {t('insights')}
              </MobileMenuItem>
            </MobileLink>
            <MobileLink href='/chatbot'>
              <MobileMenuItem isDisabled={pathNoLocale === '/chatbot'}>
                {t('chatbot')}
              </MobileMenuItem>
            </MobileLink>
            <MobileLink href='/downloads'>
              <MobileMenuItem isDisabled={pathNoLocale === '/downloads'}>
                {t('datasets')}
              </MobileMenuItem>
            </MobileLink>
            <MobileLink href='/about'>
              <MobileMenuItem isDisabled={pathNoLocale === '/about'}>
                {t('about')}
              </MobileMenuItem>
            </MobileLink>
            <MobileLink href='/contact'>
              <MobileMenuItem isDisabled={pathNoLocale === '/contact'}>
                {t('contact')}
              </MobileMenuItem>
            </MobileLink>
            <MobileMenuItem isDisabled={false}>
              <AuthLink mobile />
            </MobileMenuItem>
          </Menu>
        ) : (
          <>
            <NavigationLinks>
              <NavLink $currentPage={pathNoLocale === ''} href={`/${lng}/`}>
                {t('home')}
              </NavLink>
              <NavLink
                $currentPage={pathNoLocale === '/insights'}
                href={`/${lng}/insights`}
              >
                {t('insights')}
              </NavLink>
              <NavLink
                $currentPage={pathNoLocale === '/chatbot'}
                href={`/${lng}/chatbot`}
              >
                {t('chatbot')}
              </NavLink>
              <NavLink
                $currentPage={pathNoLocale === '/downloads'}
                href={`/${lng}/downloads`}
              >
                {t('datasets')}
              </NavLink>
              <NavLink
                $currentPage={pathNoLocale === '/about'}
                href={`/${lng}/about`}
              >
                {t('about')}
              </NavLink>
              <NavLink
                $currentPage={pathNoLocale === '/contact'}
                href={`/${lng}/contact`}
              >
                {t('contact')}
              </NavLink>
            </NavigationLinks>
            <AuthLink />
          </>
        )}
      </Flex>
    </StyledFlex>
  );
};

export default NavBar;
