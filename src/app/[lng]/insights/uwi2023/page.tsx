'use client';

import Container from '@/app/components/Background';
import CustomMap from '@/app/components/dataviz/Map';
import uwi2023 from '@/data/uwi-2023.json';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, View } from '@aws-amplify/ui-react';
import { FeatureCollection } from 'geojson';
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
          <Heading level={3} color='font.primary' marginBottom='xl'>
            Urban Work Index 2023
          </Heading>
        </div>
        <CustomMap
          geoJSON={uwi2023 as FeatureCollection}
          width={width}
          mapStyle='mapbox://styles/youthfulcities/clzrhcvrj00hf01pc44in6vrn'
          dataset='uwi-2023-overall-2'
        />
      </View>
    </Container>
  );
};

export default Index;
