import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import ExperienceA from './ExperienceA_Nodes';
import ExperienceB from './ExperienceB_Physics';
import ExperienceC from './ExperienceC_Hacking';

import useRamazanStore from '../../store/useRamazanStore';
import { getStudentAge, getStudentAbout } from '../../data/students';
import '../../pages/StudentDetails.css';

const RamazanProfile = ({ student }) => {
  const { t, i18n } = useTranslation();
  const { addLog } = useRamazanStore();
  
  // Normal interaction state
  const [experienceIndex, setExperienceIndex] = useState(0); 

  const changeExperience = (index, name) => {
    setExperienceIndex(index);
    addLog(`[SİSTEM]: Rejim dəyişdirildi. İndi aktivdir: ${name}`);
  };



  // The rendering logic for the 3D Canvas
  const renderCanvas = (expIdx) => {
    return (
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows style={{ width: '100%', height: '100%', borderRadius: '20px' }}>
         <color attach="background" args={['#050505']} />
         <fog attach="fog" args={['#050505', 10, 30]} />
         <Environment preset="city" />
         <OrbitControls makeDefault enablePan={false} maxDistance={20} minDistance={2} dampingFactor={0.05} />
         
         {expIdx === 0 && <ExperienceA />}
         {expIdx === 1 && <ExperienceB />}
         {expIdx === 2 && <ExperienceC />}
      </Canvas>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    exit: { opacity: 0, x: -50 }
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
        
        {/* INFO SECTION (Left Column) */}
        <motion.div className="sd-info" style={{ position: 'relative' }}>
          <h1 className="sd-name" style={{ color: student.themeColor }}>
            {student.name}
          </h1>
          
          <div className="sd-meta">
            <span className="sd-age" style={{ background: `${student.themeColor}22`, color: student.themeColor }}>
              {t('home.age', 'Age')}: {getStudentAge(student)}
            </span>
          </div>

          <div className="sd-divider" style={{ background: `linear-gradient(90deg, transparent, ${student.themeColor}aa, transparent)` }}></div>

          <div style={{ position: 'relative', minHeight: '300px' }}>
            <div>
              <div className="sd-about-section">
                <h3 className="sd-section-title">{t('home.about', 'About')}</h3>
                <p className="sd-about-text">
                  {getStudentAbout(student, i18n.language)}
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
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CYBER DECK - Now Below The Profile Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sd-cyber-deck" 
            style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <h3 style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
              Cyber Deck Controls
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { name: 'Gravity Nodes', idx: 0 },
                { name: 'Physics Crash', idx: 1 },
                { name: 'Data Shield', idx: 2 }
              ].map((btn) => {
                const isActive = experienceIndex === btn.idx;
                return (
                  <button
                    key={btn.idx}
                    onClick={() => changeExperience(btn.idx, btn.name)}
                    style={{
                      padding: '10px 15px',
                      background: isActive ? 'rgba(0, 255, 157, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: isActive ? '#00ff9d' : '#aaa',
                      border: `1px solid ${isActive ? '#00ff9d' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease',
                    }}
                     onMouseOver={(e) => { 
                       if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } 
                     }}
                     onMouseOut={(e) => { 
                       if (!isActive) { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } 
                     }}
                  >
                    {btn.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="sd-socials" style={{ marginTop: '30px' }}>
             <a href={student.socials?.instagram || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.instagram', 'Instagram')}
             </a>
             <a href={student.socials?.linkedin || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.linkedin', 'LinkedIn')}
             </a>
          </div>
        </motion.div>

        <motion.div className="sd-image-wrapper" style={{ 
          height: '500px', 
          width: '100%', 
          padding: 0, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Dynamic Render of Canvas */}
          <div style={{ flex: 1, position: 'relative' }}>
             {renderCanvas(experienceIndex)}
          </div>
        </motion.div>
      </div>

      <div className="bg-glow" style={{ background: student.themeColor }}></div>
    </motion.div>
  );
};

export default RamazanProfile;
