import { useDimensions } from '@/hooks/useDimensions';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaAngleRight, FaX } from 'react-icons/fa6';
import styled from 'styled-components';

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  noOverlay?: boolean;
  absolute?: boolean;
  onOpen?: () => void;
  tabText?: string;
  noClickOutside?: boolean;
  id?: string;
}

const DrawerContainer = styled(motion.div)<{
  isOpen: boolean;
  $absolute: boolean;
}>`
  position: ${({ $absolute }) => ($absolute ? 'absolute' : 'fixed')};
  top: 0;
  right: 0;
  min-width: 300px;
  max-width: 40%;
  height: 100%;
  color: var(--amplify-colors-font-inverse);
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow-y: scroll;
  overflow-x: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: var(--amplify-space-large);
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
`;

const Overlay = styled(motion.div)<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const Tab = styled(motion.div)<{ $offset: number; $absolute: boolean }>`
  position: ${({ $absolute }) => ($absolute ? 'absolute' : 'fixed')};
  writing-mode: vertical-lr;
  transform: scale(-1); /* flips to face scroll bar */
  top: 12%;
  right: ${({ $offset }) => `${$offset}px`};
  min-width: 50px;
  min-height: 50px;
  height: auto;
  backdrop-filter: blur(10px);
  color: var(--amplify-colors-font-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  border-radius: 0 8px 8px 0;
`;

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  children,
  noOverlay,
  tabText,
  absolute,
  noClickOutside,
  id = 'drawer-content',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [tabOffset, setTabOffset] = useState<number>(0);
  const { width } = useDimensions(drawerRef, isOpen);

  // Expose the drawerRef to parent components via ref

  const handleClickOutside = (event: MouseEvent) => {
    if (noClickOutside) return;
    if (
      onClose &&
      drawerRef.current &&
      tabRef.current &&
      !drawerRef.current.contains(event.target as Node) &&
      !tabRef.current.contains(event.target as Node) // Ignore clicks on the tab
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (drawerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (drawerRef.current) {
          const drawerRect = drawerRef.current.getBoundingClientRect();
          setTabOffset(drawerRect.width); // Update tabOffset when drawer's width changes
        }
      });

      resizeObserver.observe(drawerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Calculate tab position based on drawer's position
      if (drawerRef.current) {
        const drawerRect = drawerRef.current.getBoundingClientRect();
        setTabOffset(drawerRect.width); // Position the tab offset by the drawer's width
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {!noOverlay && <Overlay isOpen={isOpen} onClick={onClose} />}
      <DrawerContainer
        id={id}
        className='soft-shadow'
        ref={drawerRef}
        isOpen={isOpen}
        $absolute={absolute || false}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement, {
                drawerWidth: width,
              })
            : child
        )}
      </DrawerContainer>
      <Tab
        $absolute={absolute || false}
        ref={tabRef}
        $offset={isOpen ? tabOffset : 0}
        onClick={isOpen ? onClose : onOpen}
      >
        {isOpen ? <FaX /> : tabText || <FaAngleRight />}
      </Tab>
    </>
  );
};

export default Drawer;
