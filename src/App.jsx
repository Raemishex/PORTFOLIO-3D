import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import GestureController from './components/GestureController';
import CursorManager from './components/CursorManager';
import AudioManager from './components/AudioManager';
import LoadingScreen from './components/LoadingScreen';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

// Keyboard Controls Component
const KeyboardControls = () => {
  const { nextStudent, prevStudent, toggleZoom, toggleAudio } = usePortfolio();
  
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextStudent();
      if (e.key === 'ArrowLeft') prevStudent();
      if (e.key === ' ') toggleZoom(); // Space to zoom
      if (e.key === 'm' || e.key === 'M') toggleAudio(); // M to mute/unmute
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextStudent, prevStudent, toggleZoom, toggleAudio]);
  
  return null;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Easter Egg Listener (Key 'E' for Efraim)
  useEffect(() => {
    const handleKey = (e) => {
       if (e.key === 'e' || e.key === 'E') {
          setShowEasterEgg(prev => !prev);
       }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <PortfolioProvider>
      <KeyboardControls />
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <Scene />
          <GestureController />
          <CursorManager />
          <AudioManager />
          
          {/* Fallback & Instructions */}
          <div className="ui-overlay" style={{ pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', bottom: 20, right: 20, textAlign: 'right', color: 'white', fontSize: '12px' }}>
              <p>Swipe Left/Right • Arrow Keys • Pinch to Zoom</p>
              <p>Thumbs Up for Audio • 'E' for Surprise</p>
            </div>

            <div style={{ position: 'absolute', bottom: 10, right: 20, zIndex: 10, textAlign: 'right', pointerEvents: 'auto' }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>Sənin Ləqəbin</h4>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '5px' }}>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '12px' }}>Instagram</a>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: '12px' }}>LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Easter Egg Modal */}
          {showEasterEgg && (
            <div style={{
               position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
               background: 'rgba(0,0,0,0.9)', zIndex: 10000,
               display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
               color: 'white'
            }}>
               <h1 style={{ fontSize: '4rem', textShadow: '0 0 20px #ff0055' }}>Təşəkkürlər, Əfraim müəllim!</h1>
               <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>FULL STACK 5 Sizi sevir!</p>
               <button 
                 onClick={() => setShowEasterEgg(false)}
                 style={{ marginTop: '40px', padding: '10px 30px', background: 'white', color: 'black', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
               >
                 Close
               </button>
            </div>
          )}
        </>
      )}
    </PortfolioProvider>
  );
}

export default App;
