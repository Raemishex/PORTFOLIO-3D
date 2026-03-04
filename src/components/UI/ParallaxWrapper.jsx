import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ParallaxWrapper = ({ children, offset = 50, className = '', style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [-offset, offset]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [-offset, offset]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize values between -0.5 and 0.5
      x.set((e.clientX / innerWidth) - 0.5);
      y.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        x: translateX,
        y: translateY,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxWrapper;
