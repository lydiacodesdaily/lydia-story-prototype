'use client'

import { Suspense } from 'react'
import { useMoodStore } from '@/store/useMoodStore'
import { DioramaHUD } from '@/components/ui/DioramaHUD'
import { TeaShopScene, SceneInitializer } from '@/components/scene/TeaShopScene'
import { SlothDialogueBubble } from '@/components/ui/SlothDialogueBubble'
import { ContentPanel } from '@/components/ui/ContentPanel'
import { BreathingCue } from '@/components/ui/BreathingCue'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export default function App() {
  const hasSelectedMood = useMoodStore((s) => s.hasSelectedMood)

  return (
    <>
      {/* 3D scene always renders — exterior on home, interior after entering */}
      <Suspense fallback={<LoadingScreen />}>
        <TeaShopScene />
        {hasSelectedMood && <SceneInitializer />}
      </Suspense>

      {/* Diorama HUD — title + enter button, no overlay */}
      {!hasSelectedMood && <DioramaHUD />}

      {/* In-scene UI after entering */}
      {hasSelectedMood && (
        <>
          <SlothDialogueBubble />
          <ContentPanel />
          <BreathingCue />
        </>
      )}
    </>
  )
}
