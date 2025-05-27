import AnimatedAmount from '@/app/components/AnimatedAmount';
import FadeInUp from '@/app/components/FadeInUp';
import { Button, Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaBan, FaPerson } from 'react-icons/fa6';
import styled from 'styled-components';
import { RentData } from '../types/RentTypes';
import getCityTotal from '../utils/getCityTotal';
import AvatarSvg from './AvatarSvg';
import HousingComparison from './HousingComparison';

type CityData = {
  city: string;
  [key: string]: number | string;
};

interface HousingJourneyProps {
  rent: RentData;
  loading?: boolean;
  activeCity: string | null;
  income: number;
  processedData: CityData[];
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
  color: var(--amplify-colors-font-primary);
`;

const Ban = styled(motion(FaBan))`
  width: 100%;
  height: 100%;
  margin: 0 -30px;
  color: var(--amplify-colors-font-primary);
`;

const MotionImg = motion(Image);

const iconVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scaleY: 0, scale: 0 },
};

const getAverageRents = (data: RentData): Record<number, number> => {
  const grouped = data.reduce(
    (acc, { bedrooms }) => {
      Object.entries(bedrooms).forEach(([bedroom, rent]) => {
        const key = Number(bedroom);
        acc[key] = acc[key] || [];
        acc[key].push(rent);
      });
      return acc;
    },
    {} as Record<number, number[]>
  );

  return Object.fromEntries(
    Object.entries(grouped).map(([bedroom, rents]) => {
      const avg = rents.reduce((sum, r) => sum + r, 0) / rents.length;
      return [Number(bedroom), Math.round(avg)];
    })
  );
};

const getRentForBedroom = (
  data: RentData,
  cityName: string | null,
  bedroomCount: number
): number | undefined => {
  const averages = getAverageRents(data);
  if (!data.length) return averages[bedroomCount];

  if (cityName) {
    const city = data.find(
      (d) => d.city.trim().toLowerCase() === cityName.trim().toLowerCase()
    );
    if (
      city &&
      city.bedrooms[bedroomCount as keyof typeof city.bedrooms] !== undefined
    ) {
      return city.bedrooms[bedroomCount as keyof typeof city.bedrooms];
    }
  }

  return averages[bedroomCount];
};

const rentToDaysOfWork = (rent: number, income: number) => {
  if (!income || income <= 0) return 0;

  const daysInMonth = 30;
  const dailyIncome = income / daysInMonth;
  return rent / dailyIncome;
};

const HousingJourney: React.FC<HousingJourneyProps> = ({
  rent,
  loading,
  activeCity,
  income,
  processedData,
}) => {
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [count, setCount] = useState<number>(bedrooms ?? 0);
  const min = 0;
  const max = 4;

  useEffect(() => {
    setCount(Math.max((bedrooms ?? 0) - 1, 0));
  }, [bedrooms]);

  const updateCount = (newCount: number) => {
    if (newCount >= min && newCount <= max) {
      setCount(newCount);
    }
  };
  const getRentDiffs = (
    data: RentData,
    cityName: string | null
  ): Record<number, number> | undefined => {
    if (!data.length) return;

    let rents: Record<number, number | undefined>;

    if (cityName) {
      const city = data.find(
        (d) => d.city.trim().toLowerCase() === cityName.trim().toLowerCase()
      );
      if (city) {
        rents = city.bedrooms;
      } else {
        console.warn(`City "${cityName}" not found — using average rents.`);
        rents = getAverageRents(data);
      }
    } else {
      rents = getAverageRents(data);
    }

    const studio = rents[0] ?? rents[1];
    if (studio === undefined) return;

    return Object.fromEntries(
      Object.entries(rents).map(([bedroom, currentRent]) => [
        Number(bedroom),
        Number((((currentRent ?? 0 - studio) / studio) * 100).toFixed(1)),
      ])
    );
  };

  const rentDiffs = getRentDiffs(rent, activeCity);
  const activeRent = getRentForBedroom(rent, activeCity, bedrooms ?? 0);
  const activeCityTotal = getCityTotal(activeCity, processedData);

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
        <Flex
          wrap='wrap'
          justifyContent='center'
          alignItems='start'
          marginBottom='xxxl'
        >
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              onClick={() => setBedrooms(0)}
              variation='primary'
              colorTheme='overlay'
              disabled={rentDiffs ? rentDiffs[0] === undefined : false}
              whileHover='hover'
              initial='initial'
              animate='initial'
              backgroundColor={bedrooms === 0 ? 'blue.80' : ''}
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
              onClick={() => setBedrooms(1)}
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
              backgroundColor={bedrooms === 1 ? 'blue.80' : ''}
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
              +{rentDiffs[1]}%
            </Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              onClick={() => setBedrooms(2)}
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
              backgroundColor={bedrooms === 2 ? 'blue.80' : ''}
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
              +{rentDiffs[2]}%
            </Text>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <ImgButton
              onClick={() => setBedrooms(3)}
              variation='primary'
              colorTheme='overlay'
              whileHover='hover'
              initial='initial'
              animate='initial'
              backgroundColor={bedrooms === 3 ? 'blue.80' : ''}
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
              +{rentDiffs[3]}%
            </Text>
          </Flex>
        </Flex>
        <Text textAlign='center'>
          Now, what area of the city are you looking for?
        </Text>
        <Flex justifyContent='center' alignItems='start' marginBottom='xxxl'>
          <Flex direction='column' justifyContent='center'>
            <SvgButton
              onClick={() => setLocation('outer')}
              variation='primary'
              colorTheme='overlay'
              backgroundColor={location === 'outer' ? 'blue.80' : ''}
            >
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
            <SvgButton
              onClick={() => setLocation('inner')}
              variation='primary'
              colorTheme='overlay'
              backgroundColor={location === 'inner' ? 'blue.80' : ''}
            >
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
              +30%
            </Text>
          </Flex>
        </Flex>
        <Text textAlign='center'>The current appartment would cost you...</Text>
        <Flex justifyContent='center'>
          <AnimatedAmount before='$' amount={activeRent ?? 0} />
          {count > 0 && (
            <>
              <Heading
                level={2}
                textAlign='center'
                fontSize='xxxxl'
                color='font.primary'
              >
                {' '}
                / {count + 1} =
              </Heading>
              <AnimatedAmount
                before='$'
                amount={(activeRent ?? 0) / (count + 1)}
                color='yellow.60'
              />
            </>
          )}
        </Flex>
        <Text textAlign='center'>
          How many roommates do you want to split the cost with?
        </Text>
        <Flex width='100%' justifyContent='space-between' marginBottom='xxxl'>
          <Button
            fontSize='xxxl'
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
                    color: 'var(--amplify-colors-font-primary)',
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
                      color: 'var(--amplify-colors-font-primary)',
                    }}
                  >
                    <Person key={i} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </Flex>
          <Button
            fontSize='xxxl'
            variation='link'
            isDisabled={count >= max}
            onClick={() => updateCount(count + 1)}
          >
            +
          </Button>
        </Flex>
        <Text textAlign='center'>
          {activeCity ? `In ${activeCity}` : 'On average'}, it will take you{' '}
          {rentToDaysOfWork(activeCityTotal ?? 0, income).toFixed(0)} days* to
          save up move out and{' '}
          {rentToDaysOfWork((activeRent ?? 0) / (count + 1), income).toFixed(0)}{' '}
          days to work to pay your rent each month.
        </Text>
        <Text fontSize='small'>
          *if you save 100% of your income and work full-time.
        </Text>
        <HousingComparison rent={rent} />
      </Flex>
    )
  );
};

export default HousingJourney;
