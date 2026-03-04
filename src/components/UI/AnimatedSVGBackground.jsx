import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AnimatedSVGBackground = () => {
  const shapes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        id: i,
        type: ['circle', 'hexagon', 'triangle', 'diamond'][Math.floor(Math.random() * 4)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 80,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * 10,
        opacity: 0.02 + Math.random() * 0.04,
      });
    }
    return items;
  }, []);

  const renderShape = (shape) => {
    const style = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
    };

    switch (shape.type) {
      case 'circle':
        return (
          <svg viewBox="0 0 100 100" style={style}>
            <circle cx="50" cy="50" r="45" fill="none"
              stroke="var(--neon-green, #00ff9d)"
              strokeWidth="1"
              opacity={shape.opacity}
            />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 100 100" style={style}>
            <polygon
              points="50,2 93,25 93,75 50,98 7,75 7,25"
              fill="none"
              stroke="var(--neon-green, #00ff9d)"
              strokeWidth="1"
              opacity={shape.opacity}
            />
          </svg>
        );
      case 'triangle':
        return (
          <svg viewBox="0 0 100 100" style={style}>
            <polygon
              points="50,5 95,95 5,95"
              fill="none"
              stroke="var(--neon-green, #00ff9d)"
              strokeWidth="1"
              opacity={shape.opacity}
            />
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" style={style}>
            <polygon
              points="50,2 98,50 50,98 2,50"
              fill="none"
              stroke="var(--neon-green, #00ff9d)"
              strokeWidth="1"
              opacity={shape.opacity}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}

      {/* Grid overlay */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none"
              stroke="var(--neon-green, #00ff9d)"
              strokeWidth="0.3"
              opacity="0.03"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
};

export default AnimatedSVGBackground;
