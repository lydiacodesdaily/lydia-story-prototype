'use client'

import type { Mood, MoodConfig } from '@/types/mood'

interface MoodButtonProps {
  config: MoodConfig
  onSelect: (mood: Mood) => void
  isSelected: boolean
}

export function MoodButton({ config, onSelect, isSelected }: MoodButtonProps) {
  return (
    <button
      onClick={() => onSelect(config.mood)}
      className={`
        group relative px-5 py-4 rounded-2xl border transition-all duration-300
        flex flex-col items-center gap-1 w-36
        ${
          isSelected
            ? 'border-matcha-400 bg-matcha-400/20 scale-105'
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:scale-102'
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="text-3xl">{config.emoji}</span>
      <span className="text-white font-medium text-sm">{config.label}</span>
      <span className="text-white/50 text-xs text-center leading-tight">{config.description}</span>
    </button>
  )
}
