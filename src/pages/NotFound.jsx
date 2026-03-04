import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <motion.h1
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          fontSize: '8rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ff003c, #00ff9d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}
      >
        404
      </motion.h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginTop: '10px', marginBottom: '30px' }}>
        {t('common.page_not_found', 'Bu səhifə tapılmadı.')}
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '14px 40px',
          borderRadius: '30px',
          background: 'var(--text-main)',
          color: 'var(--bg-color)',
          fontWeight: 800,
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}
      >
        {t('nav.home', 'Ana Səhifə')}
      </button>
    </motion.div>
  );
};

export default NotFound;
