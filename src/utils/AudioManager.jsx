import { useEffect } from 'react';
import useStore from '../store/useStore';
import { students } from '../data/students';
import gsap from 'gsap';

let currentAudio = null;

const AudioManager = () => {
  const activeStudentIndex = useStore((state) => state.activeStudentIndex);
  const isPlaying = useStore((state) => state.isPlaying) || false;

  useEffect(() => {
    if (!isPlaying) {
      if (currentAudio) {
        gsap.to(currentAudio, {
          volume: 0,
          duration: 1,
          onComplete: () => {
            currentAudio?.pause();
            currentAudio.src = '';
            currentAudio = null;
          }
        });
      }
      return;
    }

    const student = students[activeStudentIndex];
    if (!student?.audioTrack) return;

    const nextAudio = new Audio(student.audioTrack);
    nextAudio.loop = true;
    nextAudio.volume = 0;

    nextAudio.play().then(() => {
      gsap.to(nextAudio, { volume: 0.5, duration: 2 });

      if (currentAudio) {
        const oldAudio = currentAudio;
        gsap.to(oldAudio, {
          volume: 0,
          duration: 2,
          onComplete: () => {
            oldAudio.pause();
            oldAudio.src = '';
          }
        });
      }
      currentAudio = nextAudio;
    }).catch(() => {
      // Audio autoplay blocked by browser - user must interact first
      nextAudio.src = '';
    });

    return () => {
      // Cleanup on unmount: stop next audio if it was created but component is tearing down
      if (nextAudio && nextAudio !== currentAudio) {
        nextAudio.pause();
        nextAudio.src = '';
      }
    };
  }, [activeStudentIndex, isPlaying]);

  return null;
};

export default AudioManager;
