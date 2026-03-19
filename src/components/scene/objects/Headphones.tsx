'use client'

import { useRef, useEffect } from 'react'
import { useObjectClick } from '@/hooks/useObjectClick'
import { useSceneStore } from '@/store/useSceneStore'
import { gsap } from 'gsap'
import type { Group } from 'three'

export function Headphones() {
  const groupRef = useRef<Group>(null!)
  const levitateRef = useRef<gsap.core.Tween | null>(null)
  const activeObject = useSceneStore((s) => s.activeObject)

  const { handleClick } = useObjectClick({
    object: 'headphones',
    meshRef: groupRef,
  })

  // Levitate when active
  useEffect(() => {
    if (!groupRef.current) return

    if (activeObject === 'headphones') {
      levitateRef.current = gsap.to(groupRef.current.position, {
        y: groupRef.current.position.y + 0.08,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    } else {
      levitateRef.current?.kill()
      gsap.to(groupRef.current.position, {
        y: 1.02,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }, [activeObject])

  return (
    <group
      ref={groupRef}
      position={[-1.8, 1.02, 0.5]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* Headband arc */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Left ear cup */}
      <mesh position={[-0.1, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.035, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Right ear cup */}
      <mesh position={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.035, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Subtle matcha accent ring on left cup */}
      <mesh position={[-0.1, 0, 0.019]}>
        <ringGeometry args={[0.038, 0.048, 16]} />
        <meshStandardMaterial color="#4a7c30" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  )
}
