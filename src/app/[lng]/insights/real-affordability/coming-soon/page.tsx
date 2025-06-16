'use client';

import Container from '@/app/components/Background';
import { Heading, Text, View } from '@aws-amplify/ui-react';
import Link from 'next/link';

const ComingSoon = () => (
  <Container>
    <View className='container padding'>
      <Heading level={1} marginBottom='large'>
        Coming Soon
      </Heading>
      <Text>
        The Real Affordability Index is launching soon! Interested in early
        access or sponsoring the index?{' '}
        <Link href='/contact'>Get in touch with Youthful Cities.</Link>
      </Text>
    </View>
  </Container>
);

export default ComingSoon;
