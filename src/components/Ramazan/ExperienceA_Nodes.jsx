import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useRamazanStore from '../../store/useRamazanStore';

const COUNT = 300; // Number of floating nodes

const Particles = ({ onComplete }) => {
  const meshRef = useRef();
  const { addLog } = useRamazanStore();
  const lastLogTime = useRef(0);
  const [interactionCount, setInteractionCount] = React.useState(0);

  // Generate random positions and colors for spheres
  const particles = useMemo(() => {
    const temp = [];
    const colorA = new THREE.Color('#00ff9d'); // Neon Green
    const colorB = new THREE.Color('#a755ff'); // Purple
    
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      const v = new THREE.Vector3(x, y, z);
      const isGreen = Math.random() > 0.5;
      const c = isGreen ? colorA : colorB;
      
      temp.push({ 
        pos: v,
        basePos: v.clone(), 
        velocity: new THREE.Vector3(),
        color: c.toArray()
      });
    }
    return temp;
  }, []);

  const dummy = new THREE.Object3D();
  const colorArray = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    particles.forEach((p, i) => {
      arr[i * 3] = p.color[0];
      arr[i * 3 + 1] = p.color[1];
      arr[i * 3 + 2] = p.color[2];
    });
    return arr;
  }, [particles]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    let interactionOccurred = false;

    // Convert mouse to 3D world space loosely
    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;
    const mousePos = new THREE.Vector3(mouseX, mouseY, 0); // Assuming near plane Z=0

    particles.forEach((particle, i) => {
      // Magnetic Repulsion Logic
      const dist = particle.pos.distanceTo(mousePos);
      if (dist < 4) { // Interaction Radius
        const force = mousePos.clone().sub(particle.pos).normalize().multiplyScalar(-0.1);
        particle.velocity.add(force);
        interactionOccurred = true;
      }

      // Return to base position softly
      const returnForce = particle.basePos.clone().sub(particle.pos).multiplyScalar(0.01);
      particle.velocity.add(returnForce);
      particle.velocity.multiplyScalar(0.9); // Damping/Friction

      particle.pos.add(particle.velocity);

      // Add floating Sine wave noise
      const time = state.clock.elapsedTime;
      particle.pos.y += Math.sin(time * 2 + particle.basePos.x) * 0.01;

      // Update instanced mesh
      dummy.position.copy(particle.pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Log Interaction loosely (debounce to avoid spamming terminal)
    if (interactionOccurred && state.clock.elapsedTime - lastLogTime.current > 3) {
      addLog(`[AURA_SİSTEMİ]: Maqnit sahəsində ${Math.floor(Math.random()*50)+10} anomaliya aşkarlandı.`);
      lastLogTime.current = state.clock.elapsedTime;
      
      // Update interaction count for win condition
      setInteractionCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3 && onComplete) onComplete();
        return newCount;
      });
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[0.1, 16, 16]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshPhysicalMaterial vertexColors toneMapped={false} emissiveIntensity={2} roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
};

const ExperienceA = ({ onComplete }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00ff9d" />
      <Particles onComplete={onComplete} />
    </>
  );
};

export default ExperienceA;
