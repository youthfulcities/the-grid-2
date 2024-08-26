import { Button, Heading } from "@aws-amplify/ui-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";

interface AccordionProps {
  title: string;
  children: ReactNode;
  parentWidth: number;
  parentHeight: number;
  background: string;
  font: string;
}

const AccordionContent = styled(motion.div)<{
  $width: number;
  $height: number;
  $background: string;
  $font: string;

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

const CustomizeButton = styled(Button)<{
    $background: string;
    $font: string;
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
  font-size: 24px;
  line-height: 1;
  transition: width 0.3s ease; /* Smooth transition for width */

  &:hover {
    width: 100%; /* Expand to the full width of the card */
    background-color: ${({ $font }) => $font};
    color: white;
  }

  &:focus {
    outline: none; /* Remove the focus outline */
    background-color: ${({ $background }) => $background}; 
    color: ${({ $font }) => $font}; 
  }


  &:active {
    border: none; /* Remove any border */
    background-color: ${({ $background }) => $background}; /* Reset background color */
    color: ${({ $font }) => $font}; /* Reset text color */
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

const Accordion: React.FC<AccordionProps> = ({
  
  children,
  parentWidth,
  parentHeight,
  background,
  font,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div >
      <AnimatePresence>
        {openIndex === 0 && (
          <AccordionContent
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: parentHeight - 150, width: parentWidth, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: [0.0, 0.0, 0.0, 0.0] }}
            $width={parentWidth|| 300}
            $height={parentHeight}
            $background={background}
            $font={font}
          >
            {children}
          </AccordionContent>
        )}
      </AnimatePresence>

      <CustomizeButton onClick={() => handleAccordionClick(0)}
        $background={background}
        $font={font}
        >
        <PlusSignWrapper>+</PlusSignWrapper>
      </CustomizeButton>
    </div>
  );
};

export default Accordion;
