import { CheckboxField, View } from '@aws-amplify/ui-react';
import React from 'react';
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
    margin-left: 10px;
  }
  .amplify-checkbox__button::before {
    border-width: var(--amplify-border-widths-small);
  }
`;

const Customize: React.FC<CustomizeProps> = ({
  selectedOptions,
  setSelectedOptions,
  allOptions,
}) => {
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
