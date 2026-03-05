import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// Purely lighting and environment for the 3D CSS Background Effect

const CameraRig = () => {
  const target = new THREE.Vector3();

  useFrame((state) => {
    const headOffset = useStore.getState().headOffset;
    if (headOffset) {
      // Scale normalized movement [-1, 1] to camera world units
      target.set(headOffset.x * 2, headOffset.y * 2, 5);
      // LERP camera position for smooth holographic effect
      state.camera.position.lerp(target, 0.05);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

const Scene = () => {
  const theme = useStore((state) => state.theme);

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      role="region"
      aria-label="Interactive 3D Background Scene"
      aria-hidden="true"
    >
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <CameraRig />
        {/* Dynamic Background handled via CSS CSS background-image */}
        
        <ambientLight intensity={theme === 'dark' ? 0.3 : 0.8} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={theme === 'dark' ? 1.5 : 0.8} 
          castShadow 
        />
        
        <Suspense fallback={null}>
          <Environment preset={theme === 'dark' ? 'city' : 'studio'} />
          
          <SoftShadows size={20} samples={16} focus={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
