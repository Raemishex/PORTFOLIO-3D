import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import useStore from '../../store/useStore';

const VirtualCursor = () => {
  const handCoordinates = useStore((state) => state.handCoordinates);
  const isPinching = useStore((state) => state.isPinching);
  const [clickRipple, setClickRipple] = useState(false);

  // Smooth springs for LERP-like cursor motion
  const cursorX = useSpring(0, { stiffness: 400, damping: 25, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 25, mass: 0.2 });

  useEffect(() => {
    if (handCoordinates) {
      cursorX.set(handCoordinates.x * window.innerWidth);
      cursorY.set(handCoordinates.y * window.innerHeight);
    }
  }, [handCoordinates, cursorX, cursorY]);

  // Klik animasiyası üçün
  useEffect(() => {
    if (isPinching) {
      setClickRipple(true);
      setTimeout(() => setClickRipple(false), 300);
    }
  }, [isPinching]);

  if (!handCoordinates) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '24px', height: '24px', borderRadius: '50%',
          border: '2px solid rgba(0, 255, 157, 0.8)',
          x: cursorX, y: cursorY,
          translateX: '-50%', translateY: '-50%',
          pointerEvents: 'none', zIndex: 99999,
          boxShadow: isPinching ? '0 0 20px rgba(0, 255, 157, 1)' : '0 0 10px rgba(0, 255, 157, 0.3)',
          backgroundColor: isPinching ? 'rgba(0, 255, 157, 0.4)' : 'transparent',
        }}
        animate={{ scale: isPinching ? 0.6 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      
      {/* Ripple Effect upon Pinch */}
      {clickRipple && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'rgba(0, 255, 157, 0.5)',
            x: cursorX, y: cursorY,
            translateX: '-50%', translateY: '-50%',
            pointerEvents: 'none', zIndex: 99998,
          }}
        />
      )}
    </>
  );
};

export default VirtualCursor;
