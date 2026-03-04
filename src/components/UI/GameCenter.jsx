import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryGame from './games/MemoryGame';
import TicTacToe from './games/TicTacToe';
import TypingRace from './games/TypingRace';
import ReactionTest from './games/ReactionTest';
import DrawingCanvas from './games/DrawingCanvas';
import { unlockAchievement } from './AchievementSystem';

const GAMES = [
  { id: 'memory', name: 'Memory', icon: '🧠', desc: 'Match the pairs', component: MemoryGame },
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: '❌', desc: 'Beat the AI', component: TicTacToe },
  { id: 'typing', name: 'Type Race', icon: '⌨️', desc: 'Speed typing test', component: TypingRace },
  { id: 'reaction', name: 'Reaction', icon: '⚡', desc: 'Test your reflexes', component: ReactionTest },
  { id: 'draw', name: 'Draw', icon: '🎨', desc: 'Free canvas', component: DrawingCanvas },
];

const GameCenter = ({ isOpen, onClose }) => {
  const [activeGame, setActiveGame] = useState(null);

  const handleOpenGame = (game) => {
    setActiveGame(game);
    unlockAchievement('play_game');
  };

  const handleBack = () => setActiveGame(null);

  if (!isOpen) return null;

  const ActiveComponent = activeGame?.component;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 16000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div onClick={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      }} />

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          position: 'relative', zIndex: 16001,
          background: 'var(--bg-color, #0a0a08)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          width: '90%', maxWidth: '600px',
          maxHeight: '85vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 25px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeGame && (
              <button onClick={handleBack} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '1.2rem', cursor: 'none', padding: '4px',
              }}>←</button>
            )}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.6rem',
                letterSpacing: '3px', color: 'var(--text-main)',
              }}>
                {activeGame ? activeGame.name : 'GAME CENTER'}
              </h2>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase',
              }}>
                {activeGame ? activeGame.desc : 'Choose a game to play'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: '1.5rem', cursor: 'none',
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <AnimatePresence mode="wait">
            {!activeGame ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}
              >
                {GAMES.map((game) => (
                  <motion.button
                    key={game.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenGame(game)}
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '14px',
                      padding: '24px 16px',
                      cursor: 'none',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '10px',
                      transition: 'border-color 0.3s',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{game.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.1rem',
                      letterSpacing: '2px', color: 'var(--text-main)',
                    }}>{game.name}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                      letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase',
                    }}>{game.desc}</span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={activeGame.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ActiveComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCenter;
