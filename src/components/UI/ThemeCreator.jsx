import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CUSTOM_THEME_KEY = 'fs5_custom_theme';

const defaultColors = {
  bgColor: '#0a0a0a',
  textMain: '#ffffff',
  textMuted: '#888888',
  accentColor: '#00ff9d',
  glassBg: 'rgba(20,20,20,0.4)',
  glassBorder: 'rgba(255,255,255,0.08)',
};

const colorFields = [
  { key: 'bgColor', label: 'Background', cssVar: '--bg-color' },
  { key: 'textMain', label: 'Text Primary', cssVar: '--text-main' },
  { key: 'textMuted', label: 'Text Muted', cssVar: '--text-muted' },
  { key: 'accentColor', label: 'Accent / Neon', cssVar: '--neon-green' },
];

const presets = [
  { name: 'Cyber Green', colors: { bgColor: '#0a0a0a', textMain: '#ffffff', textMuted: '#888888', accentColor: '#00ff9d' } },
  { name: 'Ocean Blue', colors: { bgColor: '#0a1628', textMain: '#e0e8ff', textMuted: '#6b7fa0', accentColor: '#00b4ff' } },
  { name: 'Sunset', colors: { bgColor: '#1a0a0a', textMain: '#fff0e6', textMuted: '#a08070', accentColor: '#ff6b35' } },
  { name: 'Purple Haze', colors: { bgColor: '#0e0a1a', textMain: '#e8e0ff', textMuted: '#7b6fa0', accentColor: '#b44aff' } },
  { name: 'Rose Gold', colors: { bgColor: '#1a0f0f', textMain: '#ffe8e8', textMuted: '#a07878', accentColor: '#ff6b9d' } },
  { name: 'Matrix', colors: { bgColor: '#000000', textMain: '#00ff00', textMuted: '#006600', accentColor: '#00ff00' } },
];

const applyCustomTheme = (colors) => {
  const root = document.documentElement;
  root.style.setProperty('--bg-color', colors.bgColor);
  root.style.setProperty('--text-main', colors.textMain);
  root.style.setProperty('--text-muted', colors.textMuted);
  root.style.setProperty('--neon-green', colors.accentColor);
  root.style.setProperty('--accent-color', colors.accentColor);
};

const clearCustomTheme = () => {
  const root = document.documentElement;
  ['--bg-color', '--text-main', '--text-muted', '--neon-green', '--accent-color'].forEach((v) => {
    root.style.removeProperty(v);
  });
};

const ThemeCreator = ({ isOpen, onClose }) => {
  const [colors, setColors] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CUSTOM_THEME_KEY));
      return saved || { ...defaultColors };
    } catch {
      return { ...defaultColors };
    }
  });

  const updateColor = (key, value) => {
    const next = { ...colors, [key]: value };
    setColors(next);
    applyCustomTheme(next);
  };

  const applyPreset = (preset) => {
    setColors({ ...defaultColors, ...preset.colors });
    applyCustomTheme({ ...defaultColors, ...preset.colors });
  };

  const save = () => {
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(colors));
    onClose();
  };

  const reset = () => {
    localStorage.removeItem(CUSTOM_THEME_KEY);
    setColors({ ...defaultColors });
    clearCustomTheme();
  };

  // Load saved custom theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_THEME_KEY);
    if (saved) {
      try {
        applyCustomTheme(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 13000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          position: 'relative', zIndex: 13001,
          background: 'var(--glass-bg, rgba(20,20,20,0.95))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
          borderRadius: '20px',
          padding: '35px',
          maxWidth: '460px',
          width: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '20px',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer',
        }}>&times;</button>

        <h2 style={{
          fontSize: '1.3rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '3px',
          marginBottom: '6px', color: 'var(--text-main, #fff)',
        }}>
          Theme Creator
        </h2>
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)',
          fontFamily: 'monospace', marginBottom: '24px',
        }}>
          Customize your experience
        </p>

        {/* Presets */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
            color: 'var(--text-muted)', marginBottom: '10px',
            textTransform: 'uppercase',
          }}>
            Presets
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                style={{
                  background: p.colors.bgColor,
                  color: p.colors.accentColor,
                  border: `1px solid ${p.colors.accentColor}40`,
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color Pickers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {colorFields.map((field) => (
            <div key={field.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main, #fff)' }}>
                  {field.label}
                </div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  {colors[field.key]}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: colors[field.key],
                  border: '2px solid rgba(255,255,255,0.1)',
                }} />
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(e) => updateColor(field.key, e.target.value)}
                  style={{
                    width: '36px', height: '36px',
                    border: 'none', borderRadius: '8px',
                    cursor: 'pointer', background: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div style={{
          padding: '20px',
          borderRadius: '14px',
          background: colors.bgColor,
          border: `1px solid ${colors.accentColor}30`,
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '0.65rem', color: colors.textMuted, letterSpacing: '2px', marginBottom: '8px' }}>
            PREVIEW
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.textMain, marginBottom: '4px' }}>
            FULL STACK 5
          </div>
          <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '8px' }}>
            The Most Elite & Innovative Group
          </div>
          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
            background: `${colors.accentColor}20`, color: colors.accentColor,
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            Accent Color
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={reset} style={{
            flex: 1, padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', color: 'var(--text-muted)',
            fontSize: '0.85rem', cursor: 'pointer',
          }}>
            Reset
          </button>
          <button onClick={save} style={{
            flex: 2, padding: '12px',
            background: colors.accentColor,
            border: 'none', borderRadius: '12px',
            color: colors.bgColor,
            fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer',
          }}>
            Save Theme
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeCreator;
