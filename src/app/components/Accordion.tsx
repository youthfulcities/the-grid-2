import { Button, Heading } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const AccordionContent = styled(motion.div)`
  overflow: hidden;
  padding: var(--amplify-space-large);
  border-width: var(--amplify-border-widths-small);
  border-color: var(--amplify-colors-brand-primary-60);
  border-style: solid;
  border-top: 0;
`;

const CustomizeButton = styled(Button)`
  box-sizing: border-box;
  width: 100%;
  &:hover {
    background-color: transparent;
  }
  &:focus {
    background-color: transparent;
  }
`;

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <CustomizeButton onClick={() => handleAccordionClick(0)} marginTop='xl'>
        <Heading level={5} marginBottom='0' color='font.inverse'>
          {title}
        </Heading>
      </CustomizeButton>
      <AnimatePresence>
        {openIndex === 0 && (
          <AccordionContent
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.3, ease: 'easeInOut' },
            }}
          >
            {children}
          </AccordionContent>
        )}
      </AnimatePresence>
    </>
  );
};

export default Accordion;
