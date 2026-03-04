import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

const gestureMappings = [
  { icon: '👊', label: 'Open Profile' },
  { icon: '✋', label: 'Go Home' },
  { icon: '👍', label: 'Toggle Audio' },
  { icon: '☝️', label: 'Toggle Theme' },
  { icon: '✌️', label: 'Switch Language' },
  { icon: '🤟', label: 'About Page' },
  { icon: '👎', label: 'Contact Page' },
  { icon: '👋', label: 'Swipe L/R' },
];

const GestureHUD = () => {
  const cameraPermissionGranted = useStore((state) => state.cameraPermissionGranted);
  const fingerCount = useStore((state) => state.fingerCount);
  const handCoordinates = useStore((state) => state.handCoordinates);

  if (!cameraPermissionGranted) return null;

  return (
    <AnimatePresence>
      {handCoordinates && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{
            position: 'fixed',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 5001,
            pointerEvents: 'none',
          }}
        >
          {/* Finger count indicator */}
          <motion.div
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '8px 12px',
              color: 'var(--neon-green)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid rgba(0,255,157,0.2)',
              marginBottom: '8px',
              fontFamily: 'monospace',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{fingerCount}</span>
            <br />
            FINGERS
          </motion.div>

          {/* Gesture shortcuts */}
          {gestureMappings.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>{g.icon}</span>
              {g.label}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureHUD;
