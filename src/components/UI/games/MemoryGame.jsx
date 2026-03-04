import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['🚀', '⚡', '🎯', '💎', '🔥', '🌟', '🎨', '🎵'];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initGame = () => {
    const deck = shuffle([...EMOJIS, ...EMOJIS].map((emoji, i) => ({ id: i, emoji })));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { initGame(); }, []);

  useEffect(() => {
    if (matched.length === EMOJIS.length * 2 && matched.length > 0) {
      setWon(true);
    }
  }, [matched]);

  const handleFlip = (id) => {
    if (flipped.length === 2) return;
    if (flipped.includes(id) || matched.includes(id)) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].emoji === cards[b].emoji) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          color: 'var(--text-muted)', letterSpacing: '2px',
        }}>
          MOVES: {moves}
        </span>
        <button onClick={initGame} style={{
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          borderRadius: '8px', padding: '6px 14px', color: 'var(--text-main)',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'none',
          letterSpacing: '2px',
        }}>
          RESTART
        </button>
      </div>

      {won && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            textAlign: 'center', padding: '20px', marginBottom: '16px',
            background: 'rgba(200,255,0,0.05)', borderRadius: '12px',
            border: '1px solid rgba(200,255,0,0.2)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.4rem',
            letterSpacing: '3px', color: 'var(--neon-green)',
          }}>
            YOU WIN!
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>
            {moves} MOVES
          </div>
        </motion.div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
      }}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(i)}
              whileTap={{ scale: 0.95 }}
              style={{
                aspectRatio: '1',
                borderRadius: '10px',
                border: `1px solid ${matched.includes(i) ? 'rgba(200,255,0,0.3)' : 'var(--glass-border)'}`,
                background: isFlipped ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
                cursor: 'none',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}
            >
              {isFlipped ? card.emoji : ''}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryGame;
