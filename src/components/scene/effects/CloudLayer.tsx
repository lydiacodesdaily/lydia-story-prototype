'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useWeatherStore } from '@/store/useWeatherStore'

function createCloudTexture(): THREE.CanvasTexture {
  const w = 512, h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)

  const blobs: [number, number, number][] = [
    [w * 0.50, h * 0.55, h * 0.42],  // center-large
    [w * 0.22, h * 0.60, h * 0.28],  // left
    [w * 0.78, h * 0.60, h * 0.28],  // right
    [w * 0.36, h * 0.42, h * 0.22],  // upper-left
    [w * 0.64, h * 0.42, h * 0.22],  // upper-right
    [w * 0.50, h * 0.35, h * 0.18],  // top-center
  ]

  blobs.forEach(([cx, cy, r]) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, 'rgba(255,255,255,0.92)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.60)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
  })

  return new THREE.CanvasTexture(canvas)
}

interface CloudConfig {
  id: number
  x: number
  y: number
  z: number
  width: number
  height: number
  opacity: number
  speed: number
}

function makeCloudConfigs(count: number): CloudConfig[] {
  // Deterministic-ish spread using index — no true random so configs are stable
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.7
    const radius = 28 + (i % 3) * 12
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: 18 + (i % 4) * 3,
      z: Math.sin(angle) * radius - 10,
      width: 16 + (i % 3) * 4,
      height: 5.5 + (i % 3) * 1.2,
      opacity: 0.50 + (i % 4) * 0.07,
      speed: 0.35 + (i % 5) * 0.09,
    }
  })
}

const CLOUD_COUNT = 7
const WRAP_LIMIT = 85

export function CloudLayer() {
  const weatherType = useWeatherStore((s) => s.weatherType)

  const cloudTexture = useMemo(
    () => (typeof window !== 'undefined' ? createCloudTexture() : null),
    []
  )

  const configs = useMemo(() => makeCloudConfigs(CLOUD_COUNT), [])

  // Track live x positions per cloud
  const xPositions = useRef<number[]>(configs.map((c) => c.x))

  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const children = groupRef.current.children
    xPositions.current = xPositions.current.map((x, i) => {
      const next = x + configs[i].speed * delta
      const wrapped = next > WRAP_LIMIT ? -WRAP_LIMIT : next
      if (children[i]) children[i].position.x = wrapped
      return wrapped
    })
  })

  if (!cloudTexture) return null

  // Overcast/rainy: more clouds, slightly lower opacity
  const overcast = weatherType === 'rain' || weatherType === 'cloudy'
  const opacityScale = overcast ? 1.3 : 1.0

  return (
    <group ref={groupRef}>
      {configs.map((c) => (
        <group key={c.id} position={[c.x, c.y, c.z]}>
          <Billboard follow={true}>
            <mesh scale={[c.width, c.height, 1]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={cloudTexture}
                transparent
                opacity={Math.min(0.95, c.opacity * opacityScale)}
                depthWrite={false}
              />
            </mesh>
          </Billboard>
        </group>
      ))}
    </group>
  )
}
