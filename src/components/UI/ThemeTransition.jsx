import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../store/useStore';

const ThemeTransition = () => {
  const theme = useStore((state) => state.theme);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circleStyle, setCircleStyle] = useState({});
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (prevTheme.current === theme) return;
    prevTheme.current = theme;

    // Find the theme toggle button position for the reveal origin
    const btn = document.querySelector('.theme-toggle');
    let x = window.innerWidth - 60;
    let y = 30;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Calculate max radius to cover entire screen from click point
    const maxRadius = Math.ceil(
      Math.sqrt(
        Math.max(x, window.innerWidth - x) ** 2 +
        Math.max(y, window.innerHeight - y) ** 2
      )
    );

    setCircleStyle({
      position: 'fixed',
      top: y,
      left: x,
      width: 0,
      height: 0,
      borderRadius: '50%',
      background: theme === 'dark' ? '#050505' : '#f5f5f7',
      transform: 'translate(-50%, -50%)',
      zIndex: 99998,
      pointerEvents: 'none',
      '--max-radius': `${maxRadius * 2}px`,
    });
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [theme]);

  if (!isAnimating) return null;

  return (
    <>
      <div
        style={{
          ...circleStyle,
          animation: 'themeReveal 0.5s ease-out forwards',
        }}
      />
      <style>{`
        @keyframes themeReveal {
          0% { width: 0; height: 0; opacity: 1; }
          100% {
            width: var(--max-radius);
            height: var(--max-radius);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ThemeTransition;
