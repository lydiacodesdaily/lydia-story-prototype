'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { RainParticles } from './effects/RainParticles'
import { SteamParticles } from './effects/SteamParticles'
import { KoreanBakeryModel } from './objects/KoreanBakeryModel'
import { BakeryInteriorModel } from './objects/BakeryInteriorModel'
import { FogExp2, Color } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { gsap } from 'gsap'

export function SceneEnvironment() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const hasEntered = useMoodStore((s) => s.hasEntered)
  const { scene } = useThree()

  useEffect(() => {
    // Set a soft daytime fog and background on mount even before mood is selected
    if (!scene.fog) {
      scene.fog = new FogExp2('#a8d8f0', 0.012)
    }
    if (!scene.background) {
      scene.background = new Color('#a8d8f0')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!moodConfig) return

    const { fogDensity, fogColor } = moodConfig.lighting

    if (!scene.fog) {
      scene.fog = new FogExp2(fogColor, fogDensity)
    } else {
      const fog = scene.fog as FogExp2
      gsap.to(fog, { density: fogDensity, duration: 2 })
      fog.color.set(fogColor)
    }
    // Keep scene background in sync with fog color so sky matches
    if (!scene.background) {
      scene.background = new Color(fogColor)
    } else {
      (scene.background as Color).set(fogColor)
    }
  }, [moodConfig, scene])

  const particles = moodConfig?.particles

  return (
    <>
      {/* Exterior — shown before entering the bakery */}
      {!hasEntered && <KoreanBakeryModel />}

      {/* Interior — shown after entering */}
      {hasEntered && <BakeryInteriorModel />}

      {particles?.type === 'rain' && (
        <RainParticles count={particles.density} speed={particles.speed} />
      )}
      {(particles?.type === 'mist' || particles?.type === 'sparkle') && particles.density > 0 && (
        <SteamParticles count={particles.density} speed={particles.speed} type={particles.type} />
      )}
    </>
  )
}
