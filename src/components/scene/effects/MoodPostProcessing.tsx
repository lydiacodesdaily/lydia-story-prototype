'use client'

import { useMoodStore } from '@/store/useMoodStore'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function MoodPostProcessing() {
  const moodConfig = useMoodStore((s) => s.moodConfig)

  const pp = moodConfig?.postProcessing ?? {
    bloomStrength: 0.3,
    bloomRadius: 0.6,
    vignetteIntensity: 0.3,
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={pp.bloomStrength}
        radius={pp.bloomRadius}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
      />
      <Vignette
        offset={0.3}
        darkness={pp.vignetteIntensity}
        eskil={false}
      />
    </EffectComposer>
  )
}
