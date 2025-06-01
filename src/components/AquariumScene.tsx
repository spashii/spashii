'use client'
import { useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMask, useGLTF, Float, CameraControls } from '@react-three/drei'
import {
  Lightformer,
  Environment,
  MeshTransmissionMaterial,
} from '@react-three/drei'

// Extend the Three.js namespace for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any
      mesh: any
      primitive: any
    }
  }
}

export function AquariumScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 50 }}
    >
      {/** Glass aquarium */}
      <Aquarium position={[0, 0.25, 0]} rotation={[0.4, 0.5, 0.2]}>
        <Float rotationIntensity={2} floatIntensity={10} speed={2}>
          <Turtle
            position={[0, -0.5, -1]}
            rotation={[0, Math.PI, 0]}
            scale={23}
          />
        </Float>
      </Aquarium>
      {/** Custom environment map */}
      <Environment resolution={1024}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={4}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[4, 1, 1]}
            />
          ))}
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[50, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[50, 2, 1]}
          />
        </group>
      </Environment>
      <CameraControls
        truckSpeed={0}
        dollySpeed={0}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </Canvas>
  )
}

interface AquariumProps {
  children: React.ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Aquarium({ children, position, rotation }: AquariumProps) {
  const ref = useRef<any>(null)
  const mesh = useRef<any>(null)
  const { nodes } = useGLTF('/three/shapes-transformed.glb')
  const stencil = useMask(1, false)

  useLayoutEffect(() => {
    // Apply stencil to all contents
    if (ref.current) {
      ref.current.traverse(
        (child: any) =>
          child.material && Object.assign(child.material, { ...stencil }),
      )
    }
  }, [stencil])

  return (
    <group position={position} rotation={rotation} dispose={null}>
      <mesh
        scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
        geometry={(nodes as any).Cube.geometry}
        ref={mesh}
      >
        <MeshTransmissionMaterial
          samples={4}
          thickness={3}
          chromaticAberration={0.2}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}

interface TurtleProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

function Turtle({ position, rotation, scale }: TurtleProps) {
  const { scene } = useGLTF(
    '/three/model_52a_-_kemps_ridley_sea_turtle_no_id.glb',
  )

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}
