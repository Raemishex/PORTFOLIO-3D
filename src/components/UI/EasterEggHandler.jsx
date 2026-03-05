import React, { useEffect } from 'react';
import useSound from 'use-sound';
import useStore from '../../store/useStore';

const EasterEggHandler = () => {
  const [playHacker] = useSound('/sounds/hacker.wav', { volume: 0.5 }); // Optional if exists
  const toggleDvdMode = useStore(state => state.toggleDvdMode);

  useEffect(() => {
    let inputSequence = '';
    const HACK_CODE = 'hack';
    const DVD_CODE = 'dvd';
    const MAX_LEN = Math.max(HACK_CODE.length, DVD_CODE.length);

    const handleKeyDown = (e) => {
      // Keep only letters
      if (/^[a-zA-Z]$/.test(e.key)) {
        inputSequence += e.key.toLowerCase();

        // Keep length to max code length
        if (inputSequence.length > MAX_LEN) {
          inputSequence = inputSequence.slice(-MAX_LEN);
        }

        if (inputSequence.endsWith(HACK_CODE)) {
          document.body.classList.toggle('hacker-mode');
          try { playHacker(); } catch(e){}
          inputSequence = ''; // Reset
        }

        if (inputSequence.endsWith(DVD_CODE)) {
          toggleDvdMode();
          inputSequence = ''; // Reset
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playHacker, toggleDvdMode]);

  return null;
};

export default EasterEggHandler;
