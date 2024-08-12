import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export const useDimensions = (
  targetRef: React.RefObject<HTMLDivElement>,
  isOpen?: boolean
) => {
  const getDimensions = useCallback(
    () => ({
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    }),
    [targetRef]
  );

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = useCallback(() => {
    const newDimensions = getDimensions();
    if (
      newDimensions.width !== dimensions.width ||
      newDimensions.height !== dimensions.height
    ) {
      setDimensions(newDimensions);
    }
  }, [dimensions, getDimensions]);

  useEffect(() => {
    if (isOpen !== undefined && isOpen) {
      handleResize(); // Initial resize update
      window.addEventListener('resize', handleResize);
    } else if (isOpen === undefined) {
      handleResize(); // Initial resize update if isOpen is not provided
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, handleResize]);

  useLayoutEffect(() => {
    handleResize(); // Ensure dimensions are updated initially and when `isOpen` changes
  }, [handleResize]);

  return dimensions;
};

export default useDimensions;
