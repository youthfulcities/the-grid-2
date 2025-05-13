import { Flex, Heading, Text, useBreakpointValue } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

interface NextSectionProps {
  currentEl: HTMLElement | null;
  homeInView?: boolean;
}

const MotionView = styled(motion(Flex))`
  position: relative;
  top: 79vh;
  z-index: 100;
`;
const MotionText = motion(Heading);

const NextSection: React.FC<NextSectionProps> = ({
  currentEl,
  homeInView = true,
}) => {
  const isSmallScreen = useBreakpointValue({ base: true, medium: false });

  const handleScroll = (element: HTMLElement | null) => {
    if (!element) return;
    const next =
      element.nextElementSibling ??
      element.parentElement?.parentElement?.nextElementSibling;
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {homeInView && !isSmallScreen && (
        <MotionView
          display='flex'
          justifyContent='center'
          alignItems='center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          width='100%'
        >
          <Flex direction='column' alignItems='center' gap='0.5rem'>
            <MotionText
              level={4}
              fontSize='1.25rem'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              textAlign='center'
              style={{ transform: 'translateY(20px)' }}
            >
              Start your journey
            </MotionText>

            <motion.button
              onClick={() => handleScroll(currentEl)}
              whileHover={{
                y: [0, 10, 0],
                transition: {
                  repeat: Infinity,
                  repeatDelay: 0.3,
                  duration: 0.8,
                },
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Text fontSize='5rem' lineHeight='1'>
                ↓
              </Text>
            </motion.button>
          </Flex>
        </MotionView>
      )}
    </AnimatePresence>
  );
};

export default NextSection;
