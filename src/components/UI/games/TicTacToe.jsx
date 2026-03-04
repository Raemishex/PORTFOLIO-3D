import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWinner = (b) => {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return b.every(Boolean) ? 'draw' : null;
};

const minimax = (board, isMax) => {
  const w = checkWinner(board);
  if (w === 'O') return 10;
  if (w === 'X') return -10;
  if (w === 'draw') return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
};

const getAIMove = (board) => {
  // 30% chance of random move (make it beatable)
  if (Math.random() < 0.3) {
    const empties = board.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    return empties[Math.floor(Math.random() * empties.length)];
  }
  let bestVal = -Infinity, bestMove = 0;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, false);
      board[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ x: 0, o: 0, draw: 0 });

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); };

  const handleClick = useCallback((i) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = 'X';

    const w1 = checkWinner(next);
    if (w1) {
      setBoard(next);
      setWinner(w1);
      if (w1 === 'X') setScore(s => ({ ...s, x: s.x + 1 }));
      else if (w1 === 'draw') setScore(s => ({ ...s, draw: s.draw + 1 }));
      return;
    }

    // AI move
    const aiMove = getAIMove(next);
    if (aiMove !== undefined) next[aiMove] = 'O';
    const w2 = checkWinner(next);
    setBoard(next);
    if (w2) {
      setWinner(w2);
      if (w2 === 'O') setScore(s => ({ ...s, o: s.o + 1 }));
      else if (w2 === 'draw') setScore(s => ({ ...s, draw: s.draw + 1 }));
    }
  }, [board, winner]);

  const winLine = winner && winner !== 'draw'
    ? LINES.find(([a, b, c]) => board[a] === winner && board[b] === winner && board[c] === winner)
    : null;

  return (
    <div>
      {/* Scoreboard */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', marginBottom: '16px',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px',
        color: 'var(--text-muted)',
      }}>
        <span>YOU: {score.x}</span>
        <span>DRAW: {score.draw}</span>
        <span>AI: {score.o}</span>
      </div>

      {/* Board */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
        maxWidth: '300px', margin: '0 auto',
      }}>
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => handleClick(i)}
            whileTap={{ scale: 0.9 }}
            style={{
              aspectRatio: '1',
              borderRadius: '10px',
              border: `1px solid ${winLine?.includes(i) ? 'var(--neon-green)' : 'var(--glass-border)'}`,
              background: winLine?.includes(i) ? 'rgba(200,255,0,0.05)' : 'var(--glass-bg)',
              cursor: 'none',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              color: cell === 'X' ? 'var(--text-main)' : 'var(--neon-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              letterSpacing: '2px',
            }}
          >
            {cell && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {cell}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Result */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.3rem',
            letterSpacing: '3px',
            color: winner === 'X' ? 'var(--neon-green)' : winner === 'draw' ? 'var(--text-muted)' : 'var(--neon-red, #ff3c3c)',
          }}>
            {winner === 'X' ? 'YOU WIN!' : winner === 'draw' ? 'DRAW' : 'AI WINS'}
          </div>
          <button onClick={reset} style={{
            marginTop: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: '8px', padding: '8px 20px', color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'none', letterSpacing: '2px',
          }}>
            PLAY AGAIN
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TicTacToe;
