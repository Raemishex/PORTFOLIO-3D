import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import useSound from 'use-sound';
import { usePortfolio } from '../../context/PortfolioContext';
import MagneticButton from './MagneticButton';
import './Header.css';

const Header = ({ onOpenGames }) => {
  const { t, i18n } = useTranslation();
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const { audioEnabled, toggleAudio } = usePortfolio();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [playHover] = useSound('/sounds/hover.wav', { volume: 0.2, soundEnabled: audioEnabled });
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.5, soundEnabled: audioEnabled });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    playClick();
    const newLang = i18n.language === 'en' ? 'az' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { path: '/', label: t('nav.home', 'Ana Səhifə') },
    { path: '/about', label: t('nav.about', 'Haqqımızda') },
    { path: '/contact', label: t('nav.contact', 'Əlaqə') }
  ];

  return (
    <header 
      className={`global-header ${scrolled ? 'scrolled' : ''}`} 
      style={{ 
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      }}
    >
      <div className="header-brand" onMouseEnter={() => playHover()} onClick={() => { playClick(); window.location.href = "/"; }}>
        <div style={{ cursor: 'pointer' }} className="brand-logo">
          FULL STACK <span className="brand-accent">5</span>
        </div>
      </div>

      <nav className="header-nav desktop-only">
        {navLinks.map((link, index) => (
          <MagneticButton key={index}>
            <NavLink
              to={link.path}
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          </MagneticButton>
        ))}
        <MagneticButton>
          <button
            onMouseEnter={() => playHover()}
            onClick={() => { playClick(); onOpenGames?.(); }}
            className="nav-link nav-link-btn"
          >
            {t('nav.games', 'Games')}
          </button>
        </MagneticButton>
        <MagneticButton>
          <NavLink
            to="/auth"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="nav-link"
            style={{
              background: 'var(--neon-green)',
              color: '#000',
              padding: '0.4rem 1.2rem',
              borderRadius: '20px',
              fontWeight: '700'
            }}
          >
            LOGIN
          </NavLink>
        </MagneticButton>
      </nav>

      <div className="header-toggles desktop-only">
        <MagneticButton>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => { playClick(); toggleAudio(); }} 
            className="premium-icon-btn audio-btn"
            title={audioEnabled ? t('controls.sound_off', 'Səsi Bağla') : t('controls.sound_on', 'Səsi Aç')}
          >
            {audioEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            )}
          </motion.button>
        </MagneticButton>

        <MagneticButton>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage} 
            className="premium-icon-btn text-btn"
          >
            {i18n.language.toUpperCase()}
          </motion.button>
        </MagneticButton>

        <MagneticButton>
          <motion.button 
             whileHover={{ scale: 1.05 }} 
             whileTap={{ scale: 0.95 }}
             onClick={() => { playClick(); toggleTheme(); }} 
             className="premium-icon-btn theme-toggle"
          >
             <motion.div
               key={theme}
               initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
               animate={{ rotate: 0, scale: 1, opacity: 1 }}
               exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
               transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
             >
               {theme === 'dark' ? (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
               ) : (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
               )}
             </motion.div>
          </motion.button>
        </MagneticButton>
      </div>

      <div className="mobile-only burger-icon" onClick={() => { playClick(); setIsMenuOpen(!isMenuOpen); }}>
        <div className={`burger-line ${isMenuOpen ? 'open-1' : ''}`} />
        <div className={`burger-line ${isMenuOpen ? 'open-2' : ''}`} />
        <div className={`burger-line ${isMenuOpen ? 'open-3' : ''}`} />
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="mobile-nav">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  onClick={() => { playClick(); setIsMenuOpen(false); }}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={() => { playClick(); setIsMenuOpen(false); onOpenGames?.(); }}
                className="mobile-nav-link"
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {t('nav.games', 'Games')}
              </button>
            </nav>
            <div className="mobile-toggles">
              <button onClick={() => { playClick(); toggleAudio(); }} className="mobile-toggle-btn">
                {audioEnabled ? t('controls.sound_on') : t('controls.sound_off')}
              </button>
              <button onClick={() => { playClick(); toggleLanguage(); }} className="mobile-toggle-btn">
                {i18n.language.toUpperCase()}
              </button>
              <button onClick={() => { playClick(); toggleTheme(); }} className="mobile-toggle-btn">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
