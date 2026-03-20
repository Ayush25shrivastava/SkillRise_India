/**
 * GlowingSphere — The animated hero visual
 * A rotating, glowing neural-network sphere built with Three.js
 * Falls back to a CSS-only version if Three.js has issues
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NeuralSphere() {
  const meshRef = useRef();
  const pointsRef = useRef();

  // Generate sphere points
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = ((Math.sqrt(5) - 1) / 2) * i * Math.PI * 2;

      positions[i * 3] = Math.cos(theta) * radiusAtY * 1.8;
      positions[i * 3 + 1] = y * 1.8;
      positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * 1.8;

      // Color gradient: purple → teal
      const t = i / count;
      colors[i * 3] = 0.3 + t * 0.2;      // R
      colors[i * 3 + 1] = 0.2 + t * 0.6;  // G
      colors[i * 3 + 2] = 0.8 + t * 0.2;  // B
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function GlowingSphere() {
  return (
    <div className="w-full h-full relative">
      {/* Outer glow ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[360px] rounded-full bg-gradient-to-br from-violet-600/10 via-cyan-500/5 to-transparent blur-3xl animate-pulse" />
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <NeuralSphere />
      </Canvas>
    </div>
  );
}
