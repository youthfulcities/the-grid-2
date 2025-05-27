'use client';

import { Flex, Text } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components'; // Import styled-components

// Create a styled button with hover effect
const DismissButton = styled.button`
  font-family: 'Gotham Narrow Medium';
  font-size: 16px;
  font-weight: 450;
  color: var(--amplify-colors-font-primary);
  background-color: var(--amplify-colors-brand-primary-60);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: absolute;
  right: 13.7%;
  top: 50%;
  transform: translateY(-50%);
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  text-transform: uppercase;
  display: inline-block;
  overflow: hidden;

  &:hover {
    background-color: var(--amplify-colors-brand-primary-70);
    transform: translateY(-55%);
  }

  // Hover effect for the underline
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

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  &:focus {
    outline: none;
  }

  // Responsive styles for smaller screens
  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
    transform: none;
    font-size: 14px;
    padding: 0.4rem 0.8rem;

    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0.3rem 0.6rem;
  }
`;

// Main Flex container that holds the text and button
const BannerContainer = styled(Flex)`
  background-color: var(--amplify-colors-brand-primary-60);
  padding: 1rem 2rem;
  color: white;
  position: relative;
  width: 100%;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Text container to move independently
const TextContainer = styled(Flex)`
  flex-grow: 1;
  justify-content: center;
  text-align: center;
`;

// Styled text with responsive adjustments
const StyledText = styled(Text)`
  font-size: 1rem;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
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
    <BannerContainer>
      {/* Independent TextContainer */}
      <TextContainer>
        <StyledText>
          Youth Data Lab is still in the early stages of development.{' '}
          <a
            href='https://www.surveymonkey.com/r/2VDFCKM'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: 'white', textDecoration: 'underline' }}
          >
            Your feedback is appreciated!
          </a>
        </StyledText>
      </TextContainer>

      {/* Positioned button */}
      <DismissButton onClick={handleDismiss}>Dismiss</DismissButton>
    </BannerContainer>
  );
};

export default Banner;
