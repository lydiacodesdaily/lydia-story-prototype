'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SteamParticlesProps {
  count: number
  speed: number
  type: 'mist' | 'sparkle'
}

export function SteamParticles({ count, speed, type }: SteamParticlesProps) {
  const meshRef = useRef<THREE.Points>(null!)

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const spread = type === 'sparkle' ? 5 : 8
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = Math.random() * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      velocities[i * 3] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 1] = 0.005 + Math.random() * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003

      lifetimes[i] = Math.random()
    }

    return { positions, velocities, lifetimes }
  }, [count, type])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * speed
      pos[i * 3 + 1] += velocities[i * 3 + 1] * speed
      pos[i * 3 + 2] += velocities[i * 3 + 2] * speed

      lifetimes[i] += 0.005 * speed
      if (lifetimes[i] > 1) {
        lifetimes[i] = 0
        const spread = type === 'sparkle' ? 5 : 8
        pos[i * 3] = (Math.random() - 0.5) * spread
        pos[i * 3 + 1] = 0
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  const color = type === 'sparkle' ? '#90ee90' : '#c8d8d0'
  const size = type === 'sparkle' ? 0.025 : 0.04

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
        color={color}
        size={size}
        transparent
        opacity={type === 'sparkle' ? 0.7 : 0.25}
        sizeAttenuation
      />
    </points>
  )
}
