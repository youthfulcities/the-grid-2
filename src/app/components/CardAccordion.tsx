import { Button, Heading } from "@aws-amplify/ui-react";
import { getInitColorSchemeScript } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";

interface ColorGetter {
  (index: number): { button: string; buttonInverse: string };
}

interface AccordionProps {
  children: ReactNode;
  parentWidth: number;
  parentHeight: number;

  index: number;
  getColor: ColorGetter;
}

const AccordionContent = styled(motion.div) <{
  $width: number;
  $height: number;
  $background: string;
  $inverse: string;

}>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${({ $height }) => $height}px;
  background-color: ${({ $background }) => $background};
  z-index: 2;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const CustomizeButton = styled(Button) <{
  $background: string;
  $inverse: string;
}>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: var(--amplify-colors.neutral.100.value);
  font-size: 24px;
  line-height: 1;
  transition: width 0.3s ease; /* Smooth transition for width */
  background-color: ${({ $inverse }) => $inverse};

  &:hover {
    
    background-color: ${({ $inverse }) => $inverse};
    color: black;
  }

  &:focus {
    outline: none; 
    box-shadow: none;
    background-color: ${({ $background }) => $background};
    color: black;
  }


  
   
`;

const PlusSignWrapper = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none; /* Prevent interaction, allowing button clicks */
`;

// New DetailsText component for the "Details" text on hover
const DetailsText = styled.span`
  opacity: 0;
  transform: translateY(10px); /* Start slightly lower */
  transition: opacity 1s ease, transform 0.3s ease; /* Smooth transition */
  color: black;
  position: absolute;
  bottom: 5px;
  right: 100px;
  font-size: 20px;
  pointer-events: none; /* Prevent interaction */
`;





const Accordion: React.FC<AccordionProps> = ({
  getColor,
  index,
  children,
  parentWidth,
  parentHeight,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAccordionClick = (num: number) => {
    setOpenIndex(openIndex === num ? null : num);
  };

  return (
    <div>
      <AnimatePresence>
        {openIndex === 0 && (
          <AccordionContent
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: parentHeight - 150, width: parentWidth, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: [0.0, 0.0, 0.0, 0.0] }}
            $width={parentWidth || 300}
            $height={parentHeight}
            $background={getColor(index).button}
            $inverse={getColor(index).buttonInverse}
          >
            {children}
          </AccordionContent>
        )}
      </AnimatePresence>

      <CustomizeButton
        onClick={() => handleAccordionClick(0)}
        $background={getColor(index).button}
        $inverse={getColor(index).button}
      >
        <PlusSignWrapper>+</PlusSignWrapper>
        <DetailsText>Details</DetailsText>
      </CustomizeButton>
    </div>
  );
};

export default Accordion;