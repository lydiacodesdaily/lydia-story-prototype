export type SceneObject = 'matcha-bowl' | 'journal' | 'window' | 'sloth' | 'headphones'

export type ContentSection = 'projects' | 'case-studies' | 'about' | 'contact'

export interface Vector3Like {
  x: number
  y: number
  z: number
}

export interface CameraTarget {
  position: [number, number, number]
  lookAt: [number, number, number]
  duration?: number
  ease?: string
}

export interface InteractionEvent {
  object: SceneObject
  section: ContentSection
  cameraTarget: CameraTarget
}

export const CAMERA_TARGETS: Record<SceneObject, CameraTarget> = {
  'matcha-bowl': {
    position: [-0.6, 1.4, 2.0],
    lookAt: [-1.2, 0.9, 0],
    duration: 1.4,
    ease: 'power2.inOut',
  },
  journal: {
    position: [0.4, 1.4, 2.0],
    lookAt: [0.8, 0.9, 0],
    duration: 1.4,
    ease: 'power2.inOut',
  },
  window: {
    position: [0, 1.8, 1.5],
    lookAt: [0, 2.2, -2.5],
    duration: 1.8,
    ease: 'power2.inOut',
  },
  sloth: {
    position: [0, 1.6, 1.2],
    lookAt: [0, 1.4, -1],
    duration: 1.2,
    ease: 'power2.inOut',
  },
  headphones: {
    position: [-1.2, 1.2, 1.5],
    lookAt: [-1.8, 0.8, 0.5],
    duration: 1.4,
    ease: 'power2.inOut',
  },
}

export const CAMERA_DEFAULT: CameraTarget = {
  position: [0, 1.3, 2.5],
  lookAt: [0, 1.0, 0],
  duration: 1.6,
  ease: 'power2.inOut',
}

export const OBJECT_SECTION_MAP: Record<SceneObject, ContentSection> = {
  'matcha-bowl': 'projects',
  journal: 'case-studies',
  window: 'about',
  sloth: 'contact',
  headphones: 'contact',
}
