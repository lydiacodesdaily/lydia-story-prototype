'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneCamera } from './SceneCamera'
import { SceneLighting } from './SceneLighting'
import { SceneEnvironment } from './SceneEnvironment'
import { MatchaBowl } from './objects/MatchaBowl'
import { Journal } from './objects/Journal'
import { WindowFrame } from './objects/WindowFrame'
import { SlothCharacter } from './objects/SlothCharacter'
import { Headphones } from './objects/Headphones'
import { MoodPostProcessing } from './effects/MoodPostProcessing'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useMoodStore } from '@/store/useMoodStore'
import { useSlothDialogue } from '@/hooks/useSlothDialogue'
import { useMoodAudio } from '@/hooks/useMoodAudio'
import { MoodOrbs } from './objects/MoodOrbs'
import { useEffect } from 'react'

export function SceneInitializer() {
  const { triggerDialogue } = useSlothDialogue()
  useMoodAudio()

  useEffect(() => {
    // Greeting after a brief moment for scene to settle
    const t = setTimeout(() => {
      triggerDialogue('greeting')
    }, 800)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  return null
}

export function TeaShopScene() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const hasSelectedMood = useMoodStore((s) => s.hasSelectedMood)

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#a8d8f0']} />
        <Suspense fallback={null}>
          <SceneCamera />
          <SceneLighting />
          <SceneEnvironment />

          {/* Mood orbs — shown during diorama/selection phase */}
          {!hasSelectedMood && <MoodOrbs />}

          {/* Interactive objects only shown inside the bakery */}
          {hasSelectedMood && (
            <group name="shop-objects">
              <MatchaBowl />
              <Journal />
              <WindowFrame />
              <SlothCharacter />
              <Headphones />
            </group>
          )}

          <MoodPostProcessing />
        </Suspense>
      </Canvas>

      {/* Hint overlay — only shown after entering */}
      {hasSelectedMood && moodConfig && (
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <p className="text-white/20 text-xs tracking-wider">
            click objects to explore
          </p>
        </div>
      )}
    </div>
  )
}

// Wrapper that initializes scene audio + greeting
export function TeaShopSceneWithInit() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SceneInitializer />
      <TeaShopScene />
    </Suspense>
  )
}
