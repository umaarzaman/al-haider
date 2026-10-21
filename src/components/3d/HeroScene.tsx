import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function PizzaModel({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.3
    groupRef.current.rotation.x += (mouseY * 0.3 - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.z += (mouseX * -0.15 - groupRef.current.rotation.z) * 0.05
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Pizza base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.15, 48]} />
          <meshStandardMaterial color="#c8763a" roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Crust ring */}
        <mesh position={[0, 0.07, 0]}>
          <torusGeometry args={[2.1, 0.18, 12, 48]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        {/* Sauce layer */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[1.9, 1.9, 0.05, 48]} />
          <meshStandardMaterial color="#c0392b" roughness={0.7} />
        </mesh>
        {/* Cheese layer */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[1.85, 1.85, 0.04, 48]} />
          <meshStandardMaterial color="#f5c842" roughness={0.6} metalness={0.05} />
        </mesh>
        {/* Toppings - pepperoni-like circles */}
        {[
          [0.6, 0.16, 0.3],
          [-0.5, 0.16, 0.7],
          [0.9, 0.16, -0.6],
          [-0.8, 0.16, -0.4],
          [0, 0.16, -0.9],
          [1.2, 0.16, 0.2],
          [-1.1, 0.16, 0.5],
          [0.3, 0.16, 1.0],
          [-0.3, 0.16, -1.1],
          [1.0, 0.16, -1.0],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
            <meshStandardMaterial color="#8B1A1A" roughness={0.8} />
          </mesh>
        ))}
        {/* Olive-like dots */}
        {[
          [0.2, 0.17, 0.6],
          [-0.7, 0.17, -0.2],
          [1.0, 0.17, 0.8],
        ].map(([x, y, z], i) => (
          <mesh key={`olive-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#2d4a1e" roughness={0.7} />
          </mesh>
        ))}
      </Float>
    </group>
  )
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        color="#fbbf24"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 3, -3]} intensity={1} color="#ffffff" />
      <pointLight position={[0, -2, 4]} intensity={0.5} color="#f59e0b" />
      <Environment preset="night" />
      <PizzaModel mouseX={mouseX} mouseY={mouseY} />
    </>
  )
}

export function HeroScene() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 })
  const [webglOk, setWebglOk] = React.useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    })
  }

  if (!webglOk) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-9xl select-none opacity-80">🍕</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full" onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 40 }}
        shadows
        dpr={[1, 2]}
        onCreated={(state) => {
          if (!state.gl) setWebglOk(false)
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene mouseX={mouse.x} mouseY={mouse.y} />
        </Suspense>
      </Canvas>
    </div>
  )
}
