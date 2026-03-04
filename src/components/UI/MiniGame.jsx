import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

// Snake game easter egg - activated by typing "game" on keyboard
const MiniGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const keysRef = useRef([]);

  // Listen for "game" sequence
  useEffect(() => {
    const sequence = [];
    const target = 'game';

    const onKeyDown = (e) => {
      if (isOpen) return;
      sequence.push(e.key.toLowerCase());
      if (sequence.length > target.length) sequence.shift();
      if (sequence.join('') === target) {
        setIsOpen(true);
        setScore(0);
        setGameOver(false);
        sequence.length = 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Game direction input
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      const dirs = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      if (dirs[e.key]) {
        e.preventDefault();
        keysRef.current = [dirs[e.key]];
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Game loop
  useEffect(() => {
    if (!isOpen || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CELL = 15;
    const COLS = Math.floor(canvas.width / CELL);
    const ROWS = Math.floor(canvas.height / CELL);

    let snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
    let dir = { x: 1, y: 0 };
    let food = spawnFood();
    let interval;

    function spawnFood() {
      return {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    }

    function tick() {
      // Process input
      if (keysRef.current.length > 0) {
        const key = keysRef.current.shift();
        const newDir = { UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 } }[key];
        if (newDir && !(newDir.x === -dir.x && newDir.y === -dir.y)) {
          dir = newDir;
        }
      }

      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        food = spawnFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          ctx.strokeRect(i * CELL, j * CELL, CELL, CELL);
        }
      }

      // Snake
      snake.forEach((s, i) => {
        const alpha = 1 - (i / snake.length) * 0.6;
        ctx.fillStyle = i === 0 ? '#00ff9d' : `rgba(0, 255, 157, ${alpha})`;
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });

      // Food
      ctx.fillStyle = '#FF2A54';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
    }

    interval = setInterval(tick, 100);
    gameRef.current = interval;

    return () => clearInterval(interval);
  }, [isOpen, gameOver]);

  const restart = useCallback(() => {
    setScore(0);
    setGameOver(false);
    keysRef.current = [];
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
          }}
        >
          <div style={{
            background: '#0a0a0a',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid rgba(0,255,157,0.3)',
            boxShadow: '0 0 60px rgba(0,255,157,0.1)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '10px', padding: '0 5px',
            }}>
              <span style={{ color: '#00ff9d', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'monospace' }}>
                SNAKE // SCORE: {score}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', color: '#666',
                  fontSize: '1.5rem', cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={375}
              height={375}
              style={{ borderRadius: '10px', display: 'block' }}
            />

            {gameOver && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center', marginTop: '15px',
                }}
              >
                <p style={{ color: '#FF2A54', fontWeight: 800, fontSize: '1.2rem', marginBottom: '10px' }}>
                  GAME OVER — Score: {score}
                </p>
                <button
                  onClick={restart}
                  style={{
                    background: '#00ff9d', color: '#000', border: 'none',
                    padding: '10px 30px', borderRadius: '20px', fontWeight: 800,
                    cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  PLAY AGAIN
                </button>
              </motion.div>
            )}

            <p style={{
              color: '#444', fontSize: '0.65rem', textAlign: 'center',
              marginTop: '8px', fontFamily: 'monospace',
            }}>
              Arrow keys to move • ESC to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniGame;
