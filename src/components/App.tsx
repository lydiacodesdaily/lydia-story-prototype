'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { MoodGate } from '@/components/ui/MoodGate'
import { TeaShopSceneWithInit } from '@/components/scene/TeaShopScene'
import { SlothDialogueBubble } from '@/components/ui/SlothDialogueBubble'
import { ContentPanel } from '@/components/ui/ContentPanel'
import { BreathingCue } from '@/components/ui/BreathingCue'

export default function App() {
  const hasSelectedMood = useMoodStore((s) => s.hasSelectedMood)

  if (!hasSelectedMood) {
    return <MoodGate />
  }

  return (
    <>
      <TeaShopSceneWithInit />
      <SlothDialogueBubble />
      <ContentPanel />
      <BreathingCue />
    </>
  )
}
