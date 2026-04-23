'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

export type SessionCard3DProps = {
  frontColor?: string
  backColor?: string
  clubName?: string
  minutes?: number
  cycles?: number
  className?: string
}

type CardProps = {
  frontColor: string
  backColor: string
  flipped: boolean
}

function Card({ frontColor, backColor, flipped }: CardProps) {
  const groupRef = useRef<THREE.Group>(null)
  const targetRotation = useRef(0)

  useFrame((state, delta) => {
    targetRotation.current = flipped ? Math.PI : 0
    if (groupRef.current) {
      const g = groupRef.current
      g.rotation.y += (targetRotation.current - g.rotation.y) * Math.min(1, delta * 5)
      g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Front face */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[2.1, 1.1]} />
        <meshStandardMaterial
          color={frontColor}
          emissive={frontColor}
          emissiveIntensity={0.22}
          metalness={0.35}
          roughness={0.5}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Back face */}
      <mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.1, 1.1]} />
        <meshStandardMaterial
          color={backColor}
          emissive={backColor}
          emissiveIntensity={0.22}
          metalness={0.35}
          roughness={0.5}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Accent edge strip — amber glow on the left spine */}
      <mesh position={[-1.04, 0, 0]}>
        <boxGeometry args={[0.02, 1.08, 0.015]} />
        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function SessionCard3D({
  frontColor = '#14141f',
  backColor = '#1a1a28',
  className,
}: SessionCard3DProps) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={() => setFlipped((f) => !f)}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[2, 2, 3]} intensity={0.9} />
        <pointLight position={[-2, -1, 2]} intensity={0.3} color="#8b5cf6" />
        <Suspense fallback={null}>
          <PresentationControls
            global
            polar={[-0.3, 0.3]}
            azimuth={[-0.6, 0.6]}
            config={{ mass: 1, tension: 170 }}
            snap={{ mass: 2, tension: 260 }}
          >
            <Card frontColor={frontColor} backColor={backColor} flipped={flipped} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  )
}
