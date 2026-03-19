'use client'

import { useRef } from 'react'
import { useObjectClick } from '@/hooks/useObjectClick'
import type { Group } from 'three'

export function WindowFrame() {
  const groupRef = useRef<Group>(null!)

  const { handleClick } = useObjectClick({
    object: 'window',
    meshRef: groupRef,
  })

  return (
    <group
      ref={groupRef}
      position={[0, 2.2, -2.95]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Window glass */}
      <mesh>
        <planeGeometry args={[1.2, 0.9]} />
        <meshStandardMaterial
          color="#8fb8d0"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Frame - top */}
      <mesh position={[0, 0.47, 0.01]}>
        <boxGeometry args={[1.28, 0.06, 0.04]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>
      {/* Frame - bottom */}
      <mesh position={[0, -0.47, 0.01]}>
        <boxGeometry args={[1.28, 0.06, 0.04]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>
      {/* Frame - left */}
      <mesh position={[-0.61, 0, 0.01]}>
        <boxGeometry args={[0.06, 0.9, 0.04]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>
      {/* Frame - right */}
      <mesh position={[0.61, 0, 0.01]}>
        <boxGeometry args={[0.06, 0.9, 0.04]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>

      {/* Cross bars */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.2, 0.03, 0.02]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.03, 0.9, 0.02]} />
        <meshStandardMaterial color="#5a3820" roughness={0.7} />
      </mesh>

      {/* Subtle glow from window light */}
      <pointLight position={[0, 0, 0.5]} intensity={0.3} color="#c8dff0" distance={3} />
    </group>
  )
}
