'use client';

import Container from '@/app/components/Background';
import IndexHeatmap from '@/app/components/dataviz/IndexHeatmap';
import CustomMap from '@/app/components/dataviz/Map';
import Tooltip from '@/app/components/dataviz/TooltipChart';
import { useDimensions } from '@/hooks/useDimensions';
import { Button, Heading, Text, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import Link from 'next/link';
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
          <Text marginBottom='xl'>
            Youthful Cities is thrilled to announce the launch of “Urban Work
            Index 2024: The best city for youth to work in Canada”, a crucial
            index designed to provide the data urgently necessary to reshape the
            workforce into one that is dynamic, engaged, and vital. The index is
            the culmination of a year of Youthful Cities investigation into what
            youth need to succeed. It’s all part of DEVlab, a project funded by
            the Government of Canada and in partnership with Tamarack Institute.
          </Text>
          <Heading level={2} color='brand.primary.60'>
            Overall Results
          </Heading>
          <Text marginBottom='xl'>
            Scroll through the list of cities to view the ranking. Learn areas
            of strength and improvement for each city. Click on any dot on the
            map to jump to that city.
          </Text>
          <CustomMap
            width={width}
            mapStyle='mapbox://styles/youthfulcities/cm1qlm8y0006o01pb18e49tf9'
            dataset='uwi-2024'
          />
          <Heading level={2} color='brand.primary.60' marginTop='xl'>
            Results by Topic
          </Heading>
          <Text marginBottom='xl'>
            Hover over any cell to see the ranking and score for the selected
            city and topic. Click on a column to sort the ranking by that topic.
          </Text>
          <Heading level={5} color='brand.primary.60'>
            A note on scoring
          </Heading>
          <Text>
            Scores are generated using min/max normalization where the top
            performing city receives a score of 100 and the lowest performing
            city receives a score of 0. This means even a city with a score of
            100 still has room to improve, and a city with a score of 0 may
            still perform well in some aspects of the topic.
          </Text>
          <IndexHeatmap
            activeFile='heatmap_unpivot.csv'
            width={width}
            setTooltipState={setTooltipState}
          />
          <Heading level={2} color='brand.primary.60' marginTop='xl'>
            Dig Deeper
          </Heading>
          <Heading level={3} color='brand.primary.60'>
            Chatbot
          </Heading>
          <Text>
            Try the following prompts to get deeper insight into the ecosystem
            of work in Toronto, Montréal, Calgary, and Vancouver, or come up
            with your own.
          </Text>
          <ul>
            <li>
              <Text>
                <em>
                  What do youth in Montréal say about their work/life balance?
                </em>
              </Text>
            </li>
            <li>
              <Text>
                <em>
                  Assume the role a young person in Vancouver, what are some of
                  the barriers to finding a good entry-level role?
                </em>
              </Text>
            </li>
            <li>
              <Text>
                <em>
                  How do challenges around affordability impact the job search
                  of youth in Toronto?
                </em>
              </Text>
            </li>
          </ul>
          <Link href='/chatbot' target='_blank'>
            <Button variation='primary' marginTop='small' marginBottom='xl'>
              Go to chatbot
            </Button>
          </Link>
          <Heading level={3} color='brand.primary.60'>
            Data Stories
          </Heading>
          <Text>
            The 'Skills and Ladders' series on the Youthful Cities blog explores
            our findings from the DEVlab research project.
          </Text>
          <a
            href='https://www.youthfulcities.com/blog/tag/devlab/'
            target='_blank'
          >
            <Button variation='primary' marginTop='small'>
              Go to Youthful Cities blog
            </Button>
          </a>
        </div>
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
