import { useEffect, useLayoutEffect, useState } from 'react';

export const useDimensions = (targetRef: React.RefObject<HTMLDivElement>) => {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
  };

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = () => {
    const newDimensions = getDimensions();
    if (
      newDimensions.width !== dimensions.width ||
      newDimensions.height !== dimensions.height
    ) {
      setDimensions(newDimensions);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]); // Add dimensions to dependency array

  useLayoutEffect(() => {
    handleResize();
  }, []);

  return dimensions;
};

export default useDimensions;
