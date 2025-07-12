'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { Vector3 } from 'three' // Import Vector3
import { CubeState } from '@/interfaces/cubeState'

// Type Definitions
type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green'
type CubeFace = CubeColor[][]
type Move =
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
  onMoveComplete?: () => void
}

export function Cube3D({ cube, currentMove, onMoveComplete }: Cube3DProps) {
  const groupRef = useRef<Group>(null)
  const rotationProgress = useRef(0)
  const isAnimating = useRef(false)

  useFrame((state, delta) => {
    if (groupRef.current && currentMove && isAnimating.current) {
      const speed = 2 // Rotation speed (radians per second)
      let targetAngle: number
      switch (currentMove) {
        case 'U2':
        case 'D2':
        case 'L2':
        case 'R2':
        case 'F2':
        case 'B2':
          targetAngle = Math.PI // 180 degrees for double moves
          break
        case "U'":
        case "D'":
        case "L'":
        case "R'":
        case "F'":
        case "B'":
          targetAngle = -Math.PI / 2 // -90 degrees for counterclockwise
          break
        default:
          targetAngle = Math.PI / 2 // 90 degrees for clockwise
      }

      rotationProgress.current += delta * speed
      const progress = Math.min(
        rotationProgress.current / (Math.abs(targetAngle) / speed),
        1
      )

      let axis: [number, number, number] = [0, 0, 0]
      let faceCubies: [number, number, number][] = []

      switch (currentMove.charAt(0)) {
        case 'U':
          axis = [0, 1, 0]
          faceCubies = [
            [-1, 1, -1],
            [-1, 1, 0],
            [-1, 1, 1],
            [0, 1, -1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 1, -1],
            [1, 1, 0],
            [1, 1, 1]
          ]
          break
        case 'D':
          axis = [0, -1, 0]
          faceCubies = [
            [-1, -1, -1],
            [-1, -1, 0],
            [-1, -1, 1],
            [0, -1, -1],
            [0, -1, 0],
            [0, -1, 1],
            [1, -1, -1],
            [1, -1, 0],
            [1, -1, 1]
          ]
          break
        case 'L':
          axis = [-1, 0, 0]
          faceCubies = [
            [-1, -1, -1],
            [-1, -1, 0],
            [-1, -1, 1],
            [-1, 0, -1],
            [-1, 0, 0],
            [-1, 0, 1],
            [-1, 1, -1],
            [-1, 1, 0],
            [-1, 1, 1]
          ]
          break
        case 'R':
          axis = [1, 0, 0]
          faceCubies = [
            [1, -1, -1],
            [1, -1, 0],
            [1, -1, 1],
            [1, 0, -1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, -1],
            [1, 1, 0],
            [1, 1, 1]
          ]
          break
        case 'F':
          axis = [0, 0, 1]
          faceCubies = [
            [-1, -1, 1],
            [-1, 0, 1],
            [-1, 1, 1],
            [0, -1, 1],
            [0, 0, 1],
            [0, 1, 1],
            [1, -1, 1],
            [1, 0, 1],
            [1, 1, 1]
          ]
          break
        case 'B':
          axis = [0, 0, -1]
          faceCubies = [
            [-1, -1, -1],
            [-1, 0, -1],
            [-1, 1, -1],
            [0, -1, -1],
            [0, 0, -1],
            [0, 1, -1],
            [1, -1, -1],
            [1, 0, -1],
            [1, 1, -1]
          ]
          break
      }

      const vectorAxis = new Vector3(...axis) // Convert axis array to Vector3
      const angle = targetAngle * progress
      groupRef.current.children.forEach((child) => {
        const pos = child.position.toArray() as [number, number, number]
        if (
          faceCubies.some(
            ([fx, fy, fz]) =>
              pos[0] === fx * 1.05 &&
              pos[1] === fy * 1.05 &&
              pos[2] === fz * 1.05
          )
        ) {
          child.rotation.set(0, 0, 0) // Reset rotation
          child.rotateOnWorldAxis(vectorAxis, angle) // Use Vector3 for axis
        }
      })

      if (progress >= 1) {
        isAnimating.current = false
        rotationProgress.current = 0
        if (onMoveComplete) onMoveComplete()
      }
    } else if (groupRef.current && !currentMove) {
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

  useEffect(() => {
    if (currentMove) {
      isAnimating.current = true
    }
  }, [currentMove])

  return <group ref={groupRef}>{createCubelets()}</group>
}

export default Cube3D
