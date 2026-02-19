import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import StudentCard from './StudentCard';
import Background from './Background';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';

const Carousel = () => {
  const groupRef = useRef();
  const { currentIndex, isZoomed, students } = usePortfolio();
  const radius = 8;
  const count = students.length;
  const angleStep = (Math.PI * 2) / count;

  // Animate rotation to target index
  useEffect(() => {
    if (groupRef.current) {
      const targetRotation = -currentIndex * angleStep; // Rotate scene opposite to index
      
      gsap.to(groupRef.current.rotation, {
        y: targetRotation,
        duration: 1.5,
        ease: 'power3.out',
      });
      
      // Vertical position adjustment if zoomed?
      // For now, just rotation
    }
  }, [currentIndex, angleStep]);

  useFrame((state) => {
     // Subtle idle rotation when not interacting?
     // Optional
  });

  return (
    <group ref={groupRef}>
      {students.map((student, index) => {
        const angle = index * angleStep;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        // Calculate standard 'active' state for styling
        const isActive = index === currentIndex;

        return (
          <group 
            key={student.id} 
            position={[x, 0, z]} 
            rotation={[0, angle + Math.PI, 0]} 
          >
             <StudentCard 
               student={student} 
               isActive={isActive}
               isZoomed={isActive && isZoomed}
             />
          </group>
        );
      })}
    </group>
  );
};

const CameraController = () => {
   const { isZoomed } = usePortfolio();
   const vec = new THREE.Vector3();

   useFrame((state) => {
      // Smooth camera movement
      // Normal position: [0, 0, 14]
      // Zoomed position: [0, 0, 4] for close up
      const targetZ = isZoomed ? 4 : 14;
      const targetY = isZoomed ? 0 : 0;
      
      state.camera.position.lerp(vec.set(0, targetY, targetZ), 0.05);
      state.camera.lookAt(0, 0, 0);
   });
   return null;
}

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 45 }}
      style={{ background: '#0a0a0a' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={<Text position={[0,0,0]} color="white">Loading...</Text>}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Background />
        
        <group position={[0, -1, 0]}> {/* Lower the carousel slightly */}
          <Carousel />
        </group>
        
        <CameraController />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
