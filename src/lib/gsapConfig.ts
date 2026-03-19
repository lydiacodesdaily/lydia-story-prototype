import { gsap } from 'gsap'
import type { CameraTarget } from '@/types/scene'
import type { MutableRefObject } from 'react'
import type { Group } from 'three'

// Camera rig refs — set by SceneCamera, consumed by any component
export const cameraRig = {
  positionRef: null as MutableRefObject<Group> | null,
  armRef: null as MutableRefObject<Group> | null,
}

export function animateCameraTo(target: CameraTarget, moodDurationMultiplier = 1): Promise<void> {
  if (!cameraRig.positionRef?.current) return Promise.resolve()

  return new Promise((resolve) => {
    const duration = (target.duration ?? 1.4) * moodDurationMultiplier

    gsap.to(cameraRig.positionRef!.current.position, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration,
      ease: target.ease ?? 'power2.inOut',
      onComplete: resolve,
    })
  })
}

export function resetCamera(moodDurationMultiplier = 1): Promise<void> {
  if (!cameraRig.positionRef?.current) return Promise.resolve()

  return new Promise((resolve) => {
    const duration = 1.6 * moodDurationMultiplier

    gsap.to(cameraRig.positionRef!.current.position, {
      x: 0,
      y: 1.6,
      z: 4,
      duration,
      ease: 'power2.inOut',
      onComplete: resolve,
    })
  })
}
