import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const COLORS = ['#00ff9d', '#00F0FF', '#FF2A54', '#FFD700', '#A855F7', '#ffffff'];
const PARTICLE_COUNT = 80;

const ConfettiBurst = () => {
  const canvasRef = useRef(null);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const isEnteringProfile = location.pathname.startsWith('/student') && !prevPath.current.startsWith('/student');
    prevPath.current = location.pathname;

    if (!isEnteringProfile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
      const speed = 4 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 3 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.12 + Math.random() * 0.08,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    let animId;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let allDead = true;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        if (p.opacity <= 0) return;
        allDead = false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (!allDead && frame < 180) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [location.pathname]);

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
        zIndex: 9995,
      }}
    />
  );
};

export default ConfettiBurst;
