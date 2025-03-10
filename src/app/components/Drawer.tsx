import { useDimensions } from '@/hooks/useDimensions';
import { Text, useBreakpointValue } from '@aws-amplify/ui-react';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaAngleRight, FaX } from 'react-icons/fa6';
import styled from 'styled-components';

interface DrawerProps {
  isopen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  noOverlay?: boolean;
  absolute?: boolean;
  onOpen?: () => void;
  tabText?: React.ReactNode;
  noClickOutside?: boolean;
  translate?: number;
  id?: string;
}

const DrawerContainer = styled(motion.div)<{
  isopen: boolean;
  $absolute: boolean;
  $translate: number;
  $maxWidth: number;
}>`
  position: ${({ $absolute }) => ($absolute ? 'absolute' : 'fixed')};
  top: 0;
  right: 0;
  min-width: 300px;
  max-width: ${({ $maxWidth }) => $maxWidth}%;
  height: 100%;
  color: var(--amplify-colors-font-inverse);
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: var(--amplify-space-large);
  transform: ${({ isopen, $translate }) =>
    isopen
      ? `translateX(calc(0px + ${$translate}px))`
      : `translateX(calc(100% + ${$translate}px))`};
  transition: transform 0.3s ease-in-out;
`;

const Overlay = styled(motion.div)<{ isopen: boolean }>`
  display: ${({ isopen }) => (isopen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ isopen }) => (isopen ? 1 : 0)};
`;

const Tab = styled(motion.div)<{
  $offset: number;
  $absolute: boolean;
  $translate: number;
}>`
  position: ${({ $absolute }) => ($absolute ? 'absolute' : 'fixed')};
  writing-mode: vertical-lr;
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(-1); /* flips to face scroll bar */
  top: 12%;
  right: ${({ $offset, $translate }) => `calc(${$offset}px - ${$translate}px)`};
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
  isopen,
  onClose,
  onOpen,
  children,
  noOverlay,
  tabText,
  absolute,
  noClickOutside,
  translate = 0,
  id = 'drawer-content',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [tabOffset, setTabOffset] = useState<number>(0);
  const { width } = useDimensions(drawerRef, isopen);
  const maxWidth = useBreakpointValue({
    base: 90,
    small: 90,
    medium: 50,
    large: 30,
  });

  // Scroll to top when the drawer is opened
  useEffect(() => {
    if (isopen && drawerRef.current) {
      drawerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isopen]);

  // Expose the drawerRef to parent coffmponents via ref
  useEffect(() => {
    if (!drawerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (drawerRef.current) {
        setTabOffset(drawerRef.current.getBoundingClientRect().width);
      }
    });

    resizeObserver.observe(drawerRef.current);

    return () => resizeObserver.disconnect();
  }, [drawerRef]);

  useEffect(() => {
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

    if (isopen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Calculate tab position based on drawer's position
      if (drawerRef.current) {
        const drawerRect = drawerRef.current.getBoundingClientRect();
        setTabOffset(drawerRect.width); // Position the tab offset by the drawer's width
      }
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isopen]);

  console.log(width, maxWidth);

  return (
    <>
      {!noOverlay && (
        <Overlay
          data-testid='drawer-overlay'
          isopen={isopen}
          onClick={onClose}
        />
      )}
      <DrawerContainer
        $translate={translate}
        id={id}
        className='soft-shadow'
        ref={drawerRef}
        isopen={isopen}
        $absolute={absolute || false}
        $maxWidth={maxWidth as number}
      >
        {width !== undefined &&
          React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement, {
                  drawerwidth: width, // Pass drawer width as a prop
                })
              : child
          )}
      </DrawerContainer>
      <Tab
        $translate={translate}
        $absolute={absolute || false}
        ref={tabRef}
        $offset={isopen ? tabOffset : 0}
        onClick={isopen ? onClose : onOpen}
      >
        <Text margin='0'>{isopen ? <FaX /> : tabText || <FaAngleRight />}</Text>
      </Tab>
    </>
  );
};

export default Drawer;
