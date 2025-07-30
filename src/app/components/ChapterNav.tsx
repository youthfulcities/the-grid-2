'use client';

import { useBreakpointValue } from '@aws-amplify/ui-react';
import { faCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useTranslation from '../i18n/client';

type SectionStep = {
  title: string;
  key: string;
};

type Props = {
  currentInView: Record<string, boolean>;
  steps: SectionStep[];
  tFile?: string;
};

const NavContainer = styled.nav`
  position: fixed;
  top: 25%;
  left: 25px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
`;

const NavButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${({ active }) =>
    active
      ? 'var(--amplify-colors-secondary-60)'
      : 'var(--amplify-colors-neutral-10)'};
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;

  &:hover {
    color: var(--amplify-colors-secondary-60);
  }

  svg {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 1rem;
  background-color: var(--amplify-colors-neutral-80);
  margin: 0 0.4rem;
  align-self: flex-start;
`;

const ChapterNav: React.FC<Props> = ({ currentInView, steps, tFile }) => {
  const smallScreen = useBreakpointValue({
    base: true,
    medium: true,
    large: false,
  });
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, tFile);
  const [currentSection, setCurrentSection] = useState<number | null>(null);

  useEffect(() => {
    const index = steps.findIndex((step) => currentInView[step.key]);
    if (index !== -1 && index !== currentSection) {
      setCurrentSection(index);
    }
  }, [currentInView, steps, currentSection]);

  const handleScroll = (key: string) => {
    const element = document.querySelector(`[data-section="${key}"]`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      {!smallScreen && (
        <NavContainer>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <NavButton
                onClick={() => handleScroll(step.key)}
                active={index === currentSection}
              >
                <FontAwesomeIcon
                  icon={index === currentSection ? faCircleDot : faCircle}
                />
                {tFile ? t(step.key) : step.title}
              </NavButton>
              {index < steps.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </NavContainer>
      )}
    </>
  );
};

export default ChapterNav;
