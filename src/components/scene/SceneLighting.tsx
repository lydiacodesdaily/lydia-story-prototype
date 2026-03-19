'use client'

import { useRef, useEffect } from 'react'
import { useMoodStore } from '@/store/useMoodStore'
import { gsap } from 'gsap'
import type { AmbientLight, DirectionalLight, PointLight } from 'three'
import * as THREE from 'three'

export function SceneLighting() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const ambientRef = useRef<AmbientLight>(null!)
  const keyRef = useRef<DirectionalLight>(null!)
  const accentRef = useRef<PointLight>(null!)

  useEffect(() => {
    if (!moodConfig) return
    const { lighting } = moodConfig

    const dur = 2.0

    // Animate ambient
    if (ambientRef.current) {
      gsap.to(ambientRef.current, { intensity: lighting.ambientIntensity, duration: dur })
      gsap.to(ambientRef.current.color, {
        r: new THREE.Color(lighting.ambientColor).r,
        g: new THREE.Color(lighting.ambientColor).g,
        b: new THREE.Color(lighting.ambientColor).b,
        duration: dur,
      })
    }

    // Animate key light
    if (keyRef.current) {
      gsap.to(keyRef.current, { intensity: lighting.keyIntensity, duration: dur })
      gsap.to(keyRef.current.color, {
        r: new THREE.Color(lighting.keyColor).r,
        g: new THREE.Color(lighting.keyColor).g,
        b: new THREE.Color(lighting.keyColor).b,
        duration: dur,
      })
    }

    // Animate accent
    if (accentRef.current) {
      gsap.to(accentRef.current, { intensity: lighting.accentIntensity, duration: dur })
      gsap.to(accentRef.current.color, {
        r: new THREE.Color(lighting.accentColor).r,
        g: new THREE.Color(lighting.accentColor).g,
        b: new THREE.Color(lighting.accentColor).b,
        duration: dur,
      })
    }
  }, [moodConfig])

  const initialLighting = moodConfig?.lighting ?? {
    ambientIntensity: 0.4,
    ambientColor: '#b8d4e8',
    keyColor: '#c8dff0',
    keyIntensity: 1.2,
    accentColor: '#90b8d0',
    accentIntensity: 0.6,
  }

  return (
    <>
      <ambientLight
        ref={ambientRef}
        intensity={initialLighting.ambientIntensity}
        color={initialLighting.ambientColor}
      />
      <directionalLight
        ref={keyRef}
        position={[3, 5, 2]}
        intensity={initialLighting.keyIntensity}
        color={initialLighting.keyColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        ref={accentRef}
        position={[-2, 2, 1]}
        intensity={initialLighting.accentIntensity}
        color={initialLighting.accentColor}
        distance={8}
      />
    </>
  )
}
