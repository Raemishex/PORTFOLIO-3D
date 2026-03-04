import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const shortcuts = [
  { keys: ['←', '→'], action: 'shortcuts.nav_students' },
  { keys: ['↑', '↓'], action: 'shortcuts.switch_students' },
  { keys: ['Enter'], action: 'shortcuts.open_profile' },
  { keys: ['Esc'], action: 'shortcuts.go_home' },
  { keys: ['?'], action: 'shortcuts.toggle_help' },
];

const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsVisible(false)}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 8000,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '20px 24px',
            minWidth: '280px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            marginBottom: '14px',
            fontWeight: 700
          }}>
            {t('shortcuts.title', 'Keyboard Shortcuts')}
          </div>

          {shortcuts.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < shortcuts.length - 1 ? '1px solid var(--glass-border)' : 'none'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {t(s.action, s.action.split('.')[1])}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {s.keys.map((key, j) => (
                  <kbd key={j} style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    minWidth: '28px',
                    textAlign: 'center'
                  }}>
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '12px',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            opacity: 0.6
          }}>
            {t('shortcuts.press_to_close', 'Press ? to close')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;
