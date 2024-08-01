import { CheckboxField, Heading, View } from '@aws-amplify/ui-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';

interface CustomizeProps {
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  allOptions: string[];
}

const StyledCheckbox = styled(CheckboxField)`
  margin: 10px 0;
  color: var(--amplify-colors-font-inverse);
  .amplify-text {
    margin-bottom: 0;
  }
  .amplify-checkbox__button::before {
    border-width: var(--amplify-border-widths-small);
  }
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
  padding: var(--amplify-space-small);
`;

const Customize: React.FC<CustomizeProps> = ({
  selectedOptions,
  setSelectedOptions,
  allOptions,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOption = (option: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((opt) => opt !== option)
        : [...prevSelected, option]
    );
  };

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View>
      <View>
        <View key='accordion-trigger' onClick={() => handleAccordionClick(0)}>
          <Heading level={5} marginBottom='0' color='font.inverse'>
            Customize chart
          </Heading>
        </View>
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
              style={{ display: openIndex === 0 ? 'block' : 'none' }}
              onAnimationStart={() => console.log('Animation started')}
              onAnimationComplete={() => console.log('Animation complete')}
            >
              {allOptions.map((option) => (
                <StyledCheckbox
                  key={option}
                  name={option}
                  label={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                />
              ))}
            </AccordionContent>
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};

export default Customize;
