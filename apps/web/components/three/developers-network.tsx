'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Node = {
  name: string
  position: [number, number, number]
  color: string
}

const NODES: Node[] = [
  { name: 'vibe-mix', position: [-1.4, 0.6, 0], color: '#fcd34d' },
  { name: 'pomodoro-sync', position: [1.4, 0.6, 0], color: '#4fd18c' },
  { name: 'ai-witness', position: [0, -1.2, 0], color: '#a78bfa' },
  { name: 'session-card', position: [-1.0, -0.2, 1.0], color: '#f59e0b' },
  { name: 'suno-bridge', position: [1.0, -0.2, -1.0], color: '#8b5cf6' },
]

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
]

function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.08 - 0.05
    }
  })

  const edgeGeometries = useMemo(
    () =>
      EDGES.map(([a, b]) => {
        const start = new THREE.Vector3(...NODES[a]!.position)
        const end = new THREE.Vector3(...NODES[b]!.position)
        return new THREE.BufferGeometry().setFromPoints([start, end])
      }),
    [],
  )

  return (
    <group ref={groupRef}>
      {NODES.map((node, i) => (
        <group key={node.name} position={node.position}>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.8}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
          {/* Halo */}
          <mesh>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.14} toneMapped={false} />
          </mesh>
          {/* Index dot — second, deeper */}
          {i % 2 === 0 && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.36, 18, 18]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.05} toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}

      {edgeGeometries.map((geom, i) => (
        <line key={i} geometry={geom}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.18} toneMapped={false} />
        </line>
      ))}
    </group>
  )
}

export default function DevelopersNetwork({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.3, 4.6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={0.8} />
        <pointLight position={[-3, -2, 2]} intensity={0.4} color="#8b5cf6" />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
