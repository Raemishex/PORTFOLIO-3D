import React, { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';

const CursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const trail = [];
    const MAX_POINTS = 30;
    let mouseX = -100;
    let mouseY = -100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Also track hand coordinates
      const hand = useStore.getState().handCoordinates;
      const x = hand ? hand.x * canvas.width : mouseX;
      const y = hand ? hand.y * canvas.height : mouseY;

      trail.push({ x, y, age: 0 });
      if (trail.length > MAX_POINTS) trail.shift();

      const isDark = document.body.getAttribute('data-theme') !== 'light';

      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const progress = i / trail.length;
        const radius = progress * 6 + 1;
        const alpha = progress * 0.4;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = `rgba(0, 255, 157, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 102, 204, ${alpha})`;
        }
        ctx.fill();
      }

      // Draw connecting line
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = isDark ? 'rgba(0, 255, 157, 0.08)' : 'rgba(0, 102, 204, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9991,
      }}
    />
  );
};

export default CursorTrail;
