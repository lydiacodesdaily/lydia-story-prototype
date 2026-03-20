'use client'

import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'
import { gsap } from 'gsap'
import { cameraRig, animateCameraTo } from '@/lib/gsapConfig'
import { useMoodStore } from '@/store/useMoodStore'
import { CAMERA_DEFAULT } from '@/types/scene'

export function SceneCamera() {
  const positionRef = useRef<Group>(null!)
  const armRef = useRef<Group>(null!)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null)
  const hasSelectedMood = useMoodStore((s) => s.hasSelectedMood)
  const hasEntered = useMoodStore((s) => s.hasEntered)
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const { camera } = useThree()

  useEffect(() => {
    cameraRig.positionRef = positionRef
    cameraRig.armRef = armRef
  }, [])

  // Zoom into interior when user clicks Enter
  useEffect(() => {
    if (!hasEntered) return

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false
    }

    // Animate camera.position directly so OrbitControls can resume from here
    gsap.to(camera.position, {
      x: 0,
      y: 2.2,
      z: 6,
      duration: 1.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !hasSelectedMood
        }
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered])

  useEffect(() => {
    if (!hasSelectedMood) return

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false
    }

    // Transfer camera's current position to the rig group (no jump), then animate to final view
    if (positionRef.current) {
      positionRef.current.position.set(camera.position.x, camera.position.y, camera.position.z)
    }
    camera.position.set(0, 0, 0)
    // Don't reset camera.rotation — keep the look direction from OrbitControls to avoid a jump

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
        autoRotate={false}
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
