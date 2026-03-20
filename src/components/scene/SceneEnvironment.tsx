'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { useWeatherStore } from '@/store/useWeatherStore'
import { RainParticles } from './effects/RainParticles'
import { SteamParticles } from './effects/SteamParticles'
import { KoreanBakeryModel } from './objects/KoreanBakeryModel'
import { BakeryInteriorModel } from './objects/BakeryInteriorModel'
import { CelestialBody } from './objects/CelestialBody'
import { StarField } from './effects/StarField'
import { ShootingStars } from './effects/ShootingStars'
import { CloudLayer } from './effects/CloudLayer'
import { FogExp2, Color } from 'three'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { gsap } from 'gsap'

export function SceneEnvironment() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const hasEntered = useMoodStore((s) => s.hasEntered)
  const weatherSky = useWeatherStore((s) => s.skyColor)
  const weatherFog = useWeatherStore((s) => s.fogColor)
  const { scene } = useThree()

  useEffect(() => {
    // Use weather-based sky on exterior; fall back to default blue
    const skyColor = weatherSky ?? '#a8d8f0'
    const fogColor = weatherFog ?? '#a8d8f0'
    if (!scene.fog) {
      scene.fog = new FogExp2(fogColor, 0.012)
    } else {
      ;(scene.fog as FogExp2).color.set(fogColor)
    }
    if (!scene.background) {
      scene.background = new Color(skyColor)
    } else {
      ;(scene.background as Color).set(skyColor)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherSky, weatherFog])

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

  const weatherType = useWeatherStore((s) => s.weatherType)
  const timeOfDay = useWeatherStore((s) => s.timeOfDay)
  const particles = moodConfig?.particles

  // On the exterior (before entering), show weather-driven particles instead of mood particles
  const showWeatherRain = !hasEntered && (weatherType === 'rain' || weatherType === 'storm')
  const showWeatherSnow = !hasEntered && weatherType === 'snow'
  const showWeatherFog  = !hasEntered && weatherType === 'fog'

  return (
    <>
      {/* Exterior — shown before entering the bakery */}
      {!hasEntered && <KoreanBakeryModel />}
      <CelestialBody />

      {/* Interior — shown after entering */}
      {hasEntered && <BakeryInteriorModel />}

      {/* Mood-driven particles (interior / after entering) */}
      {particles?.type === 'rain' && (
        <RainParticles count={particles.density} speed={particles.speed} />
      )}
      {(particles?.type === 'mist' || particles?.type === 'sparkle') && particles.density > 0 && (
        <SteamParticles count={particles.density} speed={particles.speed} type={particles.type} />
      )}

      {/* Weather-driven particles (exterior only) */}
      {showWeatherRain && <RainParticles count={800} speed={0.08} />}
      {showWeatherSnow && <SteamParticles count={400} speed={0.015} type="mist" />}
      {showWeatherFog  && <SteamParticles count={300} speed={0.008} type="mist" />}

      {/* Sky atmosphere — exterior only */}
      {!hasEntered && (timeOfDay === 'night' || timeOfDay === 'dusk') && <StarField />}
      {!hasEntered && timeOfDay === 'night' && <ShootingStars />}
      {!hasEntered && (timeOfDay === 'morning' || timeOfDay === 'midday' || timeOfDay === 'afternoon') && weatherType !== 'storm' && (
        <CloudLayer />
      )}
    </>
  )
}
