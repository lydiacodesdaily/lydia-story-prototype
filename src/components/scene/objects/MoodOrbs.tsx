'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap'
import type { Mesh } from 'three'
import { useMoodStore } from '@/store/useMoodStore'
import { MOOD_CONFIGS } from '@/lib/moodConfig'
import type { Mood } from '@/types/mood'

const MOOD_LIST = Object.values(MOOD_CONFIGS)
const RING_RADIUS = 2.2
const RING_HEIGHT = 1.4

interface MoodOrbProps {
  mood: Mood
  label: string
  emoji: string
  color: string
  index: number
  total: number
}

function MoodOrb({ mood, label, emoji, color, index, total }: MoodOrbProps) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const pendingMood = useMoodStore((s) => s.pendingMood)
  const setPendingMood = useMoodStore((s) => s.setPendingMood)

  const isSelected = pendingMood === mood
  const isDimmed = pendingMood !== null && !isSelected

  const angle = (index / total) * Math.PI * 2
  const baseX = RING_RADIUS * Math.sin(angle)
  const baseZ = RING_RADIUS * Math.cos(angle)
  const phaseOffset = index * 1.3

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.position.y = RING_HEIGHT + Math.sin(clock.getElapsedTime() * 0.8 + phaseOffset) * 0.08
    meshRef.current.rotation.y += 0.005
  })

  const handleClick = () => {
    setPendingMood(mood)
    if (meshRef.current) {
      gsap.fromTo(
        meshRef.current.scale,
        { x: 1, y: 1, z: 1 },
        { x: 1.5, y: 1.5, z: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
      )
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={[baseX, RING_HEIGHT, baseZ]}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true) }}
      onPointerOut={() => { document.body.style.cursor = 'default'; setHovered(false) }}
    >
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 1.4 : hovered ? 0.9 : isDimmed ? 0.1 : 0.5}
        transparent
        opacity={isSelected ? 1 : isDimmed ? 0.25 : hovered ? 1 : 0.8}
        roughness={0.1}
        metalness={0.2}
      />

      {(hovered || isSelected) && (
        <Html
          position={[0, 0.32, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.65)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(6px)',
            border: isSelected ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.05em',
          }}>
            {emoji} {label}
          </div>
        </Html>
      )}
    </mesh>
  )
}

export function MoodOrbs() {
  return (
    <group name="mood-orbs">
      {MOOD_LIST.map((config, index) => (
        <MoodOrb
          key={config.mood}
          mood={config.mood}
          label={config.label}
          emoji={config.emoji}
          color={config.lighting.accentColor}
          index={index}
          total={MOOD_LIST.length}
        />
      ))}
    </group>
  )
}
