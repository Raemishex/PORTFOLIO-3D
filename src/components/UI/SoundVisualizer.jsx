import React, { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';

const SoundVisualizer = () => {
  const canvasRef = useRef(null);
  const isPlaying = useStore((state) => state.isPlaying);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const BAR_COUNT = 32;
    const bars = Array.from({ length: BAR_COUNT }, () => Math.random() * 0.3);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 60;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying) {
        // Show flat bars when not playing
        bars.forEach((_, i) => { bars[i] *= 0.95; });
      } else {
        // Simulate audio visualization with smooth random
        bars.forEach((_, i) => {
          const target = Math.random() * 0.6 + 0.2;
          bars[i] += (target - bars[i]) * 0.15;
        });
      }

      const barWidth = canvas.width / BAR_COUNT;
      const isDark = document.body.getAttribute('data-theme') !== 'light';

      bars.forEach((val, i) => {
        const barHeight = val * canvas.height;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
        if (isDark) {
          gradient.addColorStop(0, 'rgba(0, 255, 157, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 240, 255, 0.1)');
        } else {
          gradient.addColorStop(0, 'rgba(0, 102, 204, 0.6)');
          gradient.addColorStop(1, 'rgba(0, 119, 237, 0.1)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '60px',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: isPlaying ? 0.6 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
};

export default SoundVisualizer;
