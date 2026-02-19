import React, { createContext, useContext, useState, useCallback } from 'react';
import { students } from '../data/students';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Navigation Logic
  const nextStudent = useCallback(() => {
    if (isZoomed) return; // Prevent nav while zoomed
    setCurrentIndex((prev) => (prev + 1) % students.length);
  }, [isZoomed]);

  const prevStudent = useCallback(() => {
    if (isZoomed) return;
    setCurrentIndex((prev) => (prev - 1 + students.length) % students.length);
  }, [isZoomed]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
    setIsPlaying((prev) => !prev); // Sync play state
  }, []);

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
