'use client'

import { useEffect, useRef } from 'react'
import { useMoodStore } from '@/store/useMoodStore'

export function useMoodAudio() {
  const moodConfig = useMoodStore((s) => s.moodConfig)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!moodConfig) return

    const { track, volume, fadeInDuration } = moodConfig.audio

    // Fade out current track
    const fadeOut = () =>
      new Promise<void>((resolve) => {
        if (!audioRef.current) {
          resolve()
          return
        }
        const start = audioRef.current.volume
        const steps = 20
        const interval = (1000 / steps)
        let step = 0
        const id = setInterval(() => {
          step++
          if (audioRef.current) {
            audioRef.current.volume = Math.max(0, start * (1 - step / steps))
          }
          if (step >= steps) {
            clearInterval(id)
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current.src = ''
            }
            resolve()
          }
        }, interval)
        fadeRef.current = id as unknown as number
      })

    const startNewTrack = () => {
      const audio = new Audio(track)
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio

      audio.play().catch(() => {
        // Autoplay blocked — user must interact first, which they have (mood selection)
      })

      // Fade in
      const steps = 30
      const targetVolume = volume
      const interval = (fadeInDuration * 1000) / steps
      let step = 0
      const id = setInterval(() => {
        step++
        if (audio) {
          audio.volume = Math.min(targetVolume, targetVolume * (step / steps))
        }
        if (step >= steps) clearInterval(id)
      }, interval)
      fadeRef.current = id as unknown as number
    }

    fadeOut().then(startNewTrack)

    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current)
    }
  }, [moodConfig])
}
