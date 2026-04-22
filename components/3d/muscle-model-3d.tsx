"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { strengthLevelColors, strengthLevelEmissive, type StrengthLevel } from "@/lib/strength-calculator"

interface MuscleModel3DProps {
  muscleStrengths: Record<string, StrengthLevel>
  viewSide: "front" | "back"
  onMuscleHover: (muscle: string | null) => void
  resetTrigger: number
  gender: string
}

// Muscle mesh definitions with anatomically accurate positions
interface MuscleMesh {
  name: string
  displayName: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation?: [number, number, number]
  geometry: "sphere" | "box" | "capsule" | "cylinder"
  view: "front" | "back" | "both"
}

const maleMuscles: MuscleMesh[] = [
  // HEAD
  {
    name: "neck",
    displayName: "Neck",
    position: [0, 1.58, 0],
    scale: [0.12, 0.08, 0.1],
    geometry: "cylinder",
    view: "both",
  },

  // SHOULDERS & TRAPS
  {
    name: "traps",
    displayName: "Trapezius",
    position: [0, 1.52, -0.03],
    scale: [0.28, 0.08, 0.12],
    geometry: "box",
    view: "back",
  },
  {
    name: "shoulder_left",
    displayName: "Left Deltoid",
    position: [-0.24, 1.38, 0],
    scale: [0.1, 0.08, 0.1],
    geometry: "sphere",
    view: "both",
  },
  {
    name: "shoulder_right",
    displayName: "Right Deltoid",
    position: [0.24, 1.38, 0],
    scale: [0.1, 0.08, 0.1],
    geometry: "sphere",
    view: "both",
  },
  {
    name: "rear_delts",
    displayName: "Rear Deltoids",
    position: [0, 1.36, -0.08],
    scale: [0.32, 0.06, 0.06],
    geometry: "box",
    view: "back",
  },

  // CHEST
  {
    name: "chest_left",
    displayName: "Left Pec",
    position: [-0.1, 1.28, 0.08],
    scale: [0.12, 0.08, 0.06],
    geometry: "sphere",
    view: "front",
  },
  {
    name: "chest_right",
    displayName: "Right Pec",
    position: [0.1, 1.28, 0.08],
    scale: [0.12, 0.08, 0.06],
    geometry: "sphere",
    view: "front",
  },
  {
    name: "serratus",
    displayName: "Serratus",
    position: [0, 1.18, 0.04],
    scale: [0.2, 0.06, 0.04],
    geometry: "box",
    view: "front",
  },

  // BACK
  {
    name: "lat_left",
    displayName: "Left Lat",
    position: [-0.14, 1.18, -0.06],
    scale: [0.1, 0.14, 0.06],
    geometry: "box",
    view: "back",
  },
  {
    name: "lat_right",
    displayName: "Right Lat",
    position: [0.14, 1.18, -0.06],
    scale: [0.1, 0.14, 0.06],
    geometry: "box",
    view: "back",
  },
  {
    name: "lower_back",
    displayName: "Lower Back",
    position: [0, 1.0, -0.06],
    scale: [0.16, 0.12, 0.06],
    geometry: "box",
    view: "back",
  },

  // ARMS
  {
    name: "bicep_left",
    displayName: "Left Bicep",
    position: [-0.28, 1.22, 0.02],
    scale: [0.055, 0.1, 0.055],
    geometry: "capsule",
    view: "front",
  },
  {
    name: "bicep_right",
    displayName: "Right Bicep",
    position: [0.28, 1.22, 0.02],
    scale: [0.055, 0.1, 0.055],
    geometry: "capsule",
    view: "front",
  },
  {
    name: "tricep_left",
    displayName: "Left Tricep",
    position: [-0.28, 1.22, -0.03],
    scale: [0.05, 0.1, 0.045],
    geometry: "capsule",
    view: "back",
  },
  {
    name: "tricep_right",
    displayName: "Right Tricep",
    position: [0.28, 1.22, -0.03],
    scale: [0.05, 0.1, 0.045],
    geometry: "capsule",
    view: "back",
  },
  {
    name: "forearm_left",
    displayName: "Left Forearm",
    position: [-0.3, 1.02, 0],
    scale: [0.04, 0.1, 0.04],
    geometry: "capsule",
    view: "both",
  },
  {
    name: "forearm_right",
    displayName: "Right Forearm",
    position: [0.3, 1.02, 0],
    scale: [0.04, 0.1, 0.04],
    geometry: "capsule",
    view: "both",
  },

  // CORE
  {
    name: "abs",
    displayName: "Abdominals",
    position: [0, 1.06, 0.06],
    scale: [0.12, 0.14, 0.04],
    geometry: "box",
    view: "front",
  },
  {
    name: "obliques",
    displayName: "Obliques",
    position: [0, 1.04, 0.03],
    scale: [0.18, 0.1, 0.04],
    geometry: "box",
    view: "front",
  },

  // GLUTES
  {
    name: "glute_left",
    displayName: "Left Glute",
    position: [-0.1, 0.88, -0.06],
    scale: [0.1, 0.08, 0.08],
    geometry: "sphere",
    view: "back",
  },
  {
    name: "glute_right",
    displayName: "Right Glute",
    position: [0.1, 0.88, -0.06],
    scale: [0.1, 0.08, 0.08],
    geometry: "sphere",
    view: "back",
  },

  // LEGS - QUADS
  {
    name: "quad_left",
    displayName: "Left Quad",
    position: [-0.1, 0.65, 0.04],
    scale: [0.08, 0.18, 0.08],
    geometry: "capsule",
    view: "front",
  },
  {
    name: "quad_right",
    displayName: "Right Quad",
    position: [0.1, 0.65, 0.04],
    scale: [0.08, 0.18, 0.08],
    geometry: "capsule",
    view: "front",
  },

  // LEGS - HAMSTRINGS
  {
    name: "hamstring_left",
    displayName: "Left Hamstring",
    position: [-0.1, 0.65, -0.04],
    scale: [0.07, 0.16, 0.06],
    geometry: "capsule",
    view: "back",
  },
  {
    name: "hamstring_right",
    displayName: "Right Hamstring",
    position: [0.1, 0.65, -0.04],
    scale: [0.07, 0.16, 0.06],
    geometry: "capsule",
    view: "back",
  },

  // LEGS - ADDUCTORS
  {
    name: "adductors",
    displayName: "Adductors",
    position: [0, 0.7, 0],
    scale: [0.08, 0.12, 0.06],
    geometry: "box",
    view: "front",
  },

  // CALVES
  {
    name: "calf_left",
    displayName: "Left Calf",
    position: [-0.1, 0.35, -0.02],
    scale: [0.05, 0.12, 0.06],
    geometry: "capsule",
    view: "both",
  },
  {
    name: "calf_right",
    displayName: "Right Calf",
    position: [0.1, 0.35, -0.02],
    scale: [0.05, 0.12, 0.06],
    geometry: "capsule",
    view: "both",
  },
  {
    name: "tibialis",
    displayName: "Tibialis",
    position: [0, 0.38, 0.03],
    scale: [0.12, 0.1, 0.04],
    geometry: "box",
    view: "front",
  },
]

// Female proportions (adjusted from male)
const femaleMuscles: MuscleMesh[] = maleMuscles.map((muscle) => ({
  ...muscle,
  scale:
    muscle.name.includes("shoulder") || muscle.name.includes("bicep") || muscle.name.includes("tricep")
      ? ([muscle.scale[0] * 0.85, muscle.scale[1] * 0.9, muscle.scale[2] * 0.85] as [number, number, number])
      : muscle.name.includes("glute") || muscle.name.includes("quad") || muscle.name.includes("hamstring")
        ? ([muscle.scale[0] * 1.1, muscle.scale[1], muscle.scale[2] * 1.1] as [number, number, number])
        : muscle.name.includes("chest")
          ? ([muscle.scale[0] * 0.8, muscle.scale[1] * 0.7, muscle.scale[2] * 0.8] as [number, number, number])
          : muscle.scale,
}))

function MusclePart({
  mesh,
  strength,
  isHovered,
  onHover,
  viewSide,
}: {
  mesh: MuscleMesh
  strength: StrengthLevel
  isHovered: boolean
  onHover: (name: string | null) => void
  viewSide: "front" | "back"
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = strengthLevelColors[strength]
  const emissive = strengthLevelEmissive[strength]

  // Only show muscles relevant to current view
  const isVisible = mesh.view === "both" || mesh.view === viewSide

  // Smooth hover animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.08 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const geometry = useMemo(() => {
    switch (mesh.geometry) {
      case "sphere":
        return new THREE.SphereGeometry(1, 32, 32)
      case "box":
        return new THREE.BoxGeometry(1, 1, 1, 4, 4, 4)
      case "capsule":
        return new THREE.CapsuleGeometry(1, 1, 8, 16)
      case "cylinder":
        return new THREE.CylinderGeometry(1, 1, 1, 16)
      default:
        return new THREE.SphereGeometry(1, 32, 32)
    }
  }, [mesh.geometry])

  if (!isVisible) return null

  return (
    <mesh
      ref={meshRef}
      position={mesh.position}
      scale={mesh.scale}
      rotation={mesh.rotation ? mesh.rotation : undefined}
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(mesh.name)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = "auto"
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive.color}
        emissiveIntensity={isHovered ? emissive.intensity + 0.3 : emissive.intensity}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

function BodyFrame({ gender }: { gender: string }) {
  // Simple body frame/skeleton to give structure
  const frameColor = "#1a1a1a"

  return (
    <group>
      {/* Torso */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.18]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Upper legs */}
      <mesh position={[-0.1, 0.65, 0]}>
        <capsuleGeometry args={[0.055, 0.25, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.65, 0]}>
        <capsuleGeometry args={[0.055, 0.25, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Lower legs */}
      <mesh position={[-0.1, 0.32, 0]}>
        <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.32, 0]}>
        <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.1, 0.12, 0.03]}>
        <boxGeometry args={[0.06, 0.04, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.12, 0.03]}>
        <boxGeometry args={[0.06, 0.04, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Upper arms */}
      <mesh position={[-0.28, 1.22, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.035, 0.15, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.28, 1.22, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.035, 0.15, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Lower arms */}
      <mesh position={[-0.3, 0.98, 0]}>
        <capsuleGeometry args={[0.025, 0.15, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.98, 0]}>
        <capsuleGeometry args={[0.025, 0.15, 8, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.31, 0.82, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.31, 0.82, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
    </group>
  )
}

function AnatomicalModel({
  muscleStrengths,
  viewSide,
  onMuscleHover,
  hoveredMuscle,
  gender,
}: {
  muscleStrengths: Record<string, StrengthLevel>
  viewSide: "front" | "back"
  onMuscleHover: (muscle: string | null) => void
  hoveredMuscle: string | null
  gender: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const muscles = gender === "female" ? femaleMuscles : maleMuscles

  // Rotate model based on view
  useFrame(() => {
    if (groupRef.current) {
      const targetRotation = viewSide === "back" ? Math.PI : 0
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.05)
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      <BodyFrame gender={gender} />
      {muscles.map((mesh) => (
        <MusclePart
          key={mesh.name}
          mesh={mesh}
          strength={muscleStrengths[mesh.name] || "average"}
          isHovered={hoveredMuscle === mesh.name}
          onHover={onMuscleHover}
          viewSide={viewSide}
        />
      ))}
    </group>
  )
}

function CameraController({ resetTrigger }: { resetTrigger: number }) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      camera.position.set(0, 0.8, 2.5)
      controlsRef.current.target.set(0, 0.5, 0)
      controlsRef.current.update()
    }
  }, [resetTrigger, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={1.5}
      maxDistance={4}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      target={[0, 0.5, 0]}
    />
  )
}

export function MuscleModel3D({ muscleStrengths, viewSide, onMuscleHover, resetTrigger, gender }: MuscleModel3DProps) {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null)

  const handleHover = (muscle: string | null) => {
    setHoveredMuscle(muscle)
    onMuscleHover(muscle)
  }

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#000000" }}
      >
        {/* Lighting setup for clear color visibility */}
        <ambientLight intensity={0.5} color="#404040" />
        <directionalLight position={[3, 5, 4]} intensity={1} color="#FFFFFF" />
        <directionalLight position={[-3, 4, -2]} intensity={0.6} color="#FFFFFF" />
        <hemisphereLight args={["#FFFFFF", "#444444", 0.4]} />

        <AnatomicalModel
          muscleStrengths={muscleStrengths}
          viewSide={viewSide}
          onMuscleHover={handleHover}
          hoveredMuscle={hoveredMuscle}
          gender={gender}
        />

        <CameraController resetTrigger={resetTrigger} />
      </Canvas>
    </div>
  )
}
