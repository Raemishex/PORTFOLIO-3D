import React, { useState } from 'react';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import useRamazanStore from '../../store/useRamazanStore';

const Plane = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#0a0a0a" />
    </mesh>
  );
};

// Invisible walls to keep cubes from falling off forever
const Wall = (props) => {
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

const Cube = ({ position, color, ...props }) => {
  const [ref, api] = useBox(() => ({ mass: 1, position, args: [1, 1, 1] }));
  const [activeColor, setActiveColor] = useState(color);
  const { addLog } = useRamazanStore();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    // Apply massive impulse upwards and outwards
    const xImpulse = (Math.random() - 0.5) * 20;
    const zImpulse = (Math.random() - 0.5) * 20;
    api.applyImpulse([xImpulse, 25, zImpulse], [0, 0, 0]);
    
    setActiveColor('#ff003c'); // Turn red
    addLog(`[SİSTEM]: ${ref.current.uuid.substring(0, 5)} obyektinə impuls verildi! Stabilizasiya pozulub.`);

    setTimeout(() => {
      setActiveColor(color);
    }, 1500);
    
    if (props.onClick) props.onClick();
  };

  return (
    <mesh ref={ref} castShadow receiveShadow onPointerDown={handlePointerDown}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={activeColor} 
        emissive={activeColor} 
        emissiveIntensity={0.5} 
        metalness={0.5} 
        roughness={0.2} 
      />
    </mesh>
  );
};

const ExperienceB = ({ onComplete }) => {
  const [clickedCount, setClickedCount] = useState(0);

  const handleCubeClick = () => {
    setClickedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 && onComplete) onComplete();
      return newCount;
    });
  };

  const cubes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 10, i * 1.5 + 5, (Math.random() - 0.5) * 10],
    color: Math.random() > 0.5 ? '#00ff9d' : '#a755ff'
  }));

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      
      <Physics gravity={[0, -9.81, 0]}>
        <Plane />
        <Wall position={[0, 0, -10]} />
        <Wall position={[0, 0, 10]} rotation={[0, Math.PI, 0]} />
        <Wall position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Wall position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        
        {cubes.map((cube) => (
          <Cube key={cube.id} position={cube.position} color={cube.color} onClick={handleCubeClick} />
        ))}
      </Physics>
    </>
  );
};

export default ExperienceB;
