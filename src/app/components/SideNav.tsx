'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components for the sidebar
const SideNavContainer = styled.nav`
  position: fixed;
  left: 0;
  top: 40%;
  width: 200px;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1000;
`;

const NavLink = styled.a<{ $active: boolean }>`
  position: relative;
  color: ${(props) =>
    props.$active
      ? 'var(--amplify-colors-brand-secondary-60)'
      : 'var(--amplify-colors-font-inverse)'};
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: var(--amplify-colors-brand-secondary-60);
    &::before {
      background-color: var(--amplify-colors-brand-secondary-60);
    }
  }

  /* Vertical bar */
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px;
    background-color: ${(props) =>
      props.$active
        ? 'var(--amplify-colors-brand-secondary-60)'
        : 'var(--amplify-colors-neutral-80)'};
    transition: background-color 0.3s ease;
  }
`;

interface SideNavProps {
  sections: { id: string; label: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Adjust the threshold to detect when section is in view
    });

    sections.forEach((section) => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => {
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section.id);
        if (sectionElement) {
          observer.unobserve(sectionElement);
        }
      });
    };
  }, [sections]);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SideNavContainer>
      {sections.map((section) => (
        <NavLink
          key={section.id}
          $active={activeSection === section.id}
          onClick={() => handleScroll(section.id)}
        >
          {section.label}
        </NavLink>
      ))}
    </SideNavContainer>
  );
};

export default SideNav;
