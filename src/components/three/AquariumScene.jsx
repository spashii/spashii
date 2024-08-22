"use client";
import { useLayoutEffect, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMask, useGLTF, useAnimations, Float, CameraControls } from '@react-three/drei'
import { Lightformer, Environment, MeshTransmissionMaterial } from '@react-three/drei'

export function AquariumScene() {
  return (
    <Canvas shadows camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 50 }}>
      {/** Glass aquarium */}
      <Aquarium position={[0, 0.25, 0]} rotation={[0.4, 0.5, 0.2]}>
        <Float rotationIntensity={2} floatIntensity={10} speed={2}>
          <Turtle position={[0, -0.5, -1]} rotation={[0, Math.PI, 0]} scale={23} />
        </Float>
      </Aquarium>
      {/** Soft shadows */}
      {/* <AccumulativeShadows temporal frames={100} color="lightblue" colorBlend={2} opacity={0.7} scale={60} position={[0, -5, 0]}>
        <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
      </AccumulativeShadows> */}
      {/** Custom environment map */}
      <Environment resolution={1024}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
      <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI} />
    </Canvas>
  )
}

function Aquarium({ children, ...props }) {
  const ref = useRef()
  const mesh = useRef()
  const { nodes } = useGLTF('/three/shapes-transformed.glb')
  const stencil = useMask(1, false)

  useLayoutEffect(() => {
    // Apply stencil to all contents
    ref.current.traverse((child) => child.material && Object.assign(child.material, { ...stencil }))
  }, [])


  useFrame(({ clock }) => {
    mesh.current.rotation.y = Math.sin(clock.getElapsedTime() / 2) / 10;
    mesh.current.rotation.z = Math.sin(clock.getElapsedTime() / 2) / 5;
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() / 2) / 10;
  })

  return (
    <group {...props} dispose={null}>
      <mesh scale={[0.61 * 6, 0.8 * 6, 1 * 6]} geometry={nodes.Cube.geometry} ref={mesh}>
        <MeshTransmissionMaterial
          // backside
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

/*
Author: DigitalLife3D (https://sketchfab.com/DigitalLife3D)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/model-52a-kemps-ridley-sea-turtle-no-id-7aba937dfbce480fb3aca47be3a9740b
Title: Model 52A - Kemps Ridley Sea Turtle (no ID)
*/


function Turtle(props) {
  const { scene, animations } = useGLTF('/three/model_52a_-_kemps_ridley_sea_turtle_no_id.glb');
  const { actions, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    mixer.timeScale = 0.5;
    actions['Swim Cycle'].play();
  }, [actions, mixer]);

  return <primitive object={scene} {...props} />;
}

export default Turtle;
