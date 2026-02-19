import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GradientMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#ff0055') },
    uColor2: { value: new THREE.Color('#0055ff') },
    uColor3: { value: new THREE.Color('#00ff55') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Simple fluid distortion
      float t = uTime * 0.5;
      float noise = sin(uv.x * 10.0 + t) * cos(uv.y * 10.0 + t) * 0.1;
      
      vec3 color = mix(uColor1, uColor2, uv.y + noise);
      color = mix(color, uColor3, sin(uv.x + uv.y + t) * 0.5 + 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Background = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[20, 10, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial args={[GradientMaterial]} />
    </mesh>
  );
};

export default Background;
