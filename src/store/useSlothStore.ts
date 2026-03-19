import { create } from 'zustand'
import type { DialogueTurn, SlothEmotion } from '@/types/dialogue'

const MAX_HISTORY = 10

interface SlothState {
  dialogueHistory: DialogueTurn[]
  currentDialogue: string
  isStreaming: boolean
  slothEmotion: SlothEmotion

  appendDialogue: (turn: DialogueTurn) => void
  setCurrentDialogue: (text: string) => void
  setStreaming: (val: boolean) => void
  setEmotion: (emotion: SlothEmotion) => void
  clearHistory: () => void
}

export const useSlothStore = create<SlothState>((set) => ({
  dialogueHistory: [],
  currentDialogue: '',
  isStreaming: false,
  slothEmotion: 'neutral',

  appendDialogue: (turn) =>
    set((state) => ({
      dialogueHistory: [...state.dialogueHistory, turn].slice(-MAX_HISTORY),
    })),

  setCurrentDialogue: (text) => set({ currentDialogue: text }),
  setStreaming: (val) => set({ isStreaming: val }),
  setEmotion: (emotion) => set({ slothEmotion: emotion }),
  clearHistory: () => set({ dialogueHistory: [], currentDialogue: '' }),
}))
