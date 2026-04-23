'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type TimerPhase = 'idle' | 'focus' | 'break'

export type TimerRingProps = {
  phase?: TimerPhase
  /** 0..1 — how much of the current phase has elapsed */
  progress?: number
  className?: string
}

const PHASE_HEX: Record<TimerPhase, string> = {
  idle: '#f59e0b',
  focus: '#4fd18c',
  break: '#8b5cf6',
}

type RingProps = Required<Pick<TimerRingProps, 'phase' | 'progress'>>

function Ring({ phase, progress }: RingProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const progressRef = useRef<THREE.Mesh>(null)

  const targetColor = useMemo(() => new THREE.Color(PHASE_HEX[phase]), [phase])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.35) * 0.12 - 0.08
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial
      mat.color.lerp(targetColor, 0.08)
      mat.emissive.lerp(targetColor, 0.08)
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.5
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.color.lerp(targetColor, 0.08)
    }
    if (progressRef.current) {
      const mat = progressRef.current.material as THREE.MeshBasicMaterial
      mat.color.lerp(targetColor, 0.1)
    }
  })

  const arcGeometry = useMemo(() => {
    // Procedural arc for progress: torus segment with scaled arc angle
    return new THREE.TorusGeometry(
      1.18,
      0.02,
      12,
      96,
      Math.max(0.001, progress * Math.PI * 2),
    )
  }, [progress])

  return (
    <group ref={groupRef}>
      {/* Core torus — the ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1, 0.075, 32, 128]} />
        <meshStandardMaterial
          color={PHASE_HEX[phase]}
          emissive={PHASE_HEX[phase]}
          emissiveIntensity={0.75}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Orbiting highlight ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[1.24, 0.008, 8, 120]} />
        <meshBasicMaterial color={PHASE_HEX[phase]} toneMapped={false} transparent opacity={0.55} />
      </mesh>

      {/* Progress arc — rendered from a procedural partial torus */}
      <mesh ref={progressRef} geometry={arcGeometry} rotation={[0, 0, Math.PI / 2]}>
        <meshBasicMaterial color={PHASE_HEX[phase]} toneMapped={false} />
      </mesh>

      {/* Dim inner disc for depth */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.88, 64]} />
        <meshBasicMaterial color="#0a0a0f" transparent opacity={0.78} />
      </mesh>
    </group>
  )
}

export default function TimerRing({
  phase = 'focus',
  progress = 0.55,
  className,
}: TimerRingProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[2, 2, 3]} intensity={0.9} color="#ffffff" />
        <pointLight position={[-2, -1, 2]} intensity={0.4} color="#8b5cf6" />
        <Suspense fallback={null}>
          <Ring phase={phase} progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
