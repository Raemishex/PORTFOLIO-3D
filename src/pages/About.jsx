import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TextReveal from '../components/UI/TextReveal';
import Timeline from '../components/UI/Timeline';
import { unlockAchievement } from '../components/UI/AchievementSystem';

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const techStack = [
  { name: 'React', icon: '⚛️', desc: 'UI Framework' },
  { name: 'Vite', icon: '⚡', desc: 'Build Tool' },
  { name: 'Three.js', icon: '🎮', desc: '3D Rendering' },
  { name: 'MediaPipe', icon: '🤖', desc: 'AI Gestures' },
  { name: 'Framer Motion', icon: '🎬', desc: 'Animations' },
  { name: 'GSAP', icon: '✨', desc: 'Advanced Motion' },
];

const About = () => {
  const { t } = useTranslation();
  useEffect(() => { unlockAchievement('visit_about'); }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        padding: '120px 50px 80px',
        color: 'var(--text-main)',
        maxWidth: '1000px',
        margin: '0 auto',
        minHeight: '100vh',
        overflowY: 'auto'
      }}
    >
      <motion.div variants={itemVariants}>
        <TextReveal
          text={t('about.title')}
          tag="h1"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '15px'
          }}
          delay={0.2}
        />
      </motion.div>

      <motion.div variants={itemVariants} style={{
        width: '80px', height: '4px',
        background: 'linear-gradient(90deg, var(--neon-green), transparent)',
        borderRadius: '2px',
        marginBottom: '40px'
      }} />

      <motion.div variants={itemVariants} className="glass-panel" style={{
        padding: '40px',
        borderRadius: '20px',
        borderLeft: '4px solid var(--neon-green)',
        marginBottom: '50px'
      }}>
        <p style={{ fontSize: '1.15rem', lineHeight: 1.9, color: 'var(--text-muted)' }}>
          {t('about.description')}
        </p>
      </motion.div>

      <motion.h2 variants={itemVariants} style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: '25px',
        color: 'var(--text-muted)'
      }}>
        Tech Stack
      </motion.h2>

      <motion.div variants={itemVariants} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '60px'
      }}>
        {techStack.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-panel"
            style={{
              padding: '20px',
              textAlign: 'center',
              cursor: 'default',
              borderRadius: '14px'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{tech.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{tech.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tech.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline Section */}
      <motion.h2 variants={itemVariants} style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: '10px',
        color: 'var(--text-muted)'
      }}>
        Our Journey
      </motion.h2>

      <motion.div variants={itemVariants}>
        <Timeline />
      </motion.div>
    </motion.div>
  );
};

export default About;
