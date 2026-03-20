'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX = 5
const SPAWN_MIN = 3.0   // seconds between spawns
const SPAWN_MAX = 9.0

type Star = {
  active: boolean
  age: number
  life: number          // total lifetime in seconds
  head: THREE.Vector3
  dir: THREE.Vector3    // normalized movement direction
  speed: number         // units/sec
  trail: number         // trail length in units
}

const vertShader = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    if (vAlpha <= 0.0) discard;
    gl_FragColor = vec4(1.0, 0.97, 0.92, vAlpha);
  }
`

function spawnStar(): Star {
  const phi = Math.random() * Math.PI * 0.45   // upper portion of sphere
  const theta = Math.random() * Math.PI * 2
  const r = 185

  const head = new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )

  // Random downward-biased direction tangent to the sky
  const yaw = Math.random() * Math.PI * 2
  const pitch = -(0.35 + Math.random() * 0.5)  // negative = downward
  const dir = new THREE.Vector3(
    Math.cos(pitch) * Math.cos(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.sin(yaw),
  ).normalize()

  const speed = 60 + Math.random() * 70    // 60–130 units/sec
  const life = 0.7 + Math.random() * 0.9   // 0.7–1.6 seconds
  const trail = speed * life * 0.35         // trail is ~35% of total travel

  return { active: true, age: 0, life, head, dir, speed, trail }
}

export function ShootingStars() {
  const starsRef = useRef<Star[]>(
    Array.from({ length: MAX }, () => ({
      active: false, age: 0, life: 0,
      head: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      speed: 0, trail: 0,
    }))
  )

  const nextSpawnRef = useRef(SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN))
  const timeSinceSpawnRef = useRef(0)

  // MAX * 2 vertices per line segment (tail + head)
  const positions = useMemo(() => new Float32Array(MAX * 2 * 3), [])
  const alphas = useMemo(() => new Float32Array(MAX * 2), [])

  const posAttrRef = useRef<THREE.BufferAttribute>(null!)
  const alphaAttrRef = useRef<THREE.BufferAttribute>(null!)

  useFrame((_, delta) => {
    const stars = starsRef.current

    // Spawn logic
    timeSinceSpawnRef.current += delta
    if (timeSinceSpawnRef.current >= nextSpawnRef.current) {
      const idx = stars.findIndex(s => !s.active)
      if (idx !== -1) stars[idx] = spawnStar()
      timeSinceSpawnRef.current = 0
      nextSpawnRef.current = SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN)
    }

    for (let i = 0; i < MAX; i++) {
      const star = stars[i]
      const base = i * 6   // 2 vertices × 3 components
      const aBase = i * 2

      if (!star.active) {
        positions.fill(0, base, base + 6)
        alphas[aBase] = 0; alphas[aBase + 1] = 0
        continue
      }

      star.age += delta
      const t = star.age / star.life

      if (t >= 1.0) {
        star.active = false
        positions.fill(0, base, base + 6)
        alphas[aBase] = 0; alphas[aBase + 1] = 0
        continue
      }

      // Move head forward
      star.head.addScaledVector(star.dir, star.speed * delta)

      // Fade in at start, fade out near end
      const fade = t < 0.15 ? t / 0.15 : t > 0.70 ? (1 - t) / 0.30 : 1.0

      // Head
      positions[base + 3] = star.head.x
      positions[base + 4] = star.head.y
      positions[base + 5] = star.head.z

      // Tail: head minus trail offset
      positions[base]     = star.head.x - star.dir.x * star.trail
      positions[base + 1] = star.head.y - star.dir.y * star.trail
      positions[base + 2] = star.head.z - star.dir.z * star.trail

      // Tail alpha = 0, head alpha = fade
      alphas[aBase]     = 0
      alphas[aBase + 1] = fade * 0.95
    }

    if (posAttrRef.current) posAttrRef.current.needsUpdate = true
    if (alphaAttrRef.current) alphaAttrRef.current.needsUpdate = true
  })

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          ref={alphaAttrRef}
          attach="attributes-aAlpha"
          args={[alphas, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertShader}
        fragmentShader={fragShader}
        transparent
        depthWrite={false}
      />
    </lineSegments>
  )
}
