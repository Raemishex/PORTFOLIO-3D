import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';

const AudioManager = () => {
  const { currentIndex, students, audioEnabled, isPlaying } = usePortfolio();
  const audioRef = useRef(new Audio());
  const nextAudioRef = useRef(new Audio());
  const currentTrack = useRef(null);

  useEffect(() => {
    if (!audioEnabled) {
      audioRef.current.pause();
      nextAudioRef.current.pause();
      return;
    }

    const targetTrack = students[currentIndex]?.audioTrack;
    if (!targetTrack || targetTrack === currentTrack.current) return;

    // Crossfade Logic
    // 1. Load next track
    const nextAudio = nextAudioRef.current;
    nextAudio.src = targetTrack;
    nextAudio.volume = 0;
    nextAudio.loop = true;
    nextAudio.play().catch(e => console.log("Audio play failed (interaction needed?):", e));

    // 2. Fade in next, Fade out current
    const currentAudio = audioRef.current;
    
    gsap.to(currentAudio, { volume: 0, duration: 2, onComplete: () => {
       currentAudio.pause();
       currentAudio.src = ""; // Cleanup
    }});
    
    gsap.to(nextAudio, { volume: 0.5, duration: 2 });

    // 3. Swap refs
    currentTrack.current = targetTrack;
    // Swap the audio objects so audioRef always points to the ACTIVE main track
    const temp = audioRef.current;
    audioRef.current = nextAudioRef.current;
    nextAudioRef.current = temp;

  }, [currentIndex, audioEnabled, students]);

  useEffect(() => {
     // Handle Play/Pause toggle
     if (audioRef.current.src) {
        if (isPlaying && audioEnabled) audioRef.current.play();
        else audioRef.current.pause();
     }
  }, [isPlaying, audioEnabled]);

  return null; // Headless component
};

export default AudioManager;
