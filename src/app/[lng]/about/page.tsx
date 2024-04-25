'use client';


import { Card, Heading, Text, Flex, View, Button } from '@aws-amplify/ui-react';
import Link from 'next/link';
import React from 'react';

interface CardData {
    title: string;
    description: string;
}

const cardData: CardData[] = [
    {
        title: 'Usability',
        description: 'Users have access to data that is easy to navigate and clear to understand. It has multiple options for analyzing the data and downloading various formats.'
    },
    {
        title: 'Accessible',
        description: 'An open source platform where users can access data in English and French without sharing personal information and that is compatible with desktop and mobile devices.'
    },
    {
        title: 'Transparent',
        description: 'Clear explanation of who collected the data and what the process was. It also clearly states the updates made, funding sources, references, potential conflicts of interest, and limitations.'
    },
    {
        title: 'Reflexive',
        description: 'Provides space for users to learn and teach through access to resources on site navigation. THE GRID will support users in learning how to use and analyze the data.'
    },
    {
        title: 'Tells a Story',
        description: 'Through storytelling, THE GRID empowers users to better understand their circumstances, drawing comparisons and exploring differences to others within their city and across other cities. The data communicates the experiences of youth respectfully and proactively.'
    }
];

const About = () => {
    return (
        <View className="container" padding="small">
            <Flex direction="column" alignItems="center" >

                <Heading level={2} className='padding' >What is THE GRID?</Heading>
                <Text>
                    THE GRID is a free, open-source, intuitive portal with accessible and reliable data that can be used by young people, communities, planners, organizations, governments, and more. It is powered by <a href="https://youthfulcities.com/">Youthful Cities</a>. For more about THE GRID and open data, visit the <Link href="/pages/faq">FAQ section</Link> or <Link href="/pages/contact">contact us</Link>.
                </Text>
                <Heading level={2} className='padding'>How Did THE GRID Begin?</Heading>
                <Text>
                    THE GRID, formerly known as Pivot Hub, started with the Pivot 2020 project. It addressed the crisis of youth unemployment during COVID-19, focusing on empowering young people in Canadian cities.
                </Text>
                <Heading level={2} className='padding'>THE GRID Design Principles</Heading>
                <Flex direction="column" gap="1rem" className="cards-container">
                    {cardData.map((card, index) => (
                        <Card key={index} variation="elevated" className="card soft-shadow">
                            <Heading level={4} className="card-text">{card.title}</Heading>
                            <Text className="card-small-text">{card.description}</Text>
                        </Card>
                    ))}
                </Flex>
                <Heading level={2} className="padding">Land Acknowledgements</Heading>
                <Text>
                    THE GRID acknowledges the traditional territories across Canada where its operations and research are conducted, emphasizing respect and gratitude to the Indigenous Peoples.
                </Text>
                <Heading level={2} className="padding">Equity, Diversity, and Inclusion in Open Data</Heading>
                <iframe className="video-container col-md-12"
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/MtD7NgvhIh0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <Heading level={2} className="padding">Partners & Funding</Heading>
                <Flex direction="row" wrap="wrap" gap="1rem" className="cards-container">
                    <img src="/assets/theme_image/YC_colour_black_RGB.png" alt="Youthful Cities logo" />
                    <img src="/assets/theme_image/refugee-centre-logo.png" alt="The Refugee Centre logo" />
                    <img src="/assets/theme_image/CCYP.png" alt="Canadian Council for Youth Prosperity logo" />
                    <img src="/assets/theme_image/tamarack-logo.png" alt="Tamarack Institute logo" />
                    <img src="/assets/theme_image/SFU.png" alt="Simon Fraser University logo" />
                    <img src="/assets/theme_image/Gov Canada Logo.png" alt="Government of Canada logo" />
                    <img src="/assets/theme_image/rbc-logo.svg" alt="RBC Future Launch logo" />
                    <img src="/assets/theme_image/northpine-logo.png" alt="Northpine Foundation logo" />
                </Flex>
            </Flex>
        </View>
    );
};

export default About;
