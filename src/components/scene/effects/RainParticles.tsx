'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RainParticlesProps {
  count: number
  speed: number
}

export function RainParticles({ count, speed }: RainParticlesProps) {
  const meshRef = useRef<THREE.Points>(null!)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      velocities[i] = 0.02 + Math.random() * 0.03
    }

    return { positions, velocities }
  }, [count])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= velocities[i] * speed

      if (pos[i * 3 + 1] < -1) {
        pos[i * 3 + 1] = 6
        pos[i * 3] = (Math.random() - 0.5) * 10
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a0c8e0"
        size={0.015}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}
