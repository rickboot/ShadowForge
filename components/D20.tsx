'use client';

import React, { useRef } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { Mesh, WireframeGeometry, LineSegments, LineBasicMaterial, IcosahedronGeometry, Group } from 'three';

function createD20Wireframe(radius: number = 0.5, scale: number = 1): LineSegments {
  const geometry = new WireframeGeometry(new IcosahedronGeometry(radius, 0));
  const material = new LineBasicMaterial({ color: 0x02816F, opacity: 1, transparent: true });
  const wireframe = new LineSegments(geometry, material);
  wireframe.scale.set(scale, scale, scale);
  return wireframe;
}

export default function ShadowForgeLogo3D(props: ThreeElements['group']) {
  const groupRef = useRef<Group>(null!);
  const wireD20Ref = useRef<LineSegments>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Rotate the entire group
      groupRef.current.rotation.y = time * 0.2;

      // Die rotation
      if (wireD20Ref.current) {
        wireD20Ref.current.rotation.x = Math.sin(time) * 0.2;
        wireD20Ref.current.rotation.z = Math.cos(time) * 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Wireframe D20 */}
      <primitive 
        ref={wireD20Ref} 
        object={createD20Wireframe()} 
      />
    </group>
  );
}
