import { useState, useEffect } from 'react';

// Hook
export const useMobile = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    if( isClient && window.innerWidth <= 768 ) {
      return true;
    } else {
      return false;
    }
  }

  const [isMobile, setIsMobile] = useState(getSize);

  useEffect(() => {

    function handleResize() {
      setIsMobile(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line
  }, []);

  return isMobile;
};
