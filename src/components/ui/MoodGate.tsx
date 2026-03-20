'use client'

import { useState } from 'react'
import { useMoodStore } from '@/store/useMoodStore'
import { MoodButton } from './MoodButton'
import { MOOD_CONFIGS } from '@/lib/moodConfig'
import type { Mood } from '@/types/mood'

export function MoodGate() {
  const [selected, setSelected] = useState<Mood | null>(null)
  const setMood = useMoodStore((s) => s.setMood)

  const handleSelect = (mood: Mood) => {
    setSelected(mood)
  }

  const handleEnter = () => {
    if (selected) setMood(selected)
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo / title */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">🦥</span>
          <h1 className="text-white text-2xl font-light tracking-widest uppercase">
            Cha&apos;s Bakery
          </h1>
          <p className="text-white/40 text-sm tracking-wider">a portfolio experience</p>
        </div>

        {/* Sloth greeting */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-sm">
          <p className="text-white/80 text-sm leading-relaxed italic">
            &ldquo;Oh, hello... welcome. I&apos;m Cha.{' '}
            <span className="text-matcha-300">Pull up a chair — how are you feeling today?</span>&rdquo;
          </p>
        </div>

        {/* Mood selection */}
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.values(MOOD_CONFIGS) as (typeof MOOD_CONFIGS)[keyof typeof MOOD_CONFIGS][]).map((config) => (
            <MoodButton
              key={config.mood}
              config={config}
              onSelect={handleSelect}
              isSelected={selected === config.mood}
            />
          ))}
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          disabled={!selected}
          className={`
            px-8 py-3 rounded-full text-sm tracking-wider uppercase transition-all duration-500
            ${
              selected
                ? 'bg-matcha-500 text-white hover:bg-matcha-400 scale-100 opacity-100'
                : 'bg-white/5 text-white/20 scale-95 opacity-40 cursor-not-allowed'
            }
          `}
        >
          Enter the bakery
        </button>

        <p className="text-white/20 text-xs">
          click objects inside to explore Lydia&apos;s work
        </p>
      </div>
    </div>
  )
}
