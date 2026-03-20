'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 1500
const SPHERE_RADIUS = 200

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vAlpha = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 2.2 + aPhase + 1.0));
    float twinkle = 0.5 + 0.5 * sin(uTime * 1.8 + aPhase);
    gl_PointSize = aSize * (0.7 + 0.3 * twinkle);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = vAlpha * (1.0 - d * 1.8);
    gl_FragColor = vec4(1.0, 0.97, 0.92, alpha);
  }
`

export function StarField() {
  const pointsRef = useRef<THREE.Points>(null!)

  const { positions, sizes, phases } = useMemo(() => {
    const pos: number[] = []
    const sz: number[] = []
    const ph: number[] = []

    let added = 0
    while (added < COUNT) {
      // Uniform distribution on sphere
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)
      const y = SPHERE_RADIUS * Math.cos(phi)  // Y-up: phi=0 is top, phi=π is bottom
      const z = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)

      // Only keep stars in the upper hemisphere + sides (not too far below horizon)
      if (y < -50) continue

      pos.push(x, y, z)
      sz.push(1.8 + Math.random() * 4.0)  // varied sizes: small to large
      ph.push(Math.random() * Math.PI * 2)
      added++
    }

    return {
      positions: new Float32Array(pos),
      sizes: new Float32Array(sz),
      phases: new Float32Array(ph),
    }
  }, [])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
