'use client'

import React from 'react';
import { Flex, Text, TextField, Button, View } from '@aws-amplify/ui-react';
import Link from 'next/link';
import styles from './footer.module.css';

const FooterComponent: React.FC = () => {
    return (
        <Flex className={styles.footerContainer}>
            <Flex className={styles.topSection}>
                <Flex direction="column" gap="5px">
                    <Text className={styles.newsletterText}>
                        Sign up for our newsletter
                    </Text>
                    <Text className={styles.smallText}>
                        Stay connected and up to date on new data, insights, or job postings!
                    </Text>
                </Flex>
                <Flex direction="row" gap="10px" className={styles.newsletterInputSection}>
                    <TextField
                        label="Newsletter Email"
                        width="300px"
                        isDisabled={false}
                        labelHidden={true}
                        placeholder="Your Email"
                        backgroundColor="white"
                    />
                    <Button color="white">Subscribe</Button>
                </Flex>
            </Flex>

            <Flex className={styles.linkSection}>
                <Flex className={styles.linkColumn}>
                    <Link href="/" passHref><Text className={styles.smallText}>Home</Text></Link>
                    <Link href="/about" passHref><Text className={styles.smallText}>About</Text></Link>
                    <Link href="/datasets" passHref><Text className={styles.smallText}>Datasets</Text></Link>
                    <Link href="/data-playground" passHref><Text className={styles.smallText}>Data Playground</Text></Link>
                </Flex>

                <Flex className={styles.linkColumn}>
                    <Link href="/faq" passHref ><Text className={styles.smallText}>FAQ</Text></Link>
                    <Link href="/contact" passHref><Text className={styles.smallText}>Contact Us</Text></Link>
                    <Link href="/tutorials" passHref><Text className={styles.smallText}>Tutorials</Text></Link>
                </Flex>
            </Flex>

            <Flex className={styles.logoAndRightsContainer}>
                <View>
                    <img src="/assets/theme_image/THE_GRID_logo_RGB_orange.png" alt="Your Logo" className={styles.logoImage} />
                </View>
                <Text fontSize="15px" color="white">
                    © 2023 The Grid. All rights reserved.
                </Text>
            </Flex>
        </Flex>
    );
};

export default FooterComponent;