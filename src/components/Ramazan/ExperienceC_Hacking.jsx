import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import useRamazanStore from '../../store/useRamazanStore';

const ExperienceC = ({ onComplete }) => {
  const [clicks, setClicks] = useState(0);
  const isHacked = clicks >= 5;
  const { addLog } = useRamazanStore();
  const shieldRef = useRef();
  const textRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (shieldRef.current && !isHacked) {
      shieldRef.current.rotation.y += 0.02;
      shieldRef.current.rotation.x = Math.sin(time) * 0.2;
      // Pulse effect based on clicks
      const scale = 1 + (clicks * 0.1) + Math.sin(time * 5) * 0.05;
      shieldRef.current.scale.set(scale, scale, scale);
    }
    
    if (textRef.current && isHacked) {
      textRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      textRef.current.position.y = Math.sin(time * 2) * 0.2;
    }
  });

  const handleCoreClick = (e) => {
    e.stopPropagation();
    if (isHacked) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks < 5) {
      addLog(`[SİSTEM]: Core firewall zədələndi. ${5 - newClicks} vuruş qaldı!`);
      addLog(`[ACCES GRANTED]: Core sındırıldı! Məlumatlar açılır...`);
      if (onComplete) onComplete();
    }
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={isHacked ? 5 : 2} color={isHacked ? '#00ff9d' : '#ff003c'} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {!isHacked ? (
        <mesh ref={shieldRef} onClick={handleCoreClick} onPointerOver={() => document.body.style.cursor = 'crosshair'} onPointerOut={() => document.body.style.cursor = 'auto'}>
          <icosahedronGeometry args={[2, 1]} />
          <meshPhysicalMaterial 
            color="#ff003c" 
            wireframe={clicks < 2} 
            emissive="#ff003c" 
            emissiveIntensity={clicks * 0.5 + 0.5} 
            roughness={0.1} 
            transmission={0.9} 
            thickness={1}
          />
        </mesh>
      ) : (
        <group ref={textRef}>
           <Center position={[0, 1, 0]}>
             <Text3D font="/fonts/Inter_Bold.json" size={0.8} height={0.2} curveSegments={12}>
               ACCESS GRANTED
               <meshStandardMaterial color="#00ff9d" emissive="#00ff9d" emissiveIntensity={2} />
             </Text3D>
           </Center>
           <Center position={[0, -1, 0]}>
             <Text3D font="/fonts/Inter_Bold.json" size={0.4} height={0.1} curveSegments={12}>
               SKILLS: CYBERSECURITY, AI, REACT
               <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
             </Text3D>
           </Center>
           <Sparkles count={200} scale={10} size={4} speed={0.4} color="#00ff9d" />
        </group>
      )}
    </>
  );
};

export default ExperienceC;
