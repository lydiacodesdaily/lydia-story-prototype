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
import { useMoodStore } from '@/store/useMoodStore'
import { useMoodAudio } from '@/hooks/useMoodAudio'

export function SceneInitializer() {
  useMoodAudio()
  return null
}

export function TeaShopScene() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const hasEntered = useMoodStore((s) => s.hasEntered)

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

          {/* Interior objects — only rendered after entering */}
          {hasEntered && (
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

      {/* Hint overlay — shown once mood is active */}
      {moodConfig && (
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <p className="text-white/20 text-xs tracking-wider">
            click objects to explore
          </p>
        </div>
      )}
    </div>
  )
}
