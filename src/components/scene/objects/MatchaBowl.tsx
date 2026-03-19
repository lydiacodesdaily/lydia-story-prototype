'use client'

import { useRef, useCallback } from 'react'
import { useObjectClick } from '@/hooks/useObjectClick'
import { gsap } from 'gsap'
import type { Group } from 'three'

export function MatchaBowl() {
  const groupRef = useRef<Group>(null!)

  const onAnimate = useCallback(async () => {
    if (!groupRef.current) return
    await new Promise<void>((resolve) => {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 6,
        duration: 1.2,
        ease: 'power1.inOut',
        onComplete: resolve,
      })
    })
  }, [])

  const { handleClick } = useObjectClick({
    object: 'matcha-bowl',
    meshRef: groupRef,
    onAnimate,
  })

  return (
    <group
      ref={groupRef}
      position={[-1.2, 1.02, 0]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Bowl base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.12, 0.1, 32]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Bowl rim */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.04, 32]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Matcha liquid */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.01, 32]} />
        <meshStandardMaterial color="#4a7c30" roughness={0.2} metalness={0.0} />
      </mesh>

      {/* Steam suggestion (small spheres) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            (Math.sin(i * 2.1) * 0.06),
            0.12 + i * 0.06,
            (Math.cos(i * 2.1) * 0.04),
          ]}
        >
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#c8e8c0" transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
    </group>
  )
}
