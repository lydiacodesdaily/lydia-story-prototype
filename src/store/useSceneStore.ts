import { create } from 'zustand'
import type { SceneObject, ContentSection } from '@/types/scene'

interface SceneState {
  activeObject: SceneObject | null
  isContentPanelOpen: boolean
  contentPanelSection: ContentSection | null
  isTransitioning: boolean

  setActiveObject: (obj: SceneObject | null) => void
  openContentPanel: (section: ContentSection) => void
  closeContentPanel: () => void
  setTransitioning: (val: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  activeObject: null,
  isContentPanelOpen: false,
  contentPanelSection: null,
  isTransitioning: false,

  setActiveObject: (obj) => set({ activeObject: obj }),

  openContentPanel: (section) =>
    set({ isContentPanelOpen: true, contentPanelSection: section }),

  closeContentPanel: () =>
    set({ isContentPanelOpen: false, contentPanelSection: null, activeObject: null }),

  setTransitioning: (val) => set({ isTransitioning: val }),
}))
