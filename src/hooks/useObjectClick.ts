'use client'

import { useCallback } from 'react'
import { useSceneStore } from '@/store/useSceneStore'
import { useMoodStore } from '@/store/useMoodStore'
import { useSlothDialogue } from '@/hooks/useSlothDialogue'
import { animateCameraTo } from '@/lib/gsapConfig'
import { CAMERA_TARGETS, OBJECT_SECTION_MAP } from '@/types/scene'
import type { SceneObject } from '@/types/scene'
import type { MutableRefObject } from 'react'
import { gsap } from 'gsap'
import type { Mesh, Group } from 'three'

interface UseObjectClickOptions {
  object: SceneObject
  meshRef: MutableRefObject<Mesh | Group | null>
  onAnimate?: () => Promise<void>
}

export function useObjectClick({ object, meshRef, onAnimate }: UseObjectClickOptions) {
  const { isTransitioning, setTransitioning, setActiveObject, openContentPanel } = useSceneStore()
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const { triggerDialogue } = useSlothDialogue()

  const handleClick = useCallback(async () => {
    if (isTransitioning) return

    setTransitioning(true)

    const durationMult = moodConfig?.cameraAnimation.durationMultiplier ?? 1
    const target = CAMERA_TARGETS[object]
    const section = OBJECT_SECTION_MAP[object]

    // Hover highlight
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: (meshRef.current.position.y ?? 0) + 0.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      })
    }

    await Promise.all([
      animateCameraTo(target, durationMult),
      onAnimate?.() ?? Promise.resolve(),
    ])

    setActiveObject(object)
    openContentPanel(section)
    triggerDialogue(object)
    setTransitioning(false)
  }, [
    isTransitioning,
    object,
    meshRef,
    moodConfig,
    onAnimate,
    setTransitioning,
    setActiveObject,
    openContentPanel,
    triggerDialogue,
  ])

  return { handleClick }
}
