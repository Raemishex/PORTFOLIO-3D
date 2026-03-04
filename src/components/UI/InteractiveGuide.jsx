import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const guideSteps = [
  {
    id: 'welcome',
    icon: '🚀',
    titleKey: 'guide.welcome_title',
    descKey: 'guide.welcome_desc',
    titleFallback: 'Welcome to FULL STACK 5',
    descFallback: 'This interactive guide will walk you through all the features of this premium portfolio experience.',
    spotlight: null,
  },
  {
    id: 'navigation',
    icon: '🧭',
    titleKey: 'guide.nav_title',
    descKey: 'guide.nav_desc',
    titleFallback: 'Navigation',
    descFallback: 'Use the top menu to navigate between Home, About, Contact, and Games pages. On mobile, tap the burger menu.',
    spotlight: '.global-header',
  },
  {
    id: 'students',
    icon: '👥',
    titleKey: 'guide.students_title',
    descKey: 'guide.students_desc',
    titleFallback: 'Student Grid',
    descFallback: 'Click on any student card to view their profile. Drag to reorder. Use arrow keys or swipe on mobile to navigate.',
    spotlight: '.student-grid-wrapper',
  },
  {
    id: 'keyboard',
    icon: '⌨️',
    titleKey: 'guide.keyboard_title',
    descKey: 'guide.keyboard_desc',
    titleFallback: 'Keyboard Controls',
    descFallback: 'Arrow Left/Right: Switch students. Enter: Open profile. Escape: Close/Go home. ?: Show shortcuts.',
    spotlight: null,
  },
  {
    id: 'games',
    icon: '🎮',
    titleKey: 'guide.games_title',
    descKey: 'guide.games_desc',
    titleFallback: 'Game Center',
    descFallback: 'Open Games from the navbar to play Memory, Tic-Tac-Toe, Typing Race, Reaction Test, or draw on the canvas!',
    spotlight: null,
  },
  {
    id: 'themes',
    icon: '🎨',
    titleKey: 'guide.themes_title',
    descKey: 'guide.themes_desc',
    titleFallback: 'Themes & Customization',
    descFallback: 'Toggle dark/light mode from the header. Use the Theme Creator (floating + button) to build your own color scheme.',
    spotlight: null,
  },
  {
    id: 'extras',
    icon: '✨',
    titleKey: 'guide.extras_title',
    descKey: 'guide.extras_desc',
    titleFallback: 'Hidden Features',
    descFallback: 'Use the chatbot for FAQs. Earn achievement badges by exploring features. Share your favorite profiles! Try the fireworks canvas!',
    spotlight: null,
  },
];

const InteractiveGuide = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);

  const step = guideSteps[currentStep];

  useEffect(() => {
    if (!isOpen) return;
    if (step.spotlight) {
      const el = document.querySelector(step.spotlight);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlightRect(rect);
      } else {
        setSpotlightRect(null);
      }
    } else {
      setSpotlightRect(null);
    }
  }, [currentStep, isOpen, step.spotlight]);

  const next = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const skip = () => {
    onClose();
    setCurrentStep(0);
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
        zIndex: 15000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={skip}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Spotlight highlight */}
      {spotlightRect && (
        <div style={{
          position: 'absolute',
          top: spotlightRect.top - 8,
          left: spotlightRect.left - 8,
          width: spotlightRect.width + 16,
          height: spotlightRect.height + 16,
          border: '2px solid var(--neon-green, #00ff9d)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(0,255,157,0.3)',
          pointerEvents: 'none',
          zIndex: 15001,
        }} />
      )}

      {/* Guide Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 15002,
            background: 'var(--glass-bg, rgba(20,20,20,0.9))',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '480px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Progress bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '3px', borderRadius: '20px 20px 0 0', overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)',
          }}>
            <motion.div
              animate={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-green, #00ff9d), #00d4ff)',
                borderRadius: '0 2px 2px 0',
              }}
            />
          </div>

          {/* Step counter */}
          <div style={{
            fontSize: '0.7rem', color: 'var(--text-muted, #888)',
            letterSpacing: '2px', fontFamily: 'monospace',
            marginBottom: '20px',
          }}>
            {currentStep + 1} / {guideSteps.length}
          </div>

          {/* Icon */}
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            {step.icon}
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '1.5rem', fontWeight: 800,
            color: 'var(--text-main, #fff)',
            marginBottom: '12px',
          }}>
            {t(step.titleKey, step.titleFallback)}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: '0.9rem', lineHeight: 1.7,
            color: 'var(--text-muted, #aaa)',
            marginBottom: '30px',
          }}>
            {t(step.descKey, step.descFallback)}
          </p>

          {/* Dots */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '6px',
            marginBottom: '24px',
          }}>
            {guideSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  width: i === currentStep ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentStep ? 'var(--neon-green, #00ff9d)' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button
              onClick={skip}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted, #888)',
                fontSize: '0.85rem', cursor: 'pointer',
                padding: '10px 16px',
              }}
            >
              {t('guide.skip', 'Skip')}
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStep > 0 && (
                <button
                  onClick={prev}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-main, #fff)',
                    padding: '10px 20px', borderRadius: '25px',
                    fontSize: '0.85rem', cursor: 'pointer',
                  }}
                >
                  {t('guide.back', 'Back')}
                </button>
              )}
              <button
                onClick={next}
                style={{
                  background: 'var(--text-main, #fff)',
                  color: 'var(--bg-color, #000)',
                  border: 'none',
                  padding: '10px 24px', borderRadius: '25px',
                  fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {currentStep === guideSteps.length - 1
                  ? t('guide.finish', 'Finish')
                  : t('guide.next', 'Next')}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveGuide;
