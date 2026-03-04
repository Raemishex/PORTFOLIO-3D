import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getStudentAge } from '../data/students';

// position üçün standart [0, 0, 0] dəyərini təyin edirik
const StudentCard = ({ student, position = [0, 0, 0], isActive, isZoomed, onClick }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);
  
  // Default Initial Texture (Şəkil yoxdursa)
  const defaultTexture = useMemo(() => {
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

  // Əgər student.image varsa, şəkli yüklə. Yoxdursa default inicial olanı göstər.
  useEffect(() => {
    if (student.image) {
      const loader = new THREE.TextureLoader();
      loader.load(
        student.image,
        (loadedTexture) => {
          // Gözəl keyfiyyət üçün
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error(`Error loading image for ${student.name}:`, error);
          setTexture(defaultTexture);
        }
      );
    } else {
      setTexture(defaultTexture);
    }
  }, [student.image, defaultTexture, student.name]);

  useFrame((state) => {
    if (meshRef.current && !isActive) {
      // Artıq position array-i mövcud olduğu üçün çökməyəcək
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 4.5, 0.2]} />
        <meshPhysicalMaterial
          color={isActive ? "#ffffff" : "#cccccc"}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.8}
          transmission={0} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <group position={[0, 0, 0.16]}>
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[2, 2]} />
          {texture && <meshBasicMaterial map={texture} transparent opacity={0.9} />}
        </mesh>

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
