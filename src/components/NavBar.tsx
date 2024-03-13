import {
    Flex,
    Text,
    View,
  } from '@aws-amplify/ui-react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <Flex as="nav"
        height="80px" 
        justifyContent="space-between" 
        alignItems="center" 
        padding="16px 32px 16px 32px"  
        boxShadow="0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448)"
        backgroundColor='brand.secondary.60'
        position="relative"
        >

            <Link href="/" passHref>
                <View as="a" className="logo">
                    <img src="/assets/theme_image/THE_GRID_logo_RGB_black.png" alt="Logo" style={{ height: '65px' }} />
                </View>
            </Link>
            <Flex justifyContent='space-between' gap='35px'>
                <Link href="/" passHref style={{ textDecoration: 'none'}}>
                    <Text as="a" className='NavList'>home</Text>
                </Link>
                <Link href="/topics" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>topics</Text>
                </Link>
                <Link href="/datasets" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>datasets</Text>
                </Link>
                <Link href="/cities" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>cities</Text>
                </Link>
                <Link href="/data-playground" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>data playground</Text>
                </Link>
                <Link href="/about" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>about</Text>
                </Link>
                <Link href="/faq" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>faq</Text>
                </Link>
                <Link href="/tutorials" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>tutorials</Text>
                </Link>
                <Link href="/contact-us" passHref style={{ textDecoration: 'none' }}>
                    <Text as="a" className='NavList'>contact us</Text>
                </Link>
            </Flex>
        </Flex>
    );
};

export default Navbar;
