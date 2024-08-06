import { Button, CheckboxField, View } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styled from 'styled-components';
import Accordion from '../Accordion';

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

  return (
    <View>
      <Accordion title='Customize chart'>
        {allOptions.map((option) => (
          <StyledCheckbox
            key={option}
            name={option}
            label={option}
            checked={selectedOptions.includes(option)}
            onChange={() => toggleOption(option)}
          />
        ))}
      </Accordion>
    </View>
  );
};

export default Customize;
