import type { Mood } from './mood'
import type { SceneObject, ContentSection } from './scene'

export type DialogueRole = 'user' | 'assistant'

export interface DialogueTurn {
  role: DialogueRole
  content: string
}

export type SlothEmotion = 'neutral' | 'happy' | 'sleepy' | 'curious' | 'excited'

export interface SlothDialogueRequest {
  trigger: SceneObject | 'greeting'
  mood: Mood
  history: DialogueTurn[]
  visitorInfo: {
    name: string
    targetRoles: string[]
    currentSection: ContentSection | null
  }
}
