'use client';

import React, { useRef } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import {
  WireframeGeometry,
  LineSegments,
  LineBasicMaterial,
  IcosahedronGeometry,
  Group,
} from 'three';

function createD20Wireframe(
  radius: number = 0.5,
  scale: number = 1,
): LineSegments {
  const geometry = new WireframeGeometry(new IcosahedronGeometry(radius, 0));
  const material = new LineBasicMaterial({
    color: 0x02816f,
    opacity: 0.5,
    transparent: true,
  });
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
      // groupRef.current.rotation.y = time * 0.1;

      // Die rotation
      if (wireD20Ref.current) {
        wireD20Ref.current.rotation.x = Math.sin(time) * 0.5;
        wireD20Ref.current.rotation.z = Math.cos(time) * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Wireframe D20 */}
      <primitive ref={wireD20Ref} object={createD20Wireframe()} />
    </group>
  );
}
