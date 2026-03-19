'use client'

import { useRef, useCallback } from 'react'
import { useObjectClick } from '@/hooks/useObjectClick'
import { gsap } from 'gsap'
import type { Group, Mesh } from 'three'

export function Journal() {
  const groupRef = useRef<Group>(null!)
  const coverRef = useRef<Mesh>(null!)

  const onAnimate = useCallback(async () => {
    if (!coverRef.current) return
    await new Promise<void>((resolve) => {
      gsap.to(coverRef.current.rotation, {
        y: -Math.PI * 0.6,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: resolve,
      })
    })
  }, [])

  const { handleClick } = useObjectClick({
    object: 'journal',
    meshRef: groupRef,
    onAnimate,
  })

  return (
    <group
      ref={groupRef}
      position={[0.8, 1.02, 0]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Journal body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.24, 0.03]} />
        <meshStandardMaterial color="#2d4a1e" roughness={0.8} />
      </mesh>

      {/* Journal cover (opens on click) */}
      <mesh ref={coverRef} position={[-0.09, 0, 0.016]} castShadow>
        <boxGeometry args={[0.18, 0.24, 0.005]} />
        <meshStandardMaterial color="#1d3a12" roughness={0.7} />
      </mesh>

      {/* Pages suggestion */}
      <mesh position={[0.01, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 0.22, 0.025]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>

      {/* Title line */}
      <mesh position={[0, 0.05, 0.018]}>
        <boxGeometry args={[0.1, 0.005, 0.001]} />
        <meshStandardMaterial color="#4a7c30" />
      </mesh>
    </group>
  )
}
