import React, { useEffect, useState } from 'react';
import anime from 'animejs';

const LoadingScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Initial animation
    anime({
      targets: '.loader-text span',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
      duration: 1500,
      complete: () => {
         setTimeout(() => {
            // Unmount animation
            anime({
               targets: '.loader-container',
               opacity: 0,
               duration: 800,
               easing: 'easeInOutQuad',
               complete: () => {
                  setVisible(false);
                  onComplete?.();
               }
            });
         }, 1000);
      }
    });
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="loader-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
       <h1 className="loader-text" style={{ fontSize: '3rem', fontWeight: 'bold', display: 'flex', gap: '0.2em' }}>
         {'FULL STACK 5'.split('').map((char, i) => (
           <span key={i} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</span>
         ))}
       </h1>
       <div className="progress-bar" style={{
         width: '200px',
         height: '2px',
         background: '#333',
         marginTop: '20px',
         overflow: 'hidden'
       }}>
          <div style={{
             width: '100%',
             height: '100%',
             background: 'white',
             animation: 'loadProgress 2.5s ease-in-out forwards'
          }} />
       </div>
       <style>{`
         @keyframes loadProgress {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(0); }
         }
       `}</style>
    </div>
  );
};

export default LoadingScreen;
