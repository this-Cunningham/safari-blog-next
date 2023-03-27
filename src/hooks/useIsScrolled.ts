import { useState, useEffect } from 'react';

// Throttle function
// eslint-disable-next-line no-unused-vars
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let inThrottle: boolean | undefined;

  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const useIsScrolled = () => {
  const [isScrolled, setisScrolled] = useState(false);

  const handleScroll = () => {
    setisScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    setisScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isScrolled;
};