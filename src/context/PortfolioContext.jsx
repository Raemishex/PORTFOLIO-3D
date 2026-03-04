import React, { createContext, useContext, useCallback } from 'react';
import useStore from '../store/useStore';
import { students } from '../data/students';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  // Single source of truth: Zustand store
  const currentIndex = useStore((state) => state.activeStudentIndex);
  const isPlaying = useStore((state) => state.isPlaying);
  const setActiveStudentIndex = useStore((state) => state.setActiveStudentIndex);
  const setPlaying = useStore((state) => state.setPlaying);

  const [isZoomed, setIsZoomed] = React.useState(false);
  const [audioEnabled, setAudioEnabled] = React.useState(false);

  const nextStudent = useCallback(() => {
    if (isZoomed) return;
    setActiveStudentIndex((currentIndex + 1) % students.length);
  }, [isZoomed, currentIndex, setActiveStudentIndex]);

  const prevStudent = useCallback(() => {
    if (isZoomed) return;
    setActiveStudentIndex((currentIndex - 1 + students.length) % students.length);
  }, [isZoomed, currentIndex, setActiveStudentIndex]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
    setPlaying(!isPlaying);
  }, [isPlaying, setPlaying]);

  return (
    <PortfolioContext.Provider
      value={{
        currentIndex,
        isZoomed,
        audioEnabled,
        isPlaying,
        nextStudent,
        prevStudent,
        toggleZoom,
        toggleAudio,
        students
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
