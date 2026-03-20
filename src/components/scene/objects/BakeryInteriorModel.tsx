'use client'

import { useGLTF } from '@react-three/drei'

export function BakeryInteriorModel() {
  const { scene } = useGLTF('/models/bakery.glb')
  return <primitive object={scene} />
}

useGLTF.preload('/models/bakery.glb')
