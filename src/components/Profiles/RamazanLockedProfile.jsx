import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getStudentAge, getStudentAbout } from '../../data/students';
import useRamazanStore from '../../store/useRamazanStore';
import '../../pages/StudentDetails.css'; 

const RamazanLockedProfile = ({ student }) => {
  const { t, i18n } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    t('ramazan.connecting'),
    t('ramazan.encrypted'),
    t('ramazan.hint')
  ]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const inputRef = useRef(null);

  // SessionStorage Check
  useEffect(() => {
    if (sessionStorage.getItem('ramazan_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    setTerminalInput('');
    
    if (cmd === 'HACK_CORE') {
      setIsDecrypting(true);
      setTerminalOutput(prev => [...prev, "> HACK_CORE", t('ramazan.command_accepted')]);

      setTimeout(() => {
        setTerminalOutput(prev => [...prev, t('ramazan.bypass_success'), t('ramazan.data_decrypting')]);
      }, 1500);

      setTimeout(() => {
        sessionStorage.setItem('ramazan_unlocked', 'true');
        setIsUnlocked(true);
        setShowTerminal(false);
      }, 3000);
    } else {
      setTerminalOutput(prev => [...prev, `> ${cmd}`, t('ramazan.wrong_command')]);
    }
  };

  useEffect(() => {
    if (showTerminal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTerminal]);

  return (
    <motion.div 
      className="student-details-page cyberpunk-theme"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ fontFamily: 'var(--dynamic-font, "Orbitron", sans-serif)' }}
    >
      <div className="dynamic-container" style={{ position: 'relative' }}>
        
        {/* HACK TERMINAL MODAL */}
        <AnimatePresence>
          {showTerminal && !isUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(5,5,10,0.95)',
                border: '1px solid #00ff9d',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,255,157,0.2)',
                padding: '20px',
                zIndex: 100,
                fontFamily: '"Courier New", Courier, monospace'
              }}
            >
              <div style={{ color: '#00ff9d', borderBottom: '1px solid #00ff9d', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <strong>root@fs5-system: ~</strong>
                <button onClick={() => setShowTerminal(false)} style={{ background: 'transparent', border: 'none', color: '#ff003c', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </div>
              
              <div style={{ height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#fff' }}>
                {terminalOutput.map((line, i) => (
                  <div key={i} style={{ color: line.includes('[XƏTA]') ? '#ff003c' : line.includes('[OK]') ? '#00ff9d' : '#ccc' }}>
                    {line}
                  </div>
                ))}
                {isDecrypting && (
                  <motion.div
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 1.5, ease: 'linear' }}
                    style={{ height: '2px', background: '#00ff9d', marginTop: '10px' }}
                  />
                )}
              </div>

              {!isDecrypting && (
                <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
                  <span style={{ color: '#00ff9d' }}>$</span>
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#00ff9d', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
                    autoComplete="off"
                  />
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* INFO SECTION (Left Column) */}
        <motion.div className="sd-info" style={{
          filter: isUnlocked ? 'none' : 'blur(12px)',
          opacity: isUnlocked ? 1 : 0.4,
          transition: 'all 1s ease',
          pointerEvents: isUnlocked ? 'auto' : 'none'
        }}>
          <h1 className="sd-name" style={{ color: student.themeColor }}>{student.name}</h1>
          
          <div className="sd-meta">
            <span className="sd-age" style={{ background: `${student.themeColor}22`, color: student.themeColor }}>
              {t('home.age', 'Yaş')}: {isUnlocked ? getStudentAge(student) : 'XX'}
            </span>
          </div>

          <div className="sd-divider" style={{ background: `linear-gradient(90deg, transparent, ${student.themeColor}aa, transparent)` }}></div>

          <div className="sd-about-section">
            <h3 className="sd-section-title">{t('home.about', 'Haqqında')}</h3>
            <p className="sd-about-text">
              {isUnlocked ? getStudentAbout(student, i18n.language) : '████████ █████████ ███████ ██ ███████ ████████ ███ ███████.'}
            </p>
          </div>

          <div className="sd-skills-section">
            <h3 className="sd-section-title">{t('home.skills', 'Biliklər')}</h3>
            <div className="sd-skills-grid">
              {student.skills?.map((skill, index) => (
                <span key={index} className="sd-skill-badge" style={{ color: student.themeColor }}>
                  {isUnlocked ? skill : '█████'}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PADLOCK OVERLAY (When Locked) */}
        {!isUnlocked && !showTerminal && (
          <div 
            onClick={() => setShowTerminal(true)}
            style={{
              position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)',
              zIndex: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(0,0,0,0.6)', padding: '30px', borderRadius: '20px', border: '1px solid #00ff9d',
              backdropFilter: 'blur(5px)'
            }}
          >
            <svg viewBox="0 0 24 24" width="60" height="60" stroke="#00ff9d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <p style={{ color: '#00ff9d', marginTop: '15px', fontWeight: 'bold', letterSpacing: '2px' }}>{t('ramazan.click_to_unlock')}</p>
          </div>
        )}

        {/* AVATAR SECTION */}
        <motion.div className="sd-image-wrapper" style={{
          filter: isUnlocked ? 'none' : 'blur(10px)',
          opacity: isUnlocked ? 1 : 0.4,
          transition: 'all 1s ease'
        }}>
          <img src={student.image} alt={student.name} className="sd-avatar" />
        </motion.div>
      </div>
      <div className="bg-glow" style={{ background: student.themeColor }}></div>
    </motion.div>
  );
};

export default RamazanLockedProfile;
