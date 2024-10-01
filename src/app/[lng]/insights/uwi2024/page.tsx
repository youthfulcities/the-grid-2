'use client';

import Container from '@/app/components/Background';
import IndexHeatmap from '@/app/components/dataviz/IndexHeatmap';
import CustomMap from '@/app/components/dataviz/Map';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import { Heading, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { ReactNode, useRef, useState } from 'react';
import config from '../../../../amplifyconfiguration.json';

interface TooltipState {
  position: { x: number; y: number } | null;
  value?: number | null;
  topic?: string;
  content?: string;
  group?: string;
  child?: ReactNode | null;
}

Amplify.configure(config, {
  ssr: true,
});

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    position: null,
    value: null,
    content: '',
    group: '',
    topic: '',
    child: null,
  });
  return (
    <Container>
      <View className='container padding' ref={containerRef}>
        <Heading level={1}>
          Best City for Youth to
          <span className='highlight'> Work in Canada</span>
        </Heading>
        <div className='inner-container'>
          <Heading level={3} color='font.inverse' marginBottom='xl'>
            Urban Work Index 2024
          </Heading>
        </div>
        <CustomMap
          width={width}
          mapStyle='mapbox://styles/youthfulcities/cm1qlm8y0006o01pb18e49tf9'
          dataset='uwi-2024'
        />
        <IndexHeatmap
          activeFile='heatmap_unpivot.csv'
          width={width}
          setTooltipState={setTooltipState}
        />
      </View>
      {tooltipState.position && (
        <Tooltip
          x={tooltipState.position.x}
          content={tooltipState.content}
          y={tooltipState.position.y}
          group={tooltipState.group}
          child={tooltipState.child}
        />
      )}
    </Container>
  );
};

export default Index;
