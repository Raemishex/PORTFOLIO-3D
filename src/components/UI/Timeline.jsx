import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const timelineData = [
  { date: '2024 Q1', title: 'Team Formation', desc: 'FULL STACK 5 cohort assembled. Vision established.' },
  { date: '2024 Q2', title: 'Foundation', desc: 'Core architecture designed. React + Vite + Three.js stack chosen.' },
  { date: '2024 Q3', title: 'AI Integration', desc: 'MediaPipe gesture recognition system implemented.' },
  { date: '2024 Q4', title: 'Polish & Launch', desc: 'Premium animations, sound design, and final optimizations.' },
  { date: '2025 Q1', title: 'Evolution', desc: 'Voice commands, mini-games, and advanced interactions added.' },
];

const Timeline = () => {
  const { t } = useTranslation();

  return (
    <div style={{ position: 'relative', padding: '40px 0' }}>
      {/* Center line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: '2px',
        background: 'linear-gradient(180deg, transparent, var(--neon-green), transparent)',
        transform: 'translateX(-50%)',
      }} />

      {timelineData.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          style={{
            display: 'flex',
            justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
            paddingRight: i % 2 === 0 ? 'calc(50% + 30px)' : '0',
            paddingLeft: i % 2 !== 0 ? 'calc(50% + 30px)' : '0',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          {/* Dot on timeline */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '20px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--neon-green)',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(0,255,157,0.4)',
            zIndex: 2,
          }} />

          <div
            className="glass-panel"
            style={{
              padding: '20px 25px',
              maxWidth: '350px',
              borderRadius: '16px',
              borderLeft: i % 2 === 0 ? 'none' : '3px solid var(--neon-green)',
              borderRight: i % 2 !== 0 ? 'none' : '3px solid var(--neon-green)',
            }}
          >
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--neon-green)',
              letterSpacing: '2px',
              fontFamily: 'monospace',
            }}>
              {item.date}
            </span>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              margin: '8px 0 6px',
              color: 'var(--text-main)',
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}>
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
