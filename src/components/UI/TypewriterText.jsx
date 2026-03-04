import React, { useEffect, useState, useRef } from 'react';

const TypewriterText = ({ text, speed = 30, delay = 0, className = '', style = {}, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    setStarted(false);

    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started || !text) return;

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  return (
    <span className={className} style={style}>
      {displayed}
      {started && indexRef.current < text.length && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          background: 'var(--neon-green)',
          marginLeft: '2px',
          animation: 'blink 0.8s step-end infinite',
          verticalAlign: 'text-bottom',
        }} />
      )}
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </span>
  );
};

export default TypewriterText;
