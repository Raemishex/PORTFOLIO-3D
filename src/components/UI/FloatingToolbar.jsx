import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingToolbar = ({ onGuide, onAchievements, onThemeCreator, onShare, onFireworks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { icon: '🎆', label: 'Fireworks', action: onFireworks },
    { icon: '📖', label: 'Guide', action: onGuide },
    { icon: '🏆', label: 'Badges', action: onAchievements },
    { icon: '🎨', label: 'Theme', action: onThemeCreator },
    { icon: '📤', label: 'Share', action: onShare },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 11000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      {/* Tool buttons */}
      <AnimatePresence>
        {isOpen && tools.map((tool, i) => (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            onClick={() => { tool.action(); setIsOpen(false); }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--glass-bg, rgba(20,20,20,0.9))',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
              color: 'var(--text-main, #fff)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            title={tool.label}
          >
            {tool.icon}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Main toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: isOpen
            ? 'var(--neon-green, #00ff9d)'
            : 'var(--glass-bg, rgba(20,20,20,0.9))',
          border: `1px solid ${isOpen ? 'transparent' : 'var(--glass-border, rgba(255,255,255,0.1))'}`,
          color: isOpen ? '#000' : 'var(--text-main, #fff)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          boxShadow: isOpen
            ? '0 4px 30px rgba(0,255,157,0.3)'
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        +
      </motion.button>
    </div>
  );
};

export default FloatingToolbar;
