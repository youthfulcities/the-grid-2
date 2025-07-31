import formatNumber from '@/utils/formatNumber';
import { Heading } from '@aws-amplify/ui-react';
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface AnimatedAmountProps {
  amount: number;
  color?: string;
}

const AnimatedAmount: React.FC<AnimatedAmountProps> = ({
  amount,
  color = 'red.60',
}) => {
  const { lng } = useParams<{ lng: string }>();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-10% 0px' }); // optional: be more sensitive

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  const [displayValue, setDisplayValue] = useState(0);

  // Update state when motion value changes
  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      setDisplayValue(v);
    });
    return () => unsubscribe();
  }, [rounded]);

  // Animate in and out
  useEffect(() => {
    const controls = animate(motionValue, isInView ? amount : 0, {
      duration: 1.5,
      ease: [0.17, 0.67, 0.83, 0.67],
    });

    return () => controls.stop();
  }, [isInView, amount]);

  return (
    <Heading
      ref={ref}
      level={2}
      textAlign='center'
      fontSize='xxxxl'
      color={color}
    >
      {formatNumber(displayValue, lng)}
    </Heading>
  );
};

export default AnimatedAmount;
