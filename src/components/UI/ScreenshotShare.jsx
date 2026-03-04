import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { unlockAchievement } from './AchievementSystem';

const ScreenshotShare = ({ isOpen, onClose }) => {
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  const captureScreen = async () => {
    setCapturing(true);
    try {
      // Use canvas-based capture for the app container
      const { default: html2canvas } = await import('html2canvas');
      const appEl = document.querySelector('.app-container') || document.getElementById('root');
      const canvas = await html2canvas(appEl, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      setScreenshotUrl(url);
      unlockAchievement('share_profile');
    } catch {
      // Fallback: simple text share
      setScreenshotUrl(null);
    }
    setCapturing(false);
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;
    const link = document.createElement('a');
    link.download = `fullstack5-screenshot-${Date.now()}.png`;
    link.href = screenshotUrl;
    link.click();
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        if (screenshotUrl) {
          const blob = await (await fetch(screenshotUrl)).blob();
          const file = new File([blob], 'fullstack5.png', { type: 'image/png' });
          await navigator.share({
            title: 'FULL STACK 5 Portfolio',
            text: 'Check out this amazing portfolio from FULL STACK 5!',
            files: [file],
          });
        } else {
          await navigator.share({
            title: 'FULL STACK 5 Portfolio',
            text: 'Check out this amazing portfolio from FULL STACK 5!',
            url: window.location.href,
          });
        }
        unlockAchievement('share_profile');
      } catch { /* user cancelled */ }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      unlockAchievement('share_profile');
    } catch { /* fallback */ }
  };

  const handleClose = () => {
    setScreenshotUrl(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 13500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div onClick={handleClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
      }} />

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          position: 'relative', zIndex: 13501,
          background: 'var(--glass-bg, rgba(20,20,20,0.95))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
          borderRadius: '20px',
          padding: '35px',
          maxWidth: '440px',
          width: '90%',
        }}
      >
        <button onClick={handleClose} style={{
          position: 'absolute', top: '15px', right: '20px',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer',
        }}>&times;</button>

        <h2 style={{
          fontSize: '1.3rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '3px',
          marginBottom: '6px', color: 'var(--text-main, #fff)',
        }}>
          Share
        </h2>
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)',
          fontFamily: 'monospace', marginBottom: '24px',
        }}>
          Capture & share the experience
        </p>

        {/* Screenshot preview */}
        {screenshotUrl && (
          <div style={{
            marginBottom: '20px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <img
              src={screenshotUrl}
              alt="Screenshot"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Capture button */}
          <button
            onClick={captureScreen}
            disabled={capturing}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--neon-green, #00ff9d)',
              color: '#000',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: capturing ? 'wait' : 'pointer',
              opacity: capturing ? 0.6 : 1,
            }}
          >
            {capturing ? 'Capturing...' : screenshotUrl ? 'Recapture' : 'Capture Screenshot'}
          </button>

          {/* Download */}
          {screenshotUrl && (
            <button
              onClick={downloadScreenshot}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-main, #fff)',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Download PNG
            </button>
          )}

          {/* Native Share */}
          {navigator.share && (
            <button
              onClick={shareNative}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(0,150,255,0.15)',
                border: '1px solid rgba(0,150,255,0.3)',
                color: '#00aaff',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Share via...
            </button>
          )}

          {/* Copy Link */}
          <button
            onClick={copyLink}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: copied ? 'var(--neon-green, #00ff9d)' : 'var(--text-muted, #888)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScreenshotShare;
