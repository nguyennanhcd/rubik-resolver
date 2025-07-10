'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Mesh, Group } from 'three'

// Type Definitions
type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green'
type CubeFace = CubeColor[][]

interface CubeState {
  front: CubeFace
  back: CubeFace
  left: CubeFace
  right: CubeFace
  top: CubeFace
  bottom: CubeFace
}

const colorToHex: Record<CubeColor, string> = {
  white: '#ffffff',
  yellow: '#ffd700',
  red: '#dc2626',
  orange: '#ea580c',
  blue: '#2563eb',
  green: '#16a34a'
}

// Initial Cube State (Solved 2x2 Cube)
const initialCube: CubeState = {
  front: [
    ['red', 'red'],
    ['red', 'red']
  ],
  back: [
    ['orange', 'orange'],
    ['orange', 'orange']
  ],
  left: [
    ['blue', 'blue'],
    ['blue', 'blue']
  ],
  right: [
    ['green', 'green'],
    ['green', 'green']
  ],
  top: [
    ['white', 'white'],
    ['white', 'white']
  ],
  bottom: [
    ['yellow', 'yellow'],
    ['yellow', 'yellow']
  ]
}

interface SmartCubieProps {
  position: [number, number, number]
  colors: {
    front?: CubeColor
    back?: CubeColor
    left?: CubeColor
    right?: CubeColor
    top?: CubeColor
    bottom?: CubeColor
  }
  isHighlighted?: boolean
}

function SmartCubie({ position, colors }: SmartCubieProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          color={hovered ? '#333333' : '#1a1a1a'}
          metalness={0.1}
          roughness={0.7}
        />
        {Object.entries(colors).map(([face, color]) => {
          if (!color) return null

          let facePosition: [number, number, number] = [0, 0, 0]
          let faceRotation: [number, number, number] = [0, 0, 0]

          switch (face) {
            case 'front':
              facePosition = [0, 0, 0.48]
              break
            case 'back':
              facePosition = [0, 0, -0.48]
              faceRotation = [0, Math.PI, 0]
              break
            case 'right':
              facePosition = [0.48, 0, 0]
              faceRotation = [0, Math.PI / 2, 0]
              break
            case 'left':
              facePosition = [-0.48, 0, 0]
              faceRotation = [0, -Math.PI / 2, 0]
              break
            case 'top':
              facePosition = [0, 0.48, 0]
              faceRotation = [-Math.PI / 2, 0, 0]
              break
            case 'bottom':
              facePosition = [0, -0.48, 0]
              faceRotation = [Math.PI / 2, 0, 0]
              break
          }

          return (
            <mesh key={face} position={facePosition} rotation={faceRotation}>
              <planeGeometry args={[0.85, 0.85]} />
              <meshStandardMaterial
                color={colorToHex[color]}
                metalness={0.1}
                roughness={0.3}
              />
              <mesh>
                <planeGeometry args={[0.9, 0.9]} />
                <meshStandardMaterial
                  color='#000000'
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </mesh>
          )
        })}
      </mesh>
    </group>
  )
}

// EnhancedCube3D Component
export function EnhancedCube3D({
  cube,
  currentMove
}: {
  cube: CubeState
  currentMove?: string
}) {
  const groupRef = useRef<Group>(null)

  const getCubieColors = (x: number, y: number, z: number) => {
    const colors: SmartCubieProps['colors'] = {}

    const getFaceColor = (
      face: CubeFace | undefined,
      row: number,
      col: number
    ) => {
      return face && Array.isArray(face) && Array.isArray(face[row])
        ? face[row][col]
        : undefined
    }

    if (z === 1) colors.front = getFaceColor(cube.front, 1 - y, x + 1)
    if (z === -1) colors.back = getFaceColor(cube.back, 1 - y, 1 - x)
    if (x === 1) colors.right = getFaceColor(cube.right, 1 - y, 1 - z)
    if (x === -1) colors.left = getFaceColor(cube.left, 1 - y, z + 1)
    if (y === 1) colors.top = getFaceColor(cube.top, 1 - z, x + 1)
    if (y === -1) colors.bottom = getFaceColor(cube.bottom, z + 1, x + 1)

    return colors
  }

  const isHighlighted = (x: number, y: number, z: number) => {
    if (!currentMove) return false

    switch (currentMove.charAt(0)) {
      case 'R':
        return x === 1
      case 'L':
        return x === -1
      case 'U':
        return y === 1
      case 'D':
        return y === -1
      case 'F':
        return z === 1
      case 'B':
        return z === -1
      default:
        return false
    }
  }

  return (
    <group>
      <group ref={groupRef}>
        {[-1, 0, 1].map((x) =>
          [-1, 0, 1].map((y) =>
            [-1, 0, 1].map((z) => {
              if (x === 0 && y === 0 && z === 0) return null

              const colors = getCubieColors(x, y, z)
              const highlighted = isHighlighted(x, y, z)

              return (
                <SmartCubie
                  key={`${x}-${y}-${z}`}
                  position={[x, y, z]}
                  colors={colors}
                  isHighlighted={highlighted}
                />
              )
            })
          )
        )}
      </group>
    </group>
  )
}

// Parent Component
export default function RubiksCubeScene() {
  const [cube, setCube] = useState<CubeState>(initialCube)
  const [currentMove, setCurrentMove] = useState<string | undefined>()

  // Simple move handler (example for 'R' move)
  const applyMove = (move: string) => {
    setCurrentMove(move)
    setCube((prevCube) => {
      const newCube = JSON.parse(JSON.stringify(prevCube)) // Deep copy
      if (move === 'R') {
        // Rotate right face clockwise
        const temp = newCube.right[0][0]
        newCube.right[0][0] = newCube.right[1][0]
        newCube.right[1][0] = newCube.right[1][1]
        newCube.right[1][1] = newCube.right[0][1]
        newCube.right[0][1] = temp
        // Update adjacent edges (simplified for 2x2)
        const tempTop = newCube.top[0][1]
        newCube.top[0][1] = newCube.front[0][1]
        newCube.front[0][1] = newCube.bottom[1][1]
        newCube.bottom[1][1] = newCube.back[0][0]
        newCube.back[0][0] = tempTop
      }
      return newCube
    })
    // Clear move after animation (simplified)
    setTimeout(() => setCurrentMove(undefined), 1000)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <EnhancedCube3D cube={cube} currentMove={currentMove} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button onClick={() => applyMove('R')}>Rotate Right (R)</button>
        <button onClick={() => applyMove('U')}>Rotate Up (U)</button>
        <button onClick={() => applyMove('F')}>Rotate Front (F)</button>
      </div>
    </div>
  )
}
