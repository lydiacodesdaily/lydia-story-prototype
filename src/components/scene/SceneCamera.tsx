'use client'

import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'
import { cameraRig, animateCameraTo } from '@/lib/gsapConfig'
import { useMoodStore } from '@/store/useMoodStore'
import { CAMERA_DEFAULT } from '@/types/scene'

export function SceneCamera() {
  const positionRef = useRef<Group>(null!)
  const armRef = useRef<Group>(null!)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const hasSelectedMood = useMoodStore((s) => s.hasSelectedMood)
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const { camera } = useThree()

  useEffect(() => {
    cameraRig.positionRef = positionRef
    cameraRig.armRef = armRef
  }, [])

  useEffect(() => {
    if (!hasSelectedMood) return

    // Disable orbit controls immediately before GSAP fires
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false
    }

    // Reset camera's local offset so positionRef group is the sole position source
    camera.position.set(0, 0, 0)
    camera.rotation.set(0, 0, 0)

    // Snap group to approximate diorama distance for a smooth fly-in
    if (positionRef.current) {
      positionRef.current.position.set(0, 2, 5.5)
    }

    const multiplier = moodConfig?.cameraAnimation.durationMultiplier ?? 1
    animateCameraTo(CAMERA_DEFAULT, multiplier)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSelectedMood])

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enabled={!hasSelectedMood}
        target={[0, 1.5, 0]}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.4}
        autoRotate={!hasSelectedMood}
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.07}
        enablePan={false}
      />
      <group ref={positionRef} position={[0, 0, 0]}>
        <group ref={armRef}>
          <PerspectiveCamera
            makeDefault
            fov={50}
            near={0.1}
            far={100}
            position={[0, 3, 10]}
          />
        </group>
      </group>
    </>
  )
}
