'use client'

import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useObjectClick } from '@/hooks/useObjectClick'
import { gsap } from 'gsap'
import type { Group } from 'three'

export function SlothCharacter() {
  const groupRef = useRef<Group>(null!)
  const headRef = useRef<Group>(null!)
  const bodyRef = useRef<Group>(null!)
  const time = useRef(0)

  // Idle animation — gentle breathing + head bob
  useFrame((_, delta) => {
    time.current += delta
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(time.current * 0.5) * 0.01
    }
    if (headRef.current && !groupRef.current?.userData.isReacting) {
      headRef.current.rotation.y = Math.sin(time.current * 0.3) * 0.08
    }
  })

  const onAnimate = useCallback(async () => {
    if (!headRef.current) return
    groupRef.current.userData.isReacting = true
    await new Promise<void>((resolve) => {
      gsap.to(headRef.current!.rotation, {
        y: 0,
        x: 0.15,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(headRef.current!.rotation, {
            x: 0,
            duration: 0.6,
            delay: 0.8,
            ease: 'power1.inOut',
            onComplete: () => {
              groupRef.current.userData.isReacting = false
              resolve()
            },
          })
        },
      })
    })
  }, [])

  const { handleClick } = useObjectClick({
    object: 'sloth',
    meshRef: groupRef,
    onAnimate,
  })

  return (
    <group
      ref={groupRef}
      position={[0, 1.4, -1]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Body */}
      <group ref={bodyRef}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.22, 8, 16]} />
          <meshStandardMaterial color="#8a7060" roughness={0.9} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.16, 0.05, 0]} rotation={[0, 0, Math.PI * 0.3]} castShadow>
          <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
          <meshStandardMaterial color="#7a6050" roughness={0.9} />
        </mesh>
        <mesh position={[0.16, 0.05, 0]} rotation={[0, 0, -Math.PI * 0.3]} castShadow>
          <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
          <meshStandardMaterial color="#7a6050" roughness={0.9} />
        </mesh>
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 0.25, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#9a8070" roughness={0.9} />
        </mesh>

        {/* Face mask */}
        <mesh position={[0, -0.02, 0.1]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#c8b090" roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.055, 0.02, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a0a00" roughness={0.5} />
        </mesh>
        <mesh position={[0.055, 0.02, 0.12]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#1a0a00" roughness={0.5} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.01, 0.135]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial color="#6a4030" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}
