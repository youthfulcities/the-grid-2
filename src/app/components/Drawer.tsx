import useDimensions from '@/hooks/useDimensions';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DrawerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  min-width: 300px;
  height: 100%;
  color: var(--amplify-colors-font-inverse);
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: var(--amplify-space-large);
`;

const Overlay = styled(motion.div)<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: var(--amplify-colors-font-inverse);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001; /* Ensure it's above other content */
  &:hover {
    color: var(--amplify-colors-font-primary);
  }
`;

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(drawerRef, isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            isOpen={isOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <DrawerContainer
            className='soft-shadow'
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(children as React.ReactElement, {
                    drawerWidth: width,
                  })
                : child
            )}
          </DrawerContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
