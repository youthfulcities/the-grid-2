import { Button, Heading, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6';
import styled from 'styled-components';

interface AccordionProps {
  title: string;
  children: ReactNode;
  open?: number | null | undefined;
  border?: boolean;
  padding?: boolean;
  setOpen?: () => void;
}

const AccordionContent = styled(motion.div)<{
  isAnimating: boolean;
  border: boolean;
  padding: boolean;
}>`
  overflow: hidden;
  padding: 0 var(--amplify-space-large);
  ${(props) =>
    props.border &&
    `
  border-width: var(--amplify-border-widths-small);
  border-color: var(--amplify-colors-brand-primary-60);
  border-style: solid;
  border-top: 0;`}
`;

const CustomizeButton = styled(Button)<{ border: boolean }>`
  margin-block-start: 0 !important;
  box-sizing: border-box;
  color: var(--amplify-colors-font-primary);
  width: 100%;
  justify-content: flex-start;
  &:hover {
    background-color: transparent;
  }
  &:focus {
    background-color: transparent;
  }
  ${(props) => !props.border && `border: none`}
`;

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  open = null,
  setOpen,
  border = true,
  padding = true,
}) => {
  //allow open to be controlled if greater than -1
  const [openIndex, setOpenIndex] = useState<number | null>(open ?? null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleAccordionClick = (index: number) => {
    if (setOpen) {
      setOpen();
    } else setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View className='soft-shadow'>
      <CustomizeButton
        onClick={() => handleAccordionClick(0)}
        marginTop='xl'
        border={border}
      >
        {openIndex === 0 ? <FaChevronDown /> : <FaChevronRight />}
        <Heading
          level={5}
          marginLeft='xs'
          marginBottom='0'
          color='font.primary'
        >
          {title}
        </Heading>
      </CustomizeButton>
      <AnimatePresence>
        {(open ?? openIndex) === 0 && (
          <AccordionContent
            padding={padding}
            border={border}
            key='content'
            initial={{
              height: 0,
              opacity: 1,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 1,
            }}
            transition={{
              height: { duration: 0.5, ease: 'easeInOut' },
            }}
            isAnimating={isAnimating}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            {children}
          </AccordionContent>
        )}
      </AnimatePresence>
    </View>
  );
};

export default Accordion;
