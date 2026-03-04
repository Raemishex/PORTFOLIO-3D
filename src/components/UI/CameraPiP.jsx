import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const CameraPiP = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraPermissionGranted = useStore((state) => state.cameraPermissionGranted);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Hide camera on mobile devices
  if (isTouchDevice()) return null;

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let stream = null;
    let cancelled = false;

    const startPiP = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } }
        });
        if (!cancelled && videoRef.current) {
          videoRef.current.srcObject = stream;
        } else if (cancelled && stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        // Camera access denied or unavailable - PiP will show empty background
      }
    };

    startPiP();

    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  // Ciddi riyazi sərhədlər: Header-in altından (top: 80px) başlayıb ekranın sonuna qədər.
  const dragBounds = {
    top: - (windowSize.height - 180 - 100), // Yuxarıya maksimum getmə (Header-i qoruyur)
    left: - (windowSize.width - 220), // Sola maksimum
    right: 0,
    bottom: 0
  };

  return (
    <motion.div 
      drag
      dragConstraints={dragBounds}
      dragElastic={0.1}
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '180px',
        height: '135px',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        background: 'rgba(15,15,18,0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 5000, 
        cursor: 'grab',
        pointerEvents: 'auto'
      }}
    >
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', transform: 'scaleX(-1)'
        }}
      />
      <canvas
        ref={canvasRef}
        id="mediapipe-canvas"
        width={180}
        height={135}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', transform: 'scaleX(-1)',
          zIndex: 10, pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};

export default CameraPiP;
