import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';

const CursorManager = () => {
  const { students, currentIndex } = usePortfolio();
  const cursorType = students[currentIndex]?.cursorType || 'default';
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  // Update mouse position
  useEffect(() => {
    const onMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Basic cursor follow
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Trail Effect Logic
  useEffect(() => {
    if (cursorType !== 'trail') return;
    
    const canvas = trailRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let points = [];
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#00ffcc'; // Cyan trail
      
      points.push({ x: mousePos.x, y: mousePos.y, age: 0 });
      
      if (points.length > 20) points.shift();
      
      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();
      
      requestAnimationFrame(render);
    };
    
    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cursorType, mousePos]);

  // Spotlight Effect
  if (cursorType === 'spotlight') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.85)',
          maskImage: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`, // Inverse mask: transparent hole
          // Wait, mask-image usually hides where transparent. We want to SHOW where the circle is.
          // Correct: mask-image: radial-gradient(black, transparent) -> shows center.
          // But we want to DARKEN everything ELSE.
          // So we need a full black overlay with a HOLE.
          // Mask composite?
          // Easier: Radial gradient background for the overlay itself.
          background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`
        }}
      />
    );
  }

  // Football (Springy) Effect
  if (cursorType === 'football') {
     return (
       <div 
         ref={cursorRef}
         style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: '2px solid black',
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
         }}
       >
         ⚽
       </div>
     );
  }

  // Trail Canvas
  if (cursorType === 'trail') {
    return (
      <canvas
        ref={trailRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
    );
  }

  // Default Custom Cursor (Optional)
  return (
      <div 
         ref={cursorRef}
         style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s, height 0.2s'
         }}
       />
  );
};

export default CursorManager;
