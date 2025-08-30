import { useState, useEffect } from 'react';

/**
 * A custom hook that returns true if the window width is above a certain breakpoint.
 * Defaults to 1024px, which is Tailwind's 'lg' breakpoint.
 * @param {number} breakpoint - The width in pixels to check against.
 * @returns {boolean} - True if the screen is wider than the breakpoint.
 */
const useIsDesktop = (breakpoint = 1024) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > breakpoint);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isDesktop;
};

export default useIsDesktop;