import { Flex, View, Text, Image } from '@aws-amplify/ui-react';
import Link from 'next/link'; // Import Link from next/link
import "../styling/navbar.css"

const NavBar = () => {
    return (
        <Flex
            as="nav"
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            gap="10px"
            width="100%"
            height="unset"
            overflow="hidden"
            position="relative"
            boxShadow="0px 2px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.15000000596046448)"
            padding="16px 32px"
            backgroundColor="rgba(251,208,101,1)"
        >
            <Link href="/">

                <Image src="/assets/theme_image/THE_GRID_logo_RGB_black.png" alt="Logo" style={{
                    width: '100%',
                    height: '80px',
                    top: '-15.5px',
                    left: '-24px',
                }} />

            </Link>
            <Flex
                className="navigation"
                gap="48px"
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                position="relative"
            >
                <Link href="/">Home</Link>
                <Link href="/about">Datasets</Link>
                <Link href="/services">Services</Link>
                <Link href="/contact">Contact</Link>
            </Flex>
        </Flex>
    );
};

export default NavBar;