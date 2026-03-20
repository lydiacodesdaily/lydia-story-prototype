'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Billboard } from '@react-three/drei'
import { useWeatherStore, getMoonPhase, type TimeOfDay } from '@/store/useWeatherStore'
import { useMoodStore } from '@/store/useMoodStore'

// --- Sun arc ---
// Arc across the sky: east horizon at dawn → overhead at midday → west horizon at dusk.
// Kept low enough to appear in the upper portion of the default 50° FOV camera.

const T_BY_TIME: Record<TimeOfDay, number | null> = {
  dawn:      0.05,
  morning:   0.25,
  midday:    0.50,
  afternoon: 0.75,
  dusk:      0.95,
  night:     null,
}

function sunPosition(t: number): [number, number, number] {
  const angle = t * Math.PI
  // x: swings east (-x) to west (+x)
  // y: peaks at 20 units above ground at midday (visible in upper FOV)
  // z: pushed back so it's behind the bakery
  return [
    -40 * Math.cos(angle),
    Math.max(3, 20 * Math.sin(angle)),
    -45,
  ]
}

// Moon: upper-left sky, visible without orbiting
const MOON_POSITION: [number, number, number] = [-28, 10, -50]

// --- Moon phase canvas ---

function createMoonTexture(phaseDays: number): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  // r is 1/4 of canvas so there's ~1/4 on each side for the glow to fade out
  const cx = size / 2, cy = size / 2, r = size / 4

  ctx.clearRect(0, 0, size, size)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()

  // Bright base
  ctx.fillStyle = '#d8e4f8'
  ctx.fillRect(0, 0, size, size)

  const phase = (phaseDays % 29.53058867) / 29.53058867

  ctx.fillStyle = '#0a1220'

  if (phase < 0.5) {
    // Waxing: right side lit; dark left semicircle
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI / 2, (Math.PI * 3) / 2)
    ctx.lineTo(cx, cy)
    ctx.closePath()
    ctx.fill()

    const termRx = Math.abs(r * Math.cos(2 * Math.PI * phase))
    if (phase < 0.25) {
      // Crescent: dark ellipse shrinks the lit right sliver
      ctx.beginPath()
      ctx.ellipse(cx, cy, termRx, r, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (phase > 0.25) {
      // Gibbous: bright ellipse opens up the dark left half
      ctx.fillStyle = '#d8e4f8'
      ctx.beginPath()
      ctx.ellipse(cx, cy, termRx, r, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    // Waning: left side lit; dark right semicircle
    ctx.beginPath()
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2)
    ctx.lineTo(cx, cy)
    ctx.closePath()
    ctx.fill()

    const wanePhase = phase - 0.5
    const termRx = Math.abs(r * Math.cos(2 * Math.PI * wanePhase))
    if (wanePhase < 0.25) {
      // Gibbous: bright ellipse opens up the dark right half
      ctx.fillStyle = '#d8e4f8'
      ctx.beginPath()
      ctx.ellipse(cx, cy, termRx, r, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Crescent: dark ellipse shrinks the lit left sliver
      ctx.beginPath()
      ctx.ellipse(cx, cy, termRx, r, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()

  // Soft glow — gradient ends at r*1.9 which stays within canvas_half (256), so no square edge
  const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.9)
  glow.addColorStop(0,   'rgba(180, 210, 255, 0.20)')
  glow.addColorStop(0.4, 'rgba(180, 210, 255, 0.10)')
  glow.addColorStop(1,   'rgba(180, 210, 255, 0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

export function CelestialBody() {
  const timeOfDay = useWeatherStore((s) => s.timeOfDay)
  const weatherType = useWeatherStore((s) => s.weatherType)
  const hasEntered = useMoodStore((s) => s.hasEntered)

  const moonPhase = useMemo(() => getMoonPhase(), [])
  const moonTexture = useMemo(
    () => (typeof window !== 'undefined' ? createMoonTexture(moonPhase.phaseDays) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Math.floor(moonPhase.phaseDays)]
  )

  if (hasEntered) return null
  if (weatherType === 'fog' || weatherType === 'storm' || weatherType === 'rain') return null

  const t = T_BY_TIME[timeOfDay]
  const isNight = t === null

  return (
    <>
      {/* Sun — emissive sphere following the time-of-day arc */}
      {!isNight && (
        <group position={sunPosition(t!)}>
          <mesh>
            <sphereGeometry args={[3, 32, 32]} />
            <meshStandardMaterial
              color="#fff8d0"
              emissive="#ffe88a"
              emissiveIntensity={2.5}
              roughness={1}
              metalness={0}
              fog={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[5, 16, 16]} />
            <meshStandardMaterial
              color="#ffe88a"
              emissive="#ffe88a"
              emissiveIntensity={1.0}
              transparent
              opacity={0.14}
              side={THREE.BackSide}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        </group>
      )}

      {/* Moon — Billboard plane with phase-accurate canvas texture */}
      {isNight && moonTexture && (
        <group position={MOON_POSITION}>
          <Billboard follow={true}>
            <mesh scale={[14, 14, 1]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={moonTexture}
                transparent
                depthWrite={false}
                fog={false}
              />
            </mesh>
          </Billboard>
        </group>
      )}
    </>
  )
}
