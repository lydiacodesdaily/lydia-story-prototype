'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { MOOD_CONFIGS } from '@/lib/moodConfig'

export function DioramaHUD() {
  const pendingMood = useMoodStore((s) => s.pendingMood)
  const setMood = useMoodStore((s) => s.setMood)

  const pendingConfig = pendingMood ? MOOD_CONFIGS[pendingMood] : null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top strip — title + enter button */}
      <div className="flex items-start justify-between px-8 py-6">
        {/* Branding */}
        <div>
          <h1 className="text-white text-xl font-light tracking-widest uppercase">
            Cha&apos;s Bakery
          </h1>
          <p className="text-white/40 text-xs tracking-wider mt-0.5">a portfolio experience</p>
        </div>

        {/* Enter button — appears after orb is selected */}
        {pendingConfig && (
          <button
            onClick={() => setMood(pendingMood!)}
            className="pointer-events-auto px-6 py-2.5 rounded-full text-sm tracking-wider uppercase transition-all duration-500 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            style={{ borderColor: pendingConfig.lighting.accentColor + '80' }}
          >
            Enter the bakery →
          </button>
        )}
      </div>

      {/* Bottom hint */}
      <div className="flex justify-center pb-6">
        <p className="text-white/25 text-xs tracking-wider">
          drag to rotate · click an orb to set your mood
        </p>
      </div>
    </div>
  )
}
