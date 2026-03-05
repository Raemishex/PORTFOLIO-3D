import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../store/useStore';

const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff'];

const BouncingDVD = () => {
  const isDvdMode = useStore(state => state.isDvdMode);
  const dvdRef = useRef(null);

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ dx: 3, dy: 3 });
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (!isDvdMode) return;

    let animationFrameId;
    const boxSize = { width: 150, height: 75 }; // approximate logo size

    const updatePosition = () => {
      setPosition((prevPos) => {
        let newX = prevPos.x + velocity.dx;
        let newY = prevPos.y + velocity.dy;
        let newDx = velocity.dx;
        let newDy = velocity.dy;
        let hitEdge = false;

        const maxW = window.innerWidth;
        const maxH = window.innerHeight;

        if (newX <= 0 || newX + boxSize.width >= maxW) {
          newDx = -newDx;
          newX = newX <= 0 ? 0 : maxW - boxSize.width;
          hitEdge = true;
        }

        if (newY <= 0 || newY + boxSize.height >= maxH) {
          newDy = -newDy;
          newY = newY <= 0 ? 0 : maxH - boxSize.height;
          hitEdge = true;
        }

        if (hitEdge) {
          setVelocity({ dx: newDx, dy: newDy });
          setColorIndex((prev) => (prev + 1) % COLORS.length);
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDvdMode, velocity]);

  if (!isDvdMode) return null;

  return (
    <div
      ref={dvdRef}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: '150px',
        height: '75px',
        zIndex: 100000,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: '2.5rem',
        fontFamily: "'Inter', sans-serif",
        color: COLORS[colorIndex],
        textShadow: `0 0 10px ${COLORS[colorIndex]}, 2px 2px 0px #000`,
        letterSpacing: '5px',
        willChange: 'transform'
      }}
    >
      DVD
      <div style={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', background: COLORS[colorIndex], color: 'black', padding: '0 10px', borderRadius: '50%', textShadow: 'none', letterSpacing: '0px', fontWeight: 'bold' }}>
        VIDEO
      </div>
    </div>
  );
};

export default BouncingDVD;
