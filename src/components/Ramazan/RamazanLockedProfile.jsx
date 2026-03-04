import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getStudentAge, getStudentAbout } from '../../data/students';
import '../../pages/StudentDetails.css'; // Reuse exact same layout CSS

const RamazanLockedProfile = ({ student }) => {
  const { t, i18n } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const intervalRef = useRef(null);

  // The Decryption Mechanism (Hold to unlock)
  const startDecrypting = () => {
    setIsDecrypting(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setIsUnlocked(true);
          return 100;
        }
        return prev + 2; // Roughly 50 updates -> 2.5 seconds at 50ms interval
      });
    }, 50);
  };

  const stopDecrypting = () => {
    setIsDecrypting(false);
    clearInterval(intervalRef.current);
    if (progress < 100) {
      // Rapid decay if let go early
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 5;
        });
      }, 30);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    exit: { opacity: 0, x: -50 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div 
      className="student-details-page cyberpunk-theme"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ fontFamily: 'var(--dynamic-font, "Orbitron", sans-serif)' }}
    >
      <div className="dynamic-container" style={{ position: 'relative' }}>
        
        {/* THE SECURITY FIREWALL OVERLAY */}
        <AnimatePresence>
          {!isUnlocked && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div 
                className="firewall-panel"
                style={{
                  background: 'rgba(5, 5, 5, 0.85)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0, 255, 157, 0.3)',
                  borderRadius: '24px',
                  padding: '50px',
                  textAlign: 'center',
                  boxShadow: '0 0 50px rgba(0, 255, 157, 0.1)',
                  maxWidth: '500px',
                  width: '100%'
                }}
              >
                <h2 style={{ color: '#00ff9d', fontSize: '1.5rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                  System Locked
                </h2>
                <p style={{ color: '#8a8a93', marginBottom: '40px', fontSize: '0.9rem' }}>
                  ACCESS DENIED - DECRYPTION REQUIRED
                </p>

                {/* Progress Bar Container */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '30px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: '#00ff9d',
                    boxShadow: '0 0 10px #00ff9d',
                    transition: 'width 0.1s linear'
                  }} />
                </div>

                <button
                  onMouseDown={startDecrypting}
                  onMouseUp={stopDecrypting}
                  onMouseLeave={stopDecrypting}
                  onTouchStart={startDecrypting}
                  onTouchEnd={stopDecrypting}
                  style={{
                    padding: '15px 40px',
                    background: isDecrypting ? 'rgba(0, 255, 157, 0.2)' : 'transparent',
                    border: '1px solid #00ff9d',
                    color: '#00ff9d',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                >
                  {isDecrypting ? 'Decrypting...' : 'Hold to Decrypt'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INFO SECTION (Left Column) - Blurred if not unlocked */}
        <motion.div variants={itemVariants} className="sd-info" style={{
          filter: isUnlocked ? 'none' : 'blur(15px)',
          opacity: isUnlocked ? 1 : 0.4,
          transition: 'all 1.5s ease'
        }}>
          <h1 className="sd-name" style={{ color: student.themeColor }}>
            {student.name}
          </h1>
          
          <div className="sd-meta">
            <span className="sd-age" style={{ background: `${student.themeColor}22`, color: student.themeColor }}>
              {t('home.age', 'Age')}: {isUnlocked ? getStudentAge(student) : 'XX'}
            </span>
          </div>

          <div className="sd-divider" style={{ background: `linear-gradient(90deg, transparent, ${student.themeColor}aa, transparent)` }}></div>

          <div className="sd-about-section">
            <h3 className="sd-section-title">{t('home.about', 'About')}</h3>
            <p className="sd-about-text">
              {isUnlocked ? getStudentAbout(student, i18n.language) : '████████ █████████ ███████ ██ ███████ ████████ ███ ███████. ██████ ███ ███████ ████████...'}
            </p>
          </div>

          <div className="sd-skills-section">
            <h3 className="sd-section-title">{t('home.skills', 'Skills')}</h3>
            <div className="sd-skills-grid">
              {student.skills?.map((skill, index) => (
                <span 
                  key={index} 
                  className="sd-skill-badge"
                  style={{ color: student.themeColor }}
                >
                  {isUnlocked ? skill : '█████'}
                </span>
              ))}
            </div>
          </div>

          <div className="sd-socials">
             <a href={student.socials?.instagram || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.instagram', 'Instagram')}
             </a>
             <a href={student.socials?.linkedin || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.linkedin', 'LinkedIn')}
             </a>
          </div>
        </motion.div>

        {/* AVATAR/CANVAS SECTION (Right Column) */}
        {/* In the original StudentDetails it used sd-image-wrapper for the avatar, replacing it with the 3D element if needed. */}
        {/* I'll mirror the standard layout but add a 3D component placeholder or just the image if no canvas provided here */}
        <motion.div variants={itemVariants} className="sd-image-wrapper" style={{
          filter: isUnlocked ? 'none' : 'blur(10px)',
          opacity: isUnlocked ? 1 : 0.4,
          transition: 'all 1.5s ease'
        }}>
          <img src={student.image} alt={student.name} className="sd-avatar" />
        </motion.div>
      </div>

      <div className="bg-glow" style={{ background: student.themeColor }}></div>
    </motion.div>
  );
};

export default RamazanLockedProfile;
