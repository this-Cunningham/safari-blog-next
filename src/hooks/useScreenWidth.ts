import { useEffect, useState } from 'react';

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const updateScreen = () => setScreenWidth(window.innerWidth);
    updateScreen();
    window.addEventListener('resize', updateScreen);

    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  return screenWidth;
};