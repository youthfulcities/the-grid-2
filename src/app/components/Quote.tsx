'use client';

import { Flex, Text } from '@aws-amplify/ui-react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import styled from 'styled-components';

const ProfileIconContainer = styled(motion.div)<{ left: boolean }>`
  margin-top: var(--amplify-space-large);
  position: relative;
  display: flex;
  flex-direction: ${(props) => (props.left ? 'row' : 'row-reverse')};
  gap: var(--amplify-space-xs);
  height: 100%;
  width: 100%;
`;

const Icon = styled(FaUserCircle)<{ $color: string }>`
  font-size: 40px;
  color: var(--amplify-colors-${(props) => props.$color}-60);
`;

const SpeechBubble = styled(motion.div)<{ left: boolean }>`
  width: 100%;
  top: 0;
  ${(props) => (props.left ? 'left:70px' : 'right:70px')};
  transform: translateX(-50%);
  background: rgba(102, 100, 96, 0.3);
  border-radius: 8px;
  padding: var(--amplify-space-small);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

interface QuoteProps {
  left?: boolean;
  $color?: 'red' | 'green' | 'yellow' | 'pink' | 'blue' | 'neutral';
  quote: string;
  $width?: number;
}

const randomColor = () => {
  const colors = ['red', 'green', 'yellow', 'pink', 'blue'];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};
const Quote: React.FC<QuoteProps> = ({
  left = true,
  $color = randomColor(),
  quote = '',
  $width = 100,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Run the animation whenever inView changes
  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, scale: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, scale: 0, y: -20 });
    }
  }, [inView, controls]);

  return (
    <Flex
      className='quote'
      ref={ref}
      maxWidth={`${$width}%`}
      direction={left ? 'row' : 'row-reverse'}
      justifyContent='flex-start'
    >
      <ProfileIconContainer left={left}>
        <Icon $color={$color} />
        <SpeechBubble
          left={left}
          initial={{ scale: 0, opacity: 0, y: -20 }} // Start scaled down and invisible
          animate={controls}
          transition={{
            duration: 1,
            type: 'spring', // Use spring for a bouncier effect
            stiffness: 300, // Adjust stiffness for more or less bounciness
            damping: 20, // Adjust damping for a more controlled movement
          }}
        >
          <Text margin='0' fontSize='medium'>
            {quote}
          </Text>
        </SpeechBubble>
      </ProfileIconContainer>
    </Flex>
  );
};

export default Quote;
