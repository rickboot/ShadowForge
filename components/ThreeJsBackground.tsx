'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import ThreeJsD20 from './ThreeJsD20';

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '950px',
        }}
      >
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={60} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <ThreeJsD20 scale={8} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
