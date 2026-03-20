'use client'

import { Suspense } from 'react'
import { useMoodStore } from '@/store/useMoodStore'
import { TeaShopScene, SceneInitializer } from '@/components/scene/TeaShopScene'
import { SlothDialogueBubble } from '@/components/ui/SlothDialogueBubble'
import { ContentPanel } from '@/components/ui/ContentPanel'
import { BreathingCue } from '@/components/ui/BreathingCue'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { WeatherHUD } from '@/components/ui/WeatherHUD'
import { useWeather } from '@/hooks/useWeather'

export default function App() {
  const mood = useMoodStore((s) => s.mood)
  const hasEntered = useMoodStore((s) => s.hasEntered)
  const setEntered = useMoodStore((s) => s.setEntered)

  // Fetch geolocation + weather once on mount
  useWeather()

  return (
    <>
      {/* 3D scene always renders — exterior on home, interior after entering */}
      <Suspense fallback={<LoadingScreen />}>
        <TeaShopScene />
        <SceneInitializer />
      </Suspense>

      {/* Weather + time HUD — shown on exterior home page */}
      {!hasEntered && <WeatherHUD />}

      {/* Enter button overlay — shown on exterior home page */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 flex flex-col items-end justify-end pb-16 pr-16 pointer-events-none">
          <div className="text-right pointer-events-auto">
            <button
              onClick={setEntered}
              className="px-8 py-3 border border-white/30 text-white/70 text-sm tracking-[0.25em] uppercase hover:border-white/70 hover:text-white transition-all duration-300 cursor-pointer backdrop-blur-sm bg-black/10"
            >
              Enter →
            </button>
          </div>
        </div>
      )}

      {/* Sloth dialogue + mood UI — only inside the bakery */}
      {hasEntered && <SlothDialogueBubble />}

      {/* Content panels after mood is selected */}
      {mood && (
        <>
          <ContentPanel />
          <BreathingCue />
        </>
      )}
    </>
  )
}
