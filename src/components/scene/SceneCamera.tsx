'use client'

import { useRef, useEffect } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import type { Group } from 'three'
import { cameraRig } from '@/lib/gsapConfig'

export function SceneCamera() {
  const positionRef = useRef<Group>(null!)
  const armRef = useRef<Group>(null!)

  useEffect(() => {
    cameraRig.positionRef = positionRef
    cameraRig.armRef = armRef
  }, [])

  return (
    <group ref={positionRef} position={[0, 1.6, 4]}>
      <group ref={armRef}>
        <PerspectiveCamera
          makeDefault
          fov={55}
          near={0.1}
          far={100}
        />
      </group>
    </group>
  )
}
