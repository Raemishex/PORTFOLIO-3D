import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Tutorial.css';

const Tutorial = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if the device is a mobile or touch device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-box">
        <button className="tutorial-close-btn" onClick={onClose}>&times;</button>
        
        <h2>{isMobile ? t('tutorial.mobile_title', 'Mobile Controls') : t('tutorial.desktop_title', 'Tutorial & Controls')}</h2>
        <p className="tutorial-subtitle">FULL STACK 5 - Premium Experience</p>

        <div className="tutorial-steps">
          {isMobile ? (
            <>
              <div className="tutorial-step">
                <span className="icon">👆</span>
                <p><strong>{t('tutorial.touch', 'Touch Screen')}:</strong> {t('tutorial.touch_swipe')}</p>
              </div>
              <div className="tutorial-step">
                <span className="icon">🔍</span>
                <p><strong>{t('tutorial.touch_tap_title', 'Double Tap')}:</strong> {t('tutorial.touch_tap')}</p>
              </div>
              <div className="tutorial-step">
                <span className="icon">👇</span>
                <p><strong>{t('tutorial.touch_down_title', 'Swipe Down')}:</strong> {t('tutorial.touch_down')}</p>
              </div>
            </>
          ) : (
            <>
              <div className="tutorial-step">
                <span className="icon">⌨️</span>
                <p><strong>{t('tutorial.keyboard')}:</strong> {t('tutorial.keyboard_desc')}</p>
              </div>
              <div className="tutorial-step">
                <span className="icon">🖱️</span>
                <p><strong>{t('tutorial.mouse')}:</strong> {t('tutorial.mouse_desc')}</p>
              </div>
              <div className="tutorial-step">
                <span className="icon">🎮</span>
                <p><strong>{t('tutorial.games', 'Games')}:</strong> {t('tutorial.games_desc', 'Open Games from the navbar to play Memory, Tic-Tac-Toe, Typing Race, and more!')}</p>
              </div>
            </>
          )}
        </div>

        <button className="tutorial-start-btn" onClick={onClose}>{t('tutorial.start_button', 'START')}</button>
      </div>
    </div>
  );
};

export default Tutorial;
