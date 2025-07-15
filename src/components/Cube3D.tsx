'use client'

import { useRef, useState } from 'react'
import type { Group, Mesh } from 'three'

// Type Definitions
type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green'
type CubeFace = CubeColor[][]
export type Move =
  | 'U'
  | "U'"
  | 'U2'
  | 'D'
  | "D'"
  | 'D2'
  | 'L'
  | "L'"
  | 'L2'
  | 'R'
  | "R'"
  | 'R2'
  | 'F'
  | "F'"
  | 'F2'
  | 'B'
  | "B'"
  | 'B2'

export interface CubeState {
  front: CubeFace
  back: CubeFace
  left: CubeFace
  right: CubeFace
  top: CubeFace
  bottom: CubeFace
}

const RUBIKS_COLORS: Record<CubeColor, string> = {
  white: '#f4f4f4',
  yellow: '#ffd85f',
  red: '#e06357',
  orange: '#f08b46',
  blue: '#4c74f0',
  green: '#53d178'
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
  currentMove?: Move
  onMoveComplete?: (newCubeState?: CubeState) => void
}

export function Cube3D({ cube }: Cube3DProps) {
  const groupRef = useRef<Group>(null)

  // Only render the cube based on the passed-in cube state
  const getCubieColors = (x: number, y: number, z: number) => {
    const colors: SmartCubieProps['colors'] = {}
    const getFaceColor = (
      face: CubeFace | undefined,
      row: number,
      col: number
    ) =>
      face && Array.isArray(face) && Array.isArray(face[row]) && face[row][col]
        ? face[row][col]
        : undefined

    if (z === 1) colors.front = getFaceColor(cube.front, 1 - y, x + 1)
    if (z === -1) colors.back = getFaceColor(cube.back, 1 - y, 1 - x)
    if (x === 1) colors.right = getFaceColor(cube.right, 1 - y, 1 - z)
    if (x === -1) colors.left = getFaceColor(cube.left, 1 - y, z + 1)
    if (y === 1) colors.top = getFaceColor(cube.top, 1 - z, x + 1)
    if (y === -1) colors.bottom = getFaceColor(cube.bottom, z + 1, x + 1)
    return colors
  }

  const createCubelets = () => {
    const cubelets = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue
          const colors = getCubieColors(x, y, z)
          cubelets.push(
            <SmartCubie
              key={`${x}-${y}-${z}`}
              position={[x * 1.05, y * 1.05, z * 1.05]}
              colors={colors}
            />
          )
        }
      }
    }
    return cubelets
  }

  return <group ref={groupRef}>{createCubelets()}</group>
}

export default Cube3D
