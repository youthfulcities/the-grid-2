import { Accordion, CheckboxField, Heading } from '@aws-amplify/ui-react';
import React from 'react';
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

const StyledAccordion = styled(Accordion.Container)`
  .amplify-accordion__item__content {
    transition: all 0.3s;
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
    <StyledAccordion marginTop='xl' marginBottom='xl'>
      <Accordion.Item>
        <Accordion.Trigger>
          <Heading level={5} marginBottom='0' color='font.inverse'>
            Customize chart
          </Heading>
        </Accordion.Trigger>
        <Accordion.Content>
          {allOptions.map((option) => (
            <StyledCheckbox
              key={option}
              name={option}
              label={option}
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
            />
          ))}
        </Accordion.Content>
      </Accordion.Item>
    </StyledAccordion>
  );
};

export default Customize;
