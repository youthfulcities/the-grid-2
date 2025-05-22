import FadeInUp from '@/app/components/FadeInUp';
import { Button, Flex, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaBan, FaPerson } from 'react-icons/fa6';
import styled from 'styled-components';
import { RentData } from '../types/RentTypes';
import AvatarSvg from './AvatarSvg';

interface HousingJourneyProps {
  rent: RentData;
  loading?: boolean;
  activeCity: string | null;
}

const ImgButton = styled(motion(Button))`
  justify-content: center;
  overflow: hidden;
  border-radius: 100%;
  padding: var(--amplify-space-large);
  img {
    margin: auto;
    width: 100%;
    height: 100%;
  }
`;

const SvgButton = styled(Button)`
  justify-content: center;
  overflow: hidden;
  border-radius: 100%;
  padding: 0;
  img {
    margin: auto;
    width: 100%;
    height: 100%;
  }
`;

const SvgContainer = styled(motion(View))`
  position: relative;
  width: calc(120px + var(--amplify-space-large) * 2);
  height: calc(120px + var(--amplify-space-large) * 2);
  overflow: hidden;
`;

const SvgImage = styled(motion(Image))`
  border-radius: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Person = styled(motion(FaPerson))`
  width: 100%;
  height: 100%;
  margin: 0 -30px;
  color: var(--amplify-colors-font-inverse);
`;

const Ban = styled(motion(FaBan))`
  width: 100%;
  height: 100%;
  margin: 0 -30px;
  color: var(--amplify-colors-font-inverse);
`;

const MotionImg = motion(Image);

const iconVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scaleY: 0, scale: 0 },
};

const HousingJourney: React.FC<HousingJourneyProps> = ({
  rent,
  loading,
  activeCity,
}) => {
  const [bedrooms, setBedrooms] = useState(1);
  const [count, setCount] = useState(bedrooms);
  const min = 0;
  const max = 4;
  const updateCount = (newCount: number) => {
    if (newCount >= min && newCount <= max) {
      setCount(newCount);
    }
  };
  const getRentDiffs = (data: RentData, cityName: string | null) => {
    if (loading || !data.length) return;
    if (cityName) {
      const city = data.find(
        (d) => d.city.toLowerCase() === cityName.toLowerCase()
      );
      if (!city) throw new Error(`City "${cityName}" not found in dataset`);

      const studioRent = city.bedrooms[0] ?? city.bedrooms[1];
      if (studioRent === undefined)
        throw new Error(`Studio or 1-bedroom rent missing for "${cityName}"`);

      return Object.fromEntries(
        Object.entries(city.bedrooms).map(([bedroom, currentRent]) => [
          Number(bedroom),
          Number((currentRent - studioRent).toFixed(2)),
        ])
      );
    }

    // Compute average rent per bedroom across all cities
    const bedroomEntries = data.flatMap((d) =>
      Object.entries(d.bedrooms).map(([bedroom, currentRent]) => ({
        bedroom: Number(bedroom),
        currentRent,
      }))
    );

    const grouped = bedroomEntries.reduce(
      (acc, { bedroom, currentRent }) => {
        acc[bedroom] = acc[bedroom] || [];
        acc[bedroom].push(currentRent);
        return acc;
      },
      {} as Record<number, number[]>
    );

    const averages = Object.fromEntries(
      Object.entries(grouped).map(([bedroom, rents]) => {
        const avg = rents.reduce((sum, r) => sum + r, 0) / rents.length;
        return [Number(bedroom), avg];
      })
    );

    const studioAvg = averages[0] ?? averages[1];
    if (studioAvg === undefined)
      throw new Error('No studio or 1-bedroom rent average found');

    return Object.fromEntries(
      Object.entries(averages).map(([bedroom, avgRent]) => [
        Number(bedroom),
        Number((avgRent - studioAvg).toFixed(2)),
      ])
    );
  };

  const rentDiffs = getRentDiffs(rent, activeCity);

  return (
    !loading &&
    rentDiffs && (
      <Flex marginTop='xxxl' direction='column' justifyContent='center'>
        <FadeInUp>
          <AvatarSvg radius={50} />
          <Text textAlign='center' marginTop='large'>
            So, you want to move out. What type of appartment are you looking
            for?
          </Text>
        </FadeInUp>
        <Flex wrap='wrap' justifyContent='center' alignItems='start'>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              variation='primary'
              colorTheme='overlay'
              disabled={rentDiffs ? rentDiffs[0] === undefined : false}
              whileHover='hover'
              initial='initial'
              animate='initial'
            >
              <MotionImg
                alt='Studio bedroom apartment floorplan'
                src='/assets/theme_image/0-bedroom.png'
                width={120}
                height={120}
                style={{ transformOrigin: 'top left' }}
                variants={{
                  initial: { opacity: 1, scale: 1 },
                  hover: { opacity: 1, scale: 1.2 },
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </ImgButton>
            <Text textAlign='center'>Studio</Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
            >
              <MotionImg
                alt='One bedroom apartment floorplan'
                src='/assets/theme_image/1-bedroom.png'
                width={120}
                height={120}
                style={{ transformOrigin: 'top center' }}
                variants={{
                  initial: { opacity: 1, scale: 1 },
                  hover: { opacity: 1, scale: 1.2 },
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </ImgButton>
            <Text marginBottom='0' textAlign='center'>
              1 Bedroom
            </Text>
            <Text
              textAlign='center'
              fontWeight='bold'
              fontSize='large'
              color='red.60'
            >
              +${rentDiffs[1]}
            </Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
            >
              <MotionImg
                alt='Two bedroom apartment floorplan'
                src='/assets/theme_image/2-bedroom.png'
                width={120}
                height={120}
                style={{ transformOrigin: 'top right' }}
                variants={{
                  initial: { opacity: 1, scale: 1 },
                  hover: { opacity: 1, scale: 1.1 },
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </ImgButton>
            <Text textAlign='center' marginBottom='0'>
              2 Bedrooms
            </Text>
            <Text
              textAlign='center'
              fontWeight='bold'
              fontSize='large'
              color='red.60'
            >
              +${rentDiffs[2]}
            </Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
            >
              <MotionImg
                alt='Studio bedroom apartment floorplan'
                src='/assets/theme_image/3-bedroom.png'
                width={120}
                height={120}
                variants={{
                  initial: { opacity: 1, scale: 1 },
                  hover: { opacity: 1, scale: 1.1 },
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </ImgButton>
            <Text textAlign='center' marginBottom='0'>
              3 Bedrooms
            </Text>
            <Text
              textAlign='center'
              fontWeight='bold'
              fontSize='large'
              color='red.60'
            >
              +${rentDiffs[3]}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent='center' alignItems='start'>
          <Flex direction='column' justifyContent='center'>
            <SvgButton variation='primary' colorTheme='overlay'>
              <SvgContainer
                whileHover='hover'
                initial='initial'
                animate='initial'
              >
                <SvgImage
                  alt='Outer city streetmap'
                  src='/assets/theme_image/outer.svg'
                  width={120}
                  height={120}
                  variants={{
                    initial: { opacity: 1, scale: 1 },
                    hover: { opacity: 1, scale: 1.4 },
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </SvgContainer>
            </SvgButton>
            <Text textAlign='center' marginBottom='0'>
              Outer City
            </Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <SvgButton variation='primary' colorTheme='overlay'>
              <SvgContainer
                whileHover='hover'
                initial='initial'
                animate='initial'
              >
                <SvgImage
                  alt='Inner city streetmap'
                  src='/assets/theme_image/inner.svg'
                  width={120}
                  height={120}
                  variants={{
                    initial: { opacity: 1, scale: 1 },
                    hover: { opacity: 1, scale: 1.5 },
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </SvgContainer>
            </SvgButton>
            <Text textAlign='center' marginBottom='0'>
              Inner City
            </Text>
            <Text
              textAlign='center'
              fontWeight='bold'
              fontSize='large'
              color='red.60'
            >
              +$500
            </Text>
          </Flex>
        </Flex>
        <Flex width='100%' justifyContent='space-between'>
          <Button
            variation='link'
            isDisabled={count <= min}
            onClick={() => updateCount(count - 1)}
          >
            –
          </Button>
          <Flex>
            <AnimatePresence mode='popLayout'>
              {count === 0 ? (
                <motion.div
                  key='ban'
                  variants={iconVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    height: '150px',
                    width: '150px',
                    margin: '0 -30px',
                    color: 'var(--amplify-colors-font-inverse)',
                  }}
                >
                  <Ban />
                </motion.div>
              ) : (
                Array.from({ length: count }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={iconVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      height: '150px',
                      width: '150px',
                      margin: '0 -30px',
                      color: 'var(--amplify-colors-font-inverse)',
                    }}
                  >
                    <Person key={i} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </Flex>
          <Button
            variation='link'
            isDisabled={count >= max}
            onClick={() => updateCount(count + 1)}
          >
            +
          </Button>
        </Flex>
      </Flex>
    )
  );
};

export default HousingJourney;
