'use client';

import { Button, Flex, Image, View } from '@aws-amplify/ui-react';
import Link from 'next/link'; // Import Link from next/link
import { usePathname, useRouter } from 'next/navigation';
import useTranslation from '../../../i18n/client';
import styles from './navbar.module.css';

interface NavBarProps {
  lng: string;
}

const NavBar: React.FC<NavBarProps> = ({ lng }) => {
  const { t } = useTranslation(lng, 'translation');

  const pathname = usePathname();
  const router = useRouter();

  function handleLanguageChange(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const pathNoLocale = pathname.substring(3);
    const newPath = `/${locale}${pathNoLocale}`;
    router.prefetch(newPath);
    router.push(newPath, { scroll: false });
  }

  return (
    <Flex
      as='nav'
      direction='row'
      justifyContent='space-around'
      alignItems='center'
      gap='10px'
      width='100%'
      height='unset'
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
            style={{
              width: '100%',
              height: '80px',
              top: '-15.5px',
              left: '-24px',
            }}
          />
        </Link>
        <View>
          <Button
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
      <Flex
        className={styles.navigation}
        gap='48px'
        direction='row'
        justifyContent='flex-start'
        alignItems='flex-start'
        position='relative'
      >
        <Link href={`/${lng}`}>{t('home')}</Link>
        <Link href={`/${lng}/datasets`}>{t('datasets')}</Link>
        <Link href={`/${lng}/insights`}>{t('insights')}</Link>
        <Link href={`/${lng}/about`}>{t('about')}</Link>
        <Link href={`/${lng}/contact`}>{t('contact')}</Link>
      </Flex>
    </Flex>
  );
};

export default NavBar;