import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const ReactionTest = () => {
  const [state, setState] = useState('waiting'); // waiting | ready | go | result | early
  const [reactionTime, setReactionTime] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('fs5_best_reaction') || '9999'));
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);
  const startRef = useRef(0);

  const startRound = useCallback(() => {
    setState('ready');
    const delay = 1500 + Math.random() * 3500;
    timerRef.current = setTimeout(() => {
      setState('go');
      startRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'waiting' || state === 'result' || state === 'early') {
      startRound();
    } else if (state === 'ready') {
      clearTimeout(timerRef.current);
      setState('early');
    } else if (state === 'go') {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      setHistory((h) => [...h.slice(-4), time]);
      if (time < best) {
        setBest(time);
        localStorage.setItem('fs5_best_reaction', time.toString());
      }
      setState('result');
    }
  }, [state, best, startRound]);

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;

  const getColor = () => {
    if (state === 'ready') return '#ff3c3c';
    if (state === 'go') return 'var(--neon-green)';
    return 'var(--glass-bg)';
  };

  const getText = () => {
    if (state === 'waiting') return { big: 'CLICK TO START', small: 'Test your reaction speed' };
    if (state === 'ready') return { big: 'WAIT...', small: 'Click when it turns green' };
    if (state === 'go') return { big: 'CLICK NOW!', small: '' };
    if (state === 'early') return { big: 'TOO EARLY!', small: 'Click to try again' };
    return { big: `${reactionTime}ms`, small: 'Click to try again' };
  };

  const { big, small } = getText();

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', marginBottom: '16px',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-muted)',
      }}>
        <span>BEST: {best < 9999 ? `${best}ms` : '---'}</span>
        <span>AVG: {avg > 0 ? `${avg}ms` : '---'}</span>
      </div>

      {/* Click zone */}
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          height: '260px',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          background: getColor(),
          cursor: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'background 0.15s',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: state === 'result' ? 'clamp(2rem, 6vw, 3.5rem)' : 'clamp(1.2rem, 3vw, 1.8rem)',
          letterSpacing: '4px',
          color: state === 'go' ? '#000' : state === 'ready' ? '#fff' : 'var(--text-main)',
        }}>
          {big}
        </span>
        {small && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: state === 'go' ? 'rgba(0,0,0,0.5)' : state === 'ready' ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
          }}>
            {small}
          </span>
        )}
      </motion.button>

      {/* History */}
      {history.length > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px',
          flexWrap: 'wrap',
        }}>
          {history.map((t, i) => (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: '6px',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '1px',
              color: t === best ? 'var(--neon-green)' : 'var(--text-muted)',
            }}>
              {t}ms
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionTest;
