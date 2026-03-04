import { useRef, useEffect, useCallback } from 'react';

const CanvasFireworks = ({ onClose }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  const createBurst = useCallback((x, y) => {
    const count = 30 + Math.floor(Math.random() * 30);
    const hue = Math.random() * 360;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.01 + Math.random() * 0.02,
        size: 1.5 + Math.random() * 2,
        hue: hue + Math.random() * 40 - 20,
        trail: [],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onClick = (e) => {
      createBurst(e.clientX, e.clientY);
    };
    canvas.addEventListener('click', onClick);

    // Auto-launch fireworks periodically
    let autoInterval = setInterval(() => {
      createBurst(
        100 + Math.random() * (canvas.width - 200),
        100 + Math.random() * (canvas.height - 200)
      );
    }, 3000);

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 8, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.99;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) {
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
          }
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.3})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.life})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', onClick);
      clearInterval(autoInterval);
    };
  }, [createBurst]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 15000 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'auto',
        }}
      />
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '1.2rem', width: '40px', height: '40px',
            borderRadius: '50%', cursor: 'pointer', zIndex: 15001,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >×</button>
      )}
      <p style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '3px',
        color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', pointerEvents: 'none',
      }}>Click anywhere for fireworks</p>
    </div>
  );
};

export default CanvasFireworks;
