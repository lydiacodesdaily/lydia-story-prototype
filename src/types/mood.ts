export type Mood = 'calm' | 'focused' | 'tired' | 'overwhelmed' | 'energized'

export interface MoodLighting {
  ambientIntensity: number
  ambientColor: string
  keyColor: string
  keyIntensity: number
  accentColor: string
  accentIntensity: number
  fogDensity: number
  fogColor: string
}

export interface MoodAnimation {
  durationMultiplier: number
  ease: string
  idleSpeed: number
}

export interface MoodPostProcessing {
  bloomStrength: number
  bloomRadius: number
  vignetteIntensity: number
  depthOfFieldFocus: number
}

export interface MoodAudio {
  track: string
  volume: number
  fadeInDuration: number
}

export interface MoodParticles {
  type: 'rain' | 'mist' | 'none' | 'sparkle'
  density: number
  speed: number
}

export interface MoodCameraAnimation {
  durationMultiplier: number
}

export interface MoodConfig {
  mood: Mood
  label: string
  emoji: string
  description: string
  lighting: MoodLighting
  animation: MoodAnimation
  postProcessing: MoodPostProcessing
  audio: MoodAudio
  particles: MoodParticles
  cameraAnimation: MoodCameraAnimation
}
