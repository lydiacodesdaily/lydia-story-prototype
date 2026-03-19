'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { RainParticles } from './effects/RainParticles'
import { SteamParticles } from './effects/SteamParticles'
import { FogExp2 } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { gsap } from 'gsap'

export function SceneEnvironment() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const { scene } = useThree()

  useEffect(() => {
    if (!moodConfig) return

    const { fogDensity, fogColor } = moodConfig.lighting

    if (!scene.fog) {
      scene.fog = new FogExp2(fogColor, fogDensity)
    } else {
      const fog = scene.fog as FogExp2
      gsap.to(fog, { density: fogDensity, duration: 2 })
      // Color update is direct — FogExp2 color is a THREE.Color
      fog.color.set(fogColor)
    }
  }, [moodConfig, scene])

  const particles = moodConfig?.particles

  return (
    <>
      {/* Shop floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1208" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#0d1a0e" roughness={0.95} />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 0.5, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 0.8]} />
        <meshStandardMaterial color="#2a1a08" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Counter top */}
      <mesh position={[0, 1.01, -0.2]} castShadow>
        <boxGeometry args={[4.1, 0.05, 0.9]} />
        <meshStandardMaterial color="#3d2812" roughness={0.4} metalness={0.2} />
      </mesh>

      {particles?.type === 'rain' && (
        <RainParticles count={particles.density} speed={particles.speed} />
      )}
      {(particles?.type === 'mist' || particles?.type === 'sparkle') && particles.density > 0 && (
        <SteamParticles count={particles.density} speed={particles.speed} type={particles.type} />
      )}
    </>
  )
}
