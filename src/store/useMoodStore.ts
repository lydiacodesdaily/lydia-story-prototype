import { create } from 'zustand'
import type { Mood, MoodConfig } from '@/types/mood'
import { MOOD_CONFIGS } from '@/lib/moodConfig'

interface MoodState {
  mood: Mood | null
  moodConfig: MoodConfig | null
  hasSelectedMood: boolean
  hasEntered: boolean
  pendingMood: Mood | null
  setMood: (mood: Mood) => void
  setPendingMood: (mood: Mood | null) => void
  setEntered: () => void
  resetMood: () => void
}

export const useMoodStore = create<MoodState>((set) => ({
  mood: null,
  moodConfig: null,
  hasSelectedMood: false,
  hasEntered: false,
  pendingMood: null,

  setMood: (mood) =>
    set({
      mood,
      moodConfig: MOOD_CONFIGS[mood],
      hasSelectedMood: true,
      pendingMood: null,
    }),

  setPendingMood: (mood) => set({ pendingMood: mood }),

  setEntered: () => set({ hasEntered: true }),

  resetMood: () =>
    set({
      mood: null,
      moodConfig: null,
      hasSelectedMood: false,
      pendingMood: null,
    }),
}))
