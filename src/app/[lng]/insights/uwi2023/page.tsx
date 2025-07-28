'use client';

import Container from '@/app/components/Background';
import CustomMap from '@/app/components/dataviz/Map';
import useTranslation from '@/app/i18n/client';
import uwi2023 from '@/data/uwi-2023.json';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, View } from '@aws-amplify/ui-react';
import { FeatureCollection } from 'geojson';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'uwi2024');
  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1}>
          <Trans
            t={t}
            i18nKey='title_2023'
            components={{ span: <span className='highlight' /> }}
          />
        </Heading>
        <div className='inner-container'>
          <Heading level={3} color='font.primary' marginBottom='xl'>
            {t('subtitle')}
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
