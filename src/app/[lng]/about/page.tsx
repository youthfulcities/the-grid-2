'use client';

import { Card, Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface CardData {
  title: string;
  description: string;
}

const cardData: CardData[] = [
  {
    title: 'Usability',
    description:
      'Users have access to data that is easy to navigate and clear to understand. It has multiple options for analyzing the data and downloading various formats.',
  },
  {
    title: 'Accessible',
    description:
      'An open source platform where users can access data in English and French without sharing personal information and that is compatible with desktop and mobile devices.',
  },
  {
    title: 'Transparent',
    description:
      'Clear explanation of who collected the data and what the process was. It also clearly states the updates made, funding sources, references, potential conflicts of interest, and limitations.',
  },
  {
    title: 'Reflexive',
    description:
      'Provides space for users to learn and teach through access to resources on site navigation. THE GRID will support users in learning how to use and analyze the data.',
  },
  {
    title: 'Tells a Story',
    description:
      'Through storytelling, THE GRID empowers users to better understand their circumstances, drawing comparisons and exploring differences to others within their city and across other cities. The data communicates the experiences of youth respectfully and proactively.',
  },
];

const About = () => (
  <View className='container' padding='small'>
    <Flex direction='column'>
      <Heading level={2} className='padding'>
        What is THE GRID?
      </Heading>
      <Text variation='primary'>
        THE GRID is a free, open-source, intuitive portal with accessible and
        reliable data that can be used by young people, communities, planners,
        organizations, governments, and more. It is powered by{' '}
        <a href='https://youthfulcities.com/'>Youthful Cities</a>. For more
        about THE GRID and open data, visit the{' '}
        <Link href='/pages/faq'>FAQ section</Link> or{' '}
        <Link href='/pages/contact'>contact us</Link>.
      </Text>
      <Heading level={2} className='padding'>
        How Did THE GRID Begin?
      </Heading>
      <Text variation='primary'>
        THE GRID, formerly known as Pivot Hub, started with the Pivot 2020
        project. It addressed the crisis of youth unemployment during COVID-19,
        focusing on empowering young people in Canadian cities.
      </Text>
      <Heading level={2} className='padding'>
        THE GRID Design Principles
      </Heading>
      <Flex
        direction='column'
        gap='1rem'
        className='cards-container'
        alignItems='stretch'
      >
        {cardData.map((card) => (
          <Card
            key={uuidv4()}
            variation='elevated'
            className='card soft-shadow'
          >
            <Heading level={4} className='card-text'>
              {card.title}
            </Heading>
            <Text className='card-small-text'>{card.description}</Text>
          </Card>
        ))}
      </Flex>
      <Heading level={2} className='padding'>
        Land Acknowledgements
      </Heading>
      <Text variation='primary'>
        THE GRID acknowledges the traditional territories across Canada where
        its operations and research are conducted, emphasizing respect and
        gratitude to the Indigenous Peoples.
      </Text>
      <Heading level={2} className='padding'>
        Equity, Diversity, and Inclusion in Open Data
      </Heading>
      <iframe
        className='video-container col-md-12'
        width='100%'
        height='315'
        src='https://www.youtube.com/embed/MtD7NgvhIh0'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
      <View className='padding'>
        <Heading level={2}>Partners & Funding</Heading>
        <Flex
          direction='row'
          wrap='wrap'
          gap='xxl'
          justifyContent='space-around'
          alignItems='center'
        >
          <img
            width='300px'
            src='/assets/theme_image/tig.avif'
            alt='Taking It Global logo'
          />
          <img
            width='300px'
            src='/assets/theme_image/CCYP.png'
            alt='Canadian Council for Youth Prosperity logo'
          />
          <img
            width='300px'
            src='/assets/theme_image/tamarack.png'
            alt='Tamarack Institute logo'
          />
          <img
            width='300px'
            src='/assets/theme_image/sfu.png'
            alt='Simon Fraser University logo'
          />
          <img
            width='300px'
            src='/assets/theme_image/gov.png'
            alt='Government of Canada logo'
          />
          <img
            width='300px'
            src='/assets/theme_image/RBC_FL.png'
            alt='RBC Future Launch logo'
          />
        </Flex>
      </View>
    </Flex>
  </View>
);

export default About;
