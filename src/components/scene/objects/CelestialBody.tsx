'use client'

import * as THREE from 'three'
import { useWeatherStore, type TimeOfDay } from '@/store/useWeatherStore'
import { useMoodStore } from '@/store/useMoodStore'

const T_BY_TIME: Record<TimeOfDay, number | null> = {
  dawn:      0.05,
  morning:   0.25,
  midday:    0.50,
  afternoon: 0.75,
  dusk:      0.95,
  night:     null, // sun hidden
}

const ARC_RADIUS = 70
const ARC_Z = -30

function sunPosition(t: number): [number, number, number] {
  const angle = t * Math.PI
  return [
    -ARC_RADIUS * Math.cos(angle),
    Math.max(4, ARC_RADIUS * Math.sin(angle)),
    ARC_Z,
  ]
}

const MOON_POSITION: [number, number, number] = [-45, 55, -40]

export function CelestialBody() {
  const timeOfDay = useWeatherStore((s) => s.timeOfDay)
  const weatherType = useWeatherStore((s) => s.weatherType)
  const hasEntered = useMoodStore((s) => s.hasEntered)

  // Hide inside the bakery or during obscuring weather
  if (hasEntered) return null
  if (weatherType === 'fog' || weatherType === 'storm' || weatherType === 'rain') return null

  const t = T_BY_TIME[timeOfDay]
  const isNight = t === null
  const position = isNight ? MOON_POSITION : sunPosition(t!)

  const color       = isNight ? '#d8e4f0' : '#fff8d0'
  const emissive    = isNight ? '#c8d8f0' : '#ffe88a'
  const intensity   = isNight ? 1.8 : 2.2
  const radius      = isNight ? 2.2 : 3.5
  const haloRadius  = isNight ? 3.4 : 5.5
  const haloOpacity = isNight ? 0.10 : 0.12

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={intensity}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[haloRadius, 16, 16]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={intensity * 0.4}
          transparent
          opacity={haloOpacity}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
