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

export const useScrollPosition = (limit = 200) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
  };

  const throttledHandleScroll = throttle(handleScroll, limit);

  useEffect(() => {
    setScrollPosition(window.pageYOffset);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  return scrollPosition;
};