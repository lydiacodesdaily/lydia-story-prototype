import { create } from 'zustand'
import type { Mood, MoodConfig } from '@/types/mood'
import { MOOD_CONFIGS } from '@/lib/moodConfig'

interface MoodState {
  mood: Mood | null
  moodConfig: MoodConfig | null
  hasSelectedMood: boolean
  setMood: (mood: Mood) => void
  resetMood: () => void
}

export const useMoodStore = create<MoodState>((set) => ({
  mood: null,
  moodConfig: null,
  hasSelectedMood: false,

  setMood: (mood) =>
    set({
      mood,
      moodConfig: MOOD_CONFIGS[mood],
      hasSelectedMood: true,
    }),

  resetMood: () =>
    set({
      mood: null,
      moodConfig: null,
      hasSelectedMood: false,
    }),
}))
