import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LockoutOverlay = () => {
  const { t } = useTranslation();
  const [ipData, setIpData] = useState('FETCHING...');
  const [lines, setLines] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    // Fetch real IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpData(data.ip))
      .catch(() => setIpData('UNKNOWN_IP_FALLBACK'));
  }, []);

  useEffect(() => {
    if (ipData === 'FETCHING...') return;

    const script = [
      t('penalty.line1', "[!] CRITICAL THREAT DETECTED. INITIATING COUNTER-MEASURES..."),
      t('penalty.line2', "[!] EXTRACTING DEVICE FINGERPRINT..."),
      t('penalty.os', { browser: navigator.userAgent }),
      t('penalty.resolution', { width: window.screen.width, height: window.screen.height }),
      t('penalty.ip', { ip: ipData }),
      t('penalty.uploading', "[!] UPLOADING DATA TO MAINFRAME..."),
      t('penalty.dots', "..."),
      t('penalty.banned', "[!] YOU ARE BANNED FOR 1 HOUR. DO NOT ATTEMPT RE-ENTRY.")
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < script.length) {
        setLines(prev => [...prev, script[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [ipData]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#000000',
      color: '#ff003c',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
      fontFamily: '"Courier New", Courier, monospace',
      textAlign: 'left',
      padding: '40px',
      overflow: 'hidden'
    }}>
      {/* Glitch Overlay Effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ zIndex: 2, width: '100%', maxWidth: '800px' }}
      >
        <div style={{ fontSize: '80px', marginBottom: '20px', textAlign: 'center', textShadow: '0 0 30px #ff003c' }}>
          {t('penalty.title', '🛑 SYSTEM LOCKDOWN 🛑')}
        </div>
        
        <div style={{
          marginTop: '40px',
          padding: '30px',
          border: '1px solid #ff003c',
          backgroundColor: 'rgba(255, 0, 60, 0.05)',
          boxShadow: 'inset 0 0 20px rgba(255, 0, 60, 0.2), 0 0 20px rgba(255, 0, 60, 0.2)',
          minHeight: '300px'
        }}>
          {lines.map((line, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                marginBottom: '10px',
                color: index === lines.length - 1 ? '#ff003c' : '#00ff9d',
                fontWeight: index === lines.length - 1 ? 'bold' : 'normal',
                textShadow: index === lines.length - 1 ? '0 0 10px #ff003c' : '0 0 5px #00ff9d'
              }}
            >
              {line}
            </motion.div>
          ))}
          {/* Blinking Cursor */}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ display: 'inline-block', width: '10px', height: '1.2rem', backgroundColor: '#00ff9d', verticalAlign: 'middle', marginTop: '10px' }}
          />
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          {t('penalty.footer', 'SECURE CONNECTION SEVERED. DEVICE FLAGGED.')}
        </div>
      </motion.div>
    </div>
  );
};

export default LockoutOverlay;
