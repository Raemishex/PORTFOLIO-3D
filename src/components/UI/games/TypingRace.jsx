import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SENTENCES = [
  'the quick brown fox jumps over the lazy dog',
  'react makes it painless to create interactive uis',
  'full stack five is the most elite coding cohort',
  'design is not just what it looks like but how it works',
  'the best error message is the one that never shows up',
  'code is like humor when you have to explain it its bad',
  'simplicity is the ultimate sophistication',
  'first solve the problem then write the code',
  'experience is the name everyone gives to their mistakes',
  'every great developer was once a beginner',
];

const TypingRace = () => {
  const [sentence, setSentence] = useState('');
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(() => {
    return parseInt(localStorage.getItem('fs5_best_wpm') || '0');
  });
  const inputRef = useRef(null);

  const newGame = () => {
    const s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setSentence(s);
    setInput('');
    setStarted(false);
    setFinished(false);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => { newGame(); }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sentence[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    // Check completion
    if (val === sentence) {
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const words = sentence.split(' ').length;
      const calculatedWpm = Math.round(words / elapsed);
      setWpm(calculatedWpm);
      setFinished(true);
      if (calculatedWpm > bestWpm) {
        setBestWpm(calculatedWpm);
        localStorage.setItem('fs5_best_wpm', calculatedWpm.toString());
      }
    }
  };

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', marginBottom: '20px',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-muted)',
      }}>
        <span>ACCURACY: {accuracy}%</span>
        <span>BEST: {bestWpm} WPM</span>
      </div>

      {/* Sentence display */}
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        marginBottom: '16px',
        fontFamily: 'var(--font-body, "Cormorant Garamond")',
        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
        lineHeight: 1.8,
        letterSpacing: '0.5px',
      }}>
        {sentence.split('').map((char, i) => {
          let color = 'var(--text-muted)';
          if (i < input.length) {
            color = input[i] === char ? 'var(--neon-green)' : '#ff3c3c';
          }
          return (
            <span key={i} style={{
              color,
              borderBottom: i === input.length ? '2px solid var(--text-main)' : 'none',
              transition: 'color 0.1s',
            }}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={input}
        onChange={handleInput}
        disabled={finished}
        placeholder="Start typing..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          outline: 'none',
          cursor: 'text',
        }}
      />

      {/* Result */}
      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center', marginTop: '20px',
            padding: '20px', borderRadius: '12px',
            background: 'rgba(200,255,0,0.05)',
            border: '1px solid rgba(200,255,0,0.15)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '2rem',
            letterSpacing: '3px', color: 'var(--neon-green)',
          }}>
            {wpm} WPM
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--text-muted)', letterSpacing: '2px', marginTop: '6px',
          }}>
            ACCURACY: {accuracy}%
          </div>
          <button onClick={newGame} style={{
            marginTop: '14px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: '8px', padding: '8px 20px', color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'none', letterSpacing: '2px',
          }}>
            TRY AGAIN
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TypingRace;
