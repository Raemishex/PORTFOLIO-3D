import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACHIEVEMENTS = [
  { id: 'first_visit', icon: '🌟', title: 'First Steps', desc: 'Visit the portfolio for the first time' },
  { id: 'view_3_students', icon: '👀', title: 'Explorer', desc: 'View 3 student profiles' },
  { id: 'view_all_students', icon: '🏆', title: 'Collector', desc: 'View all student profiles' },
  { id: 'toggle_theme', icon: '🎨', title: 'Stylist', desc: 'Toggle the theme' },
  { id: 'toggle_language', icon: '🌍', title: 'Polyglot', desc: 'Switch language' },
  { id: 'use_keyboard', icon: '⌨️', title: 'Shortcutter', desc: 'Use keyboard navigation' },
  { id: 'play_game', icon: '🎮', title: 'Gamer', desc: 'Play the hidden Snake game' },
  { id: 'use_chatbot', icon: '🤖', title: 'Conversationalist', desc: 'Use the chatbot' },
  { id: 'visit_about', icon: '📖', title: 'Curious Mind', desc: 'Visit the About page' },
  { id: 'visit_contact', icon: '📧', title: 'Networker', desc: 'Visit the Contact page' },
  { id: 'use_gesture', icon: '✋', title: 'Gesture Master', desc: 'Use a hand gesture' },
  { id: 'share_profile', icon: '📤', title: 'Social Butterfly', desc: 'Share a student profile' },
];

const STORAGE_KEY = 'fs5_achievements';

const getUnlocked = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveUnlocked = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// Global event-based unlock system
const achievementListeners = new Set();

export const unlockAchievement = (id) => {
  const current = getUnlocked();
  if (!current.includes(id)) {
    const updated = [...current, id];
    saveUnlocked(updated);
    achievementListeners.forEach((fn) => fn(id));
  }
};

const AchievementToast = ({ achievement, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{
        background: 'var(--glass-bg, rgba(20,20,20,0.95))',
        border: '1px solid var(--neon-green, #00ff9d)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 10px 40px rgba(0,255,157,0.2)',
        minWidth: '260px',
        maxWidth: '340px',
      }}
    >
      <div style={{ fontSize: '2rem' }}>{achievement.icon}</div>
      <div>
        <div style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px',
          color: 'var(--neon-green, #00ff9d)', fontFamily: 'monospace',
          marginBottom: '4px',
        }}>
          ACHIEVEMENT UNLOCKED
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #fff)' }}>
          {achievement.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #aaa)' }}>
          {achievement.desc}
        </div>
      </div>
    </motion.div>
  );
};

const AchievementSystem = () => {
  const [toasts, setToasts] = useState([]);
  const toastQueueRef = useRef([]);

  const handleUnlock = useCallback((id) => {
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    toastQueueRef.current.push(ach);
    setToasts((prev) => [...prev, ach]);
  }, []);

  useEffect(() => {
    achievementListeners.add(handleUnlock);
    // Auto-unlock first_visit
    unlockAchievement('first_visit');
    return () => achievementListeners.delete(handleUnlock);
  }, [handleUnlock]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 12000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <AnimatePresence>
        {toasts.map((ach) => (
          <AchievementToast
            key={ach.id}
            achievement={ach}
            onDone={() => removeToast(ach.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Badge panel component for viewing all achievements
export const AchievementPanel = ({ isOpen, onClose }) => {
  const [unlocked, setUnlocked] = useState(getUnlocked());

  useEffect(() => {
    if (isOpen) setUnlocked(getUnlocked());
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 14000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div onClick={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
      }} />

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          position: 'relative', zIndex: 14001,
          background: 'var(--glass-bg, rgba(20,20,20,0.95))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
          borderRadius: '20px',
          padding: '35px',
          maxWidth: '520px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '20px',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer',
        }}>&times;</button>

        <h2 style={{
          fontSize: '1.4rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '3px',
          marginBottom: '8px', color: 'var(--text-main, #fff)',
        }}>
          Achievements
        </h2>

        <p style={{
          fontSize: '0.8rem', color: 'var(--text-muted, #888)',
          fontFamily: 'monospace', marginBottom: '24px',
        }}>
          {unlocked.length} / {ACHIEVEMENTS.length} unlocked
        </p>

        {/* Progress */}
        <div style={{
          width: '100%', height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.05)', marginBottom: '24px',
        }}>
          <div style={{
            width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%`,
            height: '100%', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--neon-green, #00ff9d), #00d4ff)',
            transition: 'width 0.5s',
          }} />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px',
        }}>
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div key={ach.id} style={{
                padding: '16px',
                borderRadius: '12px',
                background: isUnlocked ? 'rgba(0,255,157,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isUnlocked ? 'rgba(0,255,157,0.2)' : 'rgba(255,255,255,0.05)'}`,
                opacity: isUnlocked ? 1 : 0.4,
                display: 'flex', gap: '12px', alignItems: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                  {ach.icon}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: '0.85rem',
                    color: isUnlocked ? 'var(--text-main, #fff)' : 'var(--text-muted, #666)',
                  }}>
                    {ach.title}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted, #888)',
                  }}>
                    {ach.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementSystem;
