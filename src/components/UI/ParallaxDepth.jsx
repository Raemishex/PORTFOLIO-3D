import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../store/useStore';

const ParallaxDepth = ({ children, intensity = 20 }) => {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId;

    const update = () => {
      const hand = useStore.getState().handCoordinates;
      let x, y;

      if (hand) {
        // Use hand coordinates (0-1 range)
        x = (hand.x - 0.5) * intensity;
        y = (hand.y - 0.5) * intensity;
      } else {
        // Will be set by mouse
        animId = requestAnimationFrame(update);
        return;
      }

      setOffset({ x, y });
      animId = requestAnimationFrame(update);
    };

    const onMouseMove = (e) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * intensity;
      const y = ((e.clientY / window.innerHeight) - 0.5) * intensity;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', onMouseMove);
    update();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) perspective(1000px) rotateY(${offset.x * 0.3}deg) rotateX(${-offset.y * 0.3}deg)`,
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxDepth;
