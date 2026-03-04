import React, { useEffect, useRef } from 'react';

const NoiseOverlay = ({ opacity = 0.03 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    const generateNoise = () => {
      const imageData = ctx.createImageData(256, 256);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    generateNoise();

    // Animate noise at low framerate for subtle film grain feel
    let animId;
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame % 4 === 0) generateNoise(); // ~15fps
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animId);
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
        zIndex: 9990,
        opacity,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export default NoiseOverlay;
