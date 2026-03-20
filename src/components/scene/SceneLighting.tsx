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
    ambientIntensity: 1.2,
    ambientColor: '#e8f0f8',
    keyColor: '#fff8e8',
    keyIntensity: 3.0,
    accentColor: '#c8dff0',
    accentIntensity: 0.8,
  }

  return (
    <>
      {/* Sky/ground hemisphere for natural outdoor fill */}
      <hemisphereLight args={['#a8c8e8', '#8aab7a', 1.5]} />
      <ambientLight
        ref={ambientRef}
        intensity={initialLighting.ambientIntensity}
        color={initialLighting.ambientColor}
      />
      <directionalLight
        ref={keyRef}
        position={[5, 10, 4]}
        intensity={initialLighting.keyIntensity}
        color={initialLighting.keyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight
        ref={accentRef}
        position={[-3, 3, 2]}
        intensity={initialLighting.accentIntensity}
        color={initialLighting.accentColor}
        distance={12}
      />
    </>
  )
}
