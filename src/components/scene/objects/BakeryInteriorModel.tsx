'use client'

import { useGLTF } from '@react-three/drei'

export function BakeryInteriorModel() {
  const { scene } = useGLTF('/models/bakery_interior.glb')
  return <primitive object={scene} rotation={[0, Math.PI / 8, 0]} />
}

useGLTF.preload('/models/bakery_interior.glb')
