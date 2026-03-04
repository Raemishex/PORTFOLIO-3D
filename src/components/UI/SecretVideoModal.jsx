import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useStore from '../../store/useStore';

const SecretVideoModal = () => {
  const isSecretVideoOpen = useStore((state) => state.isSecretVideoOpen);
  const setSecretVideoOpen = useStore((state) => state.setSecretVideoOpen);

  const { t } = useTranslation();

  const handleClose = () => {
    setSecretVideoOpen(false);
  };

  return (
    <AnimatePresence>
      {isSecretVideoOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999, // Absolute highest
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Glowing Red Accent Background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, rgba(255,0,60,0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 1
          }}></div>

          <h1 style={{
            color: '#fff',
            fontSize: '4rem',
            letterSpacing: '10px',
            fontFamily: '"Orbitron", sans-serif',
            zIndex: 2,
            textTransform: 'uppercase'
          }}>
            {t('secret_video.title')}
          </h1>

          <div style={{
            width: '80%',
            maxWidth: '1000px',
            aspectRatio: '16/9',
            background: '#000',
            border: '1px solid rgba(255, 0, 60, 0.5)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            transform: 'translateZ(200px)',
            overflow: 'hidden',
            zIndex: 2
          }}>
            <video 
              src="/assets/images/terbiyesiz-adam.mp4" 
              autoPlay 
              controls={false}
              loop 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <button 
            onClick={handleClose}
            style={{
              marginTop: '40px',
              padding: '12px 30px',
              background: 'transparent',
              border: '1px solid rgba(255,0,60,0.5)',
              color: '#ff003c',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              zIndex: 2,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,0,60,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t('secret_video.close')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretVideoModal;
