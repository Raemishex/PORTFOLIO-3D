import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { getStudentAge } from '../data/students';
import gsap from 'gsap';

const StudentCard = ({ student, position, isActive, isZoomed, onClick }) => {
  const meshRef = useRef();
  
  // Basic floating animation
  useFrame((state) => {
    if (meshRef.current && !isActive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 4.5, 0.2]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          color={isActive ? "#ffffff" : "#aaaaaa"}
          transmission={0.95}
          roughness={0}
        />
      </mesh>
      
      {/* Content Layer */}
      <group position={[0, 0, 0.16]}>
        {/* Programmatic Avatar */}
        {/* Programmatic Avatar */}
        {(() => {
          const texture = useMemo(() => {
            const initials = student.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Random background color
            const hue = (student.name.length * 50) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fillRect(0, 0, 256, 256);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 120px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initials, 128, 128);
            
            return new THREE.CanvasTexture(canvas);
          }, [student.name]);

          return (
            <mesh position={[0, 0.5, 0]}>
              <planeGeometry args={[2, 2]} />
              <meshBasicMaterial map={texture} transparent opacity={0.9} />
            </mesh>
          );
        })()}

        <Text
          position={[0, -1.2, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
          textAlign="center"
        >
          {student.name}
        </Text>
        
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.18}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          Age: {getStudentAge(student)}
        </Text>
      </group>
    </group>
  );
};

export default StudentCard;
