import type { Mood, MoodConfig } from '@/types/mood'

export const MOOD_CONFIGS: Record<Mood, MoodConfig> = {
  calm: {
    mood: 'calm',
    label: 'Calm',
    emoji: '🌧️',
    description: 'soft rain, gentle thoughts',
    lighting: {
      ambientIntensity: 0.4,
      ambientColor: '#b8d4e8',
      keyColor: '#c8dff0',
      keyIntensity: 1.2,
      accentColor: '#90b8d0',
      accentIntensity: 0.6,
      fogDensity: 0.08,
      fogColor: '#c5d8e8',
    },
    animation: {
      durationMultiplier: 1.6,
      ease: 'power1.inOut',
      idleSpeed: 0.6,
    },
    postProcessing: {
      bloomStrength: 0.4,
      bloomRadius: 0.8,
      vignetteIntensity: 0.35,
      depthOfFieldFocus: 3.5,
    },
    audio: {
      track: '/audio/calm-rain.mp3',
      volume: 0.4,
      fadeInDuration: 3,
    },
    particles: {
      type: 'rain',
      density: 200,
      speed: 0.8,
    },
    cameraAnimation: {
      durationMultiplier: 1.4,
    },
  },

  focused: {
    mood: 'focused',
    label: 'Focused',
    emoji: '☀️',
    description: 'bright afternoon, clear mind',
    lighting: {
      ambientIntensity: 0.6,
      ambientColor: '#fff8e8',
      keyColor: '#fff5d6',
      keyIntensity: 2.0,
      accentColor: '#ffe8a0',
      accentIntensity: 0.8,
      fogDensity: 0.02,
      fogColor: '#f5f0e0',
    },
    animation: {
      durationMultiplier: 0.9,
      ease: 'power2.out',
      idleSpeed: 1.1,
    },
    postProcessing: {
      bloomStrength: 0.2,
      bloomRadius: 0.4,
      vignetteIntensity: 0.15,
      depthOfFieldFocus: 5.0,
    },
    audio: {
      track: '/audio/focused-afternoon.mp3',
      volume: 0.3,
      fadeInDuration: 2,
    },
    particles: {
      type: 'none',
      density: 0,
      speed: 0,
    },
    cameraAnimation: {
      durationMultiplier: 0.85,
    },
  },

  tired: {
    mood: 'tired',
    label: 'Tired',
    emoji: '🕯️',
    description: 'dim candlelight, slow breath',
    lighting: {
      ambientIntensity: 0.2,
      ambientColor: '#4a2800',
      keyColor: '#ff9940',
      keyIntensity: 0.6,
      accentColor: '#cc6620',
      accentIntensity: 0.4,
      fogDensity: 0.05,
      fogColor: '#2a1800',
    },
    animation: {
      durationMultiplier: 2.4,
      ease: 'power1.inOut',
      idleSpeed: 0.3,
    },
    postProcessing: {
      bloomStrength: 0.6,
      bloomRadius: 1.2,
      vignetteIntensity: 0.55,
      depthOfFieldFocus: 2.5,
    },
    audio: {
      track: '/audio/tired-candle.mp3',
      volume: 0.35,
      fadeInDuration: 4,
    },
    particles: {
      type: 'mist',
      density: 80,
      speed: 0.2,
    },
    cameraAnimation: {
      durationMultiplier: 2.0,
    },
  },

  overwhelmed: {
    mood: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌫️',
    description: 'soft mist, breathe slowly',
    lighting: {
      ambientIntensity: 0.3,
      ambientColor: '#c8d8cc',
      keyColor: '#d0ddd8',
      keyIntensity: 0.8,
      accentColor: '#a8c0b0',
      accentIntensity: 0.4,
      fogDensity: 0.12,
      fogColor: '#c0ccc8',
    },
    animation: {
      durationMultiplier: 2.0,
      ease: 'sine.inOut',
      idleSpeed: 0.4,
    },
    postProcessing: {
      bloomStrength: 0.1,
      bloomRadius: 0.6,
      vignetteIntensity: 0.45,
      depthOfFieldFocus: 2.8,
    },
    audio: {
      track: '/audio/overwhelmed-mist.mp3',
      volume: 0.3,
      fadeInDuration: 5,
    },
    particles: {
      type: 'mist',
      density: 120,
      speed: 0.15,
    },
    cameraAnimation: {
      durationMultiplier: 1.8,
    },
  },

  energized: {
    mood: 'energized',
    label: 'Energized',
    emoji: '✨',
    description: 'vibrant greens, full of spark',
    lighting: {
      ambientIntensity: 0.7,
      ambientColor: '#fffae0',
      keyColor: '#fff8cc',
      keyIntensity: 2.5,
      accentColor: '#90ee90',
      accentIntensity: 1.0,
      fogDensity: 0.01,
      fogColor: '#f0f8e0',
    },
    animation: {
      durationMultiplier: 0.7,
      ease: 'back.out(1.4)',
      idleSpeed: 1.5,
    },
    postProcessing: {
      bloomStrength: 0.5,
      bloomRadius: 0.6,
      vignetteIntensity: 0.1,
      depthOfFieldFocus: 6.0,
    },
    audio: {
      track: '/audio/energized-sunny.mp3',
      volume: 0.45,
      fadeInDuration: 1.5,
    },
    particles: {
      type: 'sparkle',
      density: 60,
      speed: 1.2,
    },
    cameraAnimation: {
      durationMultiplier: 0.7,
    },
  },
}
