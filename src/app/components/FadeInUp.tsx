import { motion, useInView } from 'framer-motion';
import React, { ReactNode, useRef } from 'react';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  threshold?: number; // How much of the component should be visible to trigger animation
}

const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = 0,
  x = 0,
  y = 0,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold }); // 'amount' replaces 'threshold'

  const easing = [0.42, 0, 0.58, 1];
  const yOffset = 24;
  const transition = {
    duration: 0.8,
    delay,
    ease: easing,
  };

  const variants = {
    hidden: { y: yOffset, opacity: 0, transition },
    show: {
      y,
      x,
      opacity: 1,
      transition,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'show' : 'hidden'}
      exit='hidden'
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;
