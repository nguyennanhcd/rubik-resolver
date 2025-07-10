'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

const RUBIKS_COLORS: Record<CubeColor, string> = {
  white: '#ffffff',
  yellow: '#eab308',
  red: '#dc2626',
  orange: '#ea580c',
  blue: '#2563eb',
  green: '#16a34a'
}

// Initial 3x3 Cube State (Solved)
const initialCube: CubeState = {
  front: [
    ['green', 'green', 'green'],
    ['green', 'green', 'green'],
    ['green', 'green', 'green']
  ],
  back: [
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue']
  ],
  left: [
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange']
  ],
  right: [
    ['red', 'red', 'red'],
    ['red', 'red', 'red'],
    ['red', 'red', 'red']
  ],
  top: [
    ['white', 'white', 'white'],
    ['white', 'white', 'white'],
    ['white', 'white', 'white']
  ],
  bottom: [
    ['yellow', 'yellow', 'yellow'],
    ['yellow', 'yellow', 'yellow'],
    ['yellow', 'yellow', 'yellow']
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

function SmartCubie({ position, colors, isHighlighted }: SmartCubieProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          color={hovered || isHighlighted ? '#333333' : '#1a1a1a'}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
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
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial
              color={RUBIKS_COLORS[color]}
              roughness={0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

interface Cube3DProps {
  cube: CubeState
  currentMove?: string
}

export function Cube3D({ cube, currentMove }: Cube3DProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current && currentMove) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.01
    }
  })

  const getCubieColors = (x: number, y: number, z: number) => {
    const colors: SmartCubieProps['colors'] = {}

    const getFaceColor = (
      face: CubeFace | undefined,
      row: number,
      col: number
    ) => {
      return face &&
        Array.isArray(face) &&
        Array.isArray(face[row]) &&
        face[row][col]
        ? face[row][col]
        : undefined
    }

    if (z === 1) colors.front = getFaceColor(cube.front, y + 1, x + 1)
    if (z === -1) colors.back = getFaceColor(cube.back, y + 1, 1 - x)
    if (x === 1) colors.right = getFaceColor(cube.right, y + 1, 1 - z)
    if (x === -1) colors.left = getFaceColor(cube.left, y + 1, z + 1)
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

  const createCubelets = () => {
    const cubelets = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue

          const colors = getCubieColors(x, y, z)
          const highlighted = isHighlighted(x, y, z)
          cubelets.push(
            <SmartCubie
              key={`${x}-${y}-${z}`}
              position={[x * 1.05, y * 1.05, z * 1.05]}
              colors={colors}
              isHighlighted={highlighted}
            />
          )
        }
      }
    }
    return cubelets
  }

  return <group ref={groupRef}>{createCubelets()}</group>
}

export default function RubiksCubeScene() {
  const [cube, setCube] = useState<CubeState>(initialCube)
  const [currentMove, setCurrentMove] = useState<string | undefined>()

  const applyMove = (move: string) => {
    setCurrentMove(move)
    setCube((prevCube) => {
      const newCube = JSON.parse(JSON.stringify(prevCube)) // Deep copy

      if (move === 'R') {
        // Rotate right face clockwise
        const temp = [
          [newCube.right[0][0], newCube.right[0][1], newCube.right[0][2]],
          [newCube.right[1][0], newCube.right[1][1], newCube.right[1][2]],
          [newCube.right[2][0], newCube.right[2][1], newCube.right[2][2]]
        ]
        newCube.right[0][0] = temp[2][0]
        newCube.right[0][1] = temp[1][0]
        newCube.right[0][2] = temp[0][0]
        newCube.right[1][0] = temp[2][1]
        newCube.right[1][1] = temp[1][1]
        newCube.right[1][2] = temp[0][1]
        newCube.right[2][0] = temp[2][2]
        newCube.right[2][1] = temp[1][2]
        newCube.right[2][2] = temp[0][2]

        // Update adjacent edges
        const tempTop = [
          newCube.top[0][2],
          newCube.top[1][2],
          newCube.top[2][2]
        ]
        newCube.top[0][2] = newCube.front[0][2]
        newCube.top[1][2] = newCube.front[1][2]
        newCube.top[2][2] = newCube.front[2][2]
        newCube.front[0][2] = newCube.bottom[0][2]
        newCube.front[1][2] = newCube.bottom[1][2]
        newCube.front[2][2] = newCube.bottom[2][2]
        newCube.bottom[0][2] = newCube.back[2][0]
        newCube.bottom[1][2] = newCube.back[1][0]
        newCube.bottom[2][2] = newCube.back[0][0]
        newCube.back[0][0] = tempTop[2]
        newCube.back[1][0] = tempTop[1]
        newCube.back[2][0] = tempTop[0]
      } else if (move === 'U') {
        // Rotate top face clockwise
        const temp = [
          [newCube.top[0][0], newCube.top[0][1], newCube.top[0][2]],
          [newCube.top[1][0], newCube.top[1][1], newCube.top[1][2]],
          [newCube.top[2][0], newCube.top[2][1], newCube.top[2][2]]
        ]
        newCube.top[0][0] = temp[2][0]
        newCube.top[0][1] = temp[1][0]
        newCube.top[0][2] = temp[0][0]
        newCube.top[1][0] = temp[2][1]
        newCube.top[1][1] = temp[1][1]
        newCube.top[1][2] = temp[0][1]
        newCube.top[2][0] = temp[2][2]
        newCube.top[2][1] = temp[1][2]
        newCube.top[2][2] = temp[0][2]

        // Update adjacent edges
        const tempFront = [
          newCube.front[0][0],
          newCube.front[0][1],
          newCube.front[0][2]
        ]
        newCube.front[0][0] = newCube.right[0][0]
        newCube.front[0][1] = newCube.right[0][1]
        newCube.front[0][2] = newCube.right[0][2]
        newCube.right[0][0] = newCube.back[0][0]
        newCube.right[0][1] = newCube.back[0][1]
        newCube.right[0][2] = newCube.back[0][2]
        newCube.back[0][0] = newCube.left[0][0]
        newCube.back[0][1] = newCube.left[0][1]
        newCube.back[0][2] = newCube.left[0][2]
        newCube.left[0][0] = tempFront[0]
        newCube.left[0][1] = tempFront[1]
        newCube.left[0][2] = tempFront[2]
      } else if (move === 'F') {
        // Rotate front face clockwise
        const temp = [
          [newCube.front[0][0], newCube.front[0][1], newCube.front[0][2]],
          [newCube.front[1][0], newCube.front[1][1], newCube.front[1][2]],
          [newCube.front[2][0], newCube.front[2][1], newCube.front[2][2]]
        ]
        newCube.front[0][0] = temp[2][0]
        newCube.front[0][1] = temp[1][0]
        newCube.front[0][2] = temp[0][0]
        newCube.front[1][0] = temp[2][1]
        newCube.front[1][1] = temp[1][1]
        newCube.front[1][2] = temp[0][1]
        newCube.front[2][0] = temp[2][2]
        newCube.front[2][1] = temp[1][2]
        newCube.front[2][2] = temp[0][2]

        // Update adjacent edges
        const tempTop = [
          newCube.top[2][0],
          newCube.top[2][1],
          newCube.top[2][2]
        ]
        newCube.top[2][0] = newCube.left[2][2]
        newCube.top[2][1] = newCube.left[1][2]
        newCube.top[2][2] = newCube.left[0][2]
        newCube.left[0][2] = newCube.bottom[0][0]
        newCube.left[1][2] = newCube.bottom[0][1]
        newCube.left[2][2] = newCube.bottom[0][2]
        newCube.bottom[0][0] = newCube.right[2][0]
        newCube.bottom[0][1] = newCube.right[1][0]
        newCube.bottom[0][2] = newCube.right[0][0]
        newCube.right[0][0] = tempTop[0]
        newCube.right[1][0] = tempTop[1]
        newCube.right[2][0] = tempTop[2]
      }

      return newCube
    })
    setTimeout(() => setCurrentMove(undefined), 1000)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Cube3D cube={cube} currentMove={currentMove} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button
          onClick={() => applyMove('R')}
          style={{ margin: '5px', padding: '10px' }}
        >
          Rotate Right (R)
        </button>
        <button
          onClick={() => applyMove('U')}
          style={{ margin: '5px', padding: '10px' }}
        >
          Rotate Up (U)
        </button>
        <button
          onClick={() => applyMove('F')}
          style={{ margin: '5px', padding: '10px' }}
        >
          Rotate Front (F)
        </button>
      </div>
    </div>
  )
}
