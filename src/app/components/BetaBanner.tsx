'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // Import styled-components
import { Flex, Text } from '@aws-amplify/ui-react';

// Create a styled button with hover effect
const DismissButton = styled.button`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: var(--amplify-colors-font-inverse);
  background-color: var(--amplify-colors-brand-primary-60);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 5px;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    background-color: var(--amplify-colors-brand-primary-70);
    transform: translateY(-2px); // Slight lift effect on hover
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  &:focus {
    outline: none;
  }

  // Responsive styles
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.4rem 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0.3rem 0.6rem;
  }
`;

const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  background-color: var(--amplify-colors-brand-primary-60);
  padding: 1rem 2rem;
  color: white;
  position: relative;
  width: 100%;
  z-index: 1000; // Ensure the banner is above other elements

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    padding: 0.8rem;
    text-align: center;
  }
`;

const StyledText = styled(Text)`
  position: relative;
  font-size: 1rem;
  text-align: center;
  flex: 1;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 10px; // Adjust space between text and button on smaller screens
  }
`;

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage to see if the banner has been dismissed
    const bannerDismissed = sessionStorage.getItem('bannerDismissed');
    if (bannerDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bannerDismissed', 'true'); // Save dismissal state
  };

  if (!isVisible) {
    return null; // Don't render the banner if it's not visible
  }

  return (
    <StyledFlex>
      <StyledText>
        This is a beta version of the site. Your feedback is appreciated!
      </StyledText>
      <DismissButton onClick={handleDismiss}>Dismiss</DismissButton>
    </StyledFlex>
  );
};

export default Banner;