'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ShaderMaterial, Mesh } from 'three'

export type VibeOrbProps = {
  /** 0..1, drives the amber color band and vertex displacement */
  ambient?: number
  /** 0..1, drives the violet color band */
  music?: number
  /** 0..1, drives the signal-green color band + fresnel punch */
  voice?: number
  className?: string
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform float uAmbient;

  float cheapNoise(vec3 p) {
    return sin(p.x * 2.1 + uTime * 0.4)
         * sin(p.y * 1.7 + uTime * 0.35)
         * sin(p.z * 2.3 + uTime * 0.5);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    float disp = cheapNoise(position * 1.4 + uTime * 0.25);
    disp *= 0.06 + uAmbient * 0.18;
    vec3 displaced = position + normal * disp;
    vPosition = displaced;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform float uAmbient;
  uniform float uMusic;
  uniform float uVoice;
  uniform vec3 uCameraPosition;

  void main() {
    vec3 amber  = vec3(0.961, 0.620, 0.043); // #f59e0b
    vec3 violet = vec3(0.545, 0.361, 0.965); // #8b5cf6
    vec3 signal = vec3(0.310, 0.820, 0.549); // #4fd18c

    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    float fresnel = 1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0);
    fresnel = pow(fresnel, 2.2);

    float angle = atan(vPosition.y, vPosition.x) + uTime * 0.12;
    float lat   = vPosition.y;

    float ambientBand = smoothstep(0.0, 1.0, sin(angle * 2.0 + lat * 1.2) * 0.5 + 0.5);
    float musicBand   = smoothstep(0.0, 1.0, sin(angle * 3.0 + lat * 1.8 + 1.57) * 0.5 + 0.5);
    float voiceBand   = smoothstep(0.0, 1.0, sin(angle * 4.0 - lat * 1.4 + 3.14) * 0.5 + 0.5);

    vec3 color = amber  * ambientBand * (0.15 + uAmbient * 1.15)
               + violet * musicBand   * (0.10 + uMusic   * 1.25)
               + signal * voiceBand   * (0.08 + uVoice   * 1.30);

    color += vec3(1.0) * fresnel * (0.28 + uVoice * 0.25);
    color *= (0.55 + 0.45 * clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0));

    gl_FragColor = vec4(color, 0.93);
  }
`

type OrbProps = Required<Pick<VibeOrbProps, 'ambient' | 'music' | 'voice'>>

function Orb({ ambient, music, voice }: OrbProps) {
  const materialRef = useRef<ShaderMaterial>(null)
  const meshRef = useRef<Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmbient: { value: ambient },
      uMusic: { value: music },
      uVoice: { value: voice },
      uCameraPosition: { value: [0, 0, 3] as [number, number, number] },
    }),
    // uniforms are a stable object created once; values are updated in useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state, delta) => {
    const mat = materialRef.current
    if (mat) {
      mat.uniforms.uTime.value += delta
      mat.uniforms.uAmbient.value += (ambient - mat.uniforms.uAmbient.value) * 0.08
      mat.uniforms.uMusic.value += (music - mat.uniforms.uMusic.value) * 0.08
      mat.uniforms.uVoice.value += (voice - mat.uniforms.uVoice.value) * 0.08
      const cam = state.camera.position
      mat.uniforms.uCameraPosition.value = [cam.x, cam.y, cam.z]
    }
    const mesh = meshRef.current
    if (mesh) {
      mesh.rotation.y += delta * 0.18
      mesh.rotation.x += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

export default function VibeOrb({
  ambient = 0.4,
  music = 0.3,
  voice = 0.6,
  className,
}: VibeOrbProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 3, 5]} intensity={0.55} />
        <Suspense fallback={null}>
          <Orb ambient={ambient} music={music} voice={voice} />
        </Suspense>
      </Canvas>
    </div>
  )
}
