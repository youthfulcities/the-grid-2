'use client';

import Container from '@/app/components/Background';
import CustomMap from '@/app/components/dataviz/Map';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, View } from '@aws-amplify/ui-react';
import { useRef } from 'react';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1}>
          Best City to <span className='highlight'>Work in Canada</span>
        </Heading>
        <div className='inner-container'>
          <Heading level={3} color='font.inverse' marginBottom='xl'>
            Urban Work Index 2023
          </Heading>
        </div>
        <CustomMap width={width} />
      </View>
    </Container>
  );
};

export default Index;
