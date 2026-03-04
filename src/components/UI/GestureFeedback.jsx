import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const GestureFeedback = () => {
  const gestureFeedback = useStore((state) => state.gestureFeedback);
  const setGestureFeedback = useStore((state) => state.setGestureFeedback);

  // Auto-dismiss the toast after 1.5 seconds
  useEffect(() => {
    if (gestureFeedback) {
      const timer = setTimeout(() => {
        setGestureFeedback(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gestureFeedback, setGestureFeedback]);

  return (
    <AnimatePresence>
      {gestureFeedback && (
         <motion.div
           initial={{ opacity: 0, y: 0, scale: 0.5 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
           transition={{ type: 'spring', damping: 20, stiffness: 300 }}
           style={{
             position: 'fixed',
             top: '50%', 
             left: '50%',
             transform: 'translate(-50%, -50%)',
             color: '#ffffff',
             fontSize: '3rem',
             fontWeight: '900',
             zIndex: 9999,
             textTransform: 'uppercase',
             letterSpacing: '0.1em',
             pointerEvents: 'none',
           }}
         >
           {gestureFeedback}
         </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureFeedback;
