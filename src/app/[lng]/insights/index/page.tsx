'use client';

import Container from '@/app/components/Background';
import CustomMap from '@/app/components/dataviz/Map';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, View } from '@aws-amplify/ui-react';
import { useRef } from 'react';

const Index = () => {
  const containerRef = useRef();
  const { width, height } = useDimensions(containerRef);
  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1} marginBottom='xl'>
          Best City to <span className='highlight'>Work in Canada</span>
        </Heading>
        <CustomMap width={width} />
      </View>
    </Container>
  );
};

export default Index;
