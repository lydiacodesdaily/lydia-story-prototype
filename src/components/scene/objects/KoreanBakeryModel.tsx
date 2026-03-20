'use client'

import { useGLTF } from '@react-three/drei'

export function KoreanBakeryModel() {
  const { scene } = useGLTF('/models/korean_bakery.glb')
  return (
    <group>
      {/* Floating island platform — tapered cylinder so the bottom is naturally hidden */}
      <mesh position={[0, -1.0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[9, 6.5, 2.0, 32]} />
        <meshStandardMaterial color="#c8b89a" roughness={0.95} metalness={0.0} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
      </mesh>
      {/* Slightly darker underside cap to give depth */}
      <mesh position={[0, -2.05, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 5.0, 0.1, 32]} />
        <meshStandardMaterial color="#a89880" roughness={1.0} metalness={0.0} />
      </mesh>

      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/korean_bakery.glb')
