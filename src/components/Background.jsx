import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PremiumGradientMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0f0c29') }, // Dark
    uColor2: { value: new THREE.Color('#302b63') }, // Purple
    uColor3: { value: new THREE.Color('#24243e') }, // Deep Blue
    uAccent: { value: new THREE.Color('#ff0055') }, // Neon Accent
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
    uniform vec3 uAccent;
    varying vec2 vUv;

    // Simplex noise function (simplified)
    float random (in vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.2;
      
      // Dynamic noise pattern
      float n = noise(uv * 3.0 + t);
      float n2 = noise(uv * 6.0 - t * 1.5);
      
      // Mix colors based on noise
      vec3 color = mix(uColor1, uColor2, uv.y + n * 0.2);
      color = mix(color, uColor3, n2);
      
      // Subtle accent pulse
      float pulse = sin(uv.x * 10.0 + t * 2.0) * cos(uv.y * 10.0 + t * 2.0);
      color += uAccent * pulse * 0.05; // Very subtle glow
      
      // Vignette
      float dist = distance(uv, vec2(0.5));
      color *= 1.0 - dist * 0.5;

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
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[30, 15, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial args={[PremiumGradientMaterial]} />
    </mesh>
  );
};

export default Background;
