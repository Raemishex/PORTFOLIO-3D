import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageWithSkeleton = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }} className={className}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(90deg, var(--glass-bg), var(--glass-bg-hover), var(--glass-bg))',
              backgroundSize: '200% 100%',
              zIndex: 1
            }}
            animate={{ backgroundPosition: ['100% 0%', '-100% 0%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        )}
      </AnimatePresence>
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default ImageWithSkeleton;
