'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { Vector3, Group as ThreeGroup } from 'three'

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

export function Cube3D({ cube, currentMove, onMoveComplete }: Cube3DProps) {
  const groupRef = useRef<Group>(null)
  const rotationProgress = useRef(0)
  const isAnimating = useRef(false)
  const moveQueue = useRef<Move[]>([])
  const rotatingGroupRef = useRef<ThreeGroup | null>(null)

  // Helper to rotate a face 90° clockwise
  const rotateFaceClockwise = (face: CubeFace): CubeFace => {
    const newFace: CubeFace = [[], [], []]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newFace[i][j] = face[2 - j][i]
      }
    }
    return newFace
  }

  // Helper to rotate a face 90° counterclockwise
  const rotateFaceCounterClockwise = (face: CubeFace): CubeFace => {
    const newFace: CubeFace = [[], [], []]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newFace[i][j] = face[j][2 - i]
      }
    }
    return newFace
  }

  // Update CubeState based on move
  const updateCubeState = (cube: CubeState, move: Move): CubeState => {
    const newCube = JSON.parse(JSON.stringify(cube)) // Deep copy
    switch (move) {
      case 'U':
        newCube.top = rotateFaceClockwise(cube.top)
        {
          const temp = [...cube.front[0]]
          newCube.front[0] = [...cube.right[0]]
          newCube.right[0] = [...cube.back[0]]
          newCube.back[0] = [...cube.left[0]]
          newCube.left[0] = temp
        }
        break
      case "U'":
        newCube.top = rotateFaceCounterClockwise(cube.top)
        {
          const temp = [...cube.front[0]]
          newCube.front[0] = [...cube.left[0]]
          newCube.left[0] = [...cube.back[0]]
          newCube.back[0] = [...cube.right[0]]
          newCube.right[0] = temp
        }
        break
      case 'U2':
        newCube.top = rotateFaceClockwise(rotateFaceClockwise(cube.top))
        {
          const temp = [...cube.front[0]]
          newCube.front[0] = [...cube.back[0]]
          newCube.back[0] = temp
          const temp2 = [...cube.left[0]]
          newCube.left[0] = [...cube.right[0]]
          newCube.right[0] = temp2
        }
        break
      case 'D':
        newCube.bottom = rotateFaceClockwise(cube.bottom)
        {
          const temp = [...cube.front[2]]
          newCube.front[2] = [...cube.left[2]]
          newCube.left[2] = [...cube.back[2]]
          newCube.back[2] = [...cube.right[2]]
          newCube.right[2] = temp
        }
        break
      case "D'":
        newCube.bottom = rotateFaceCounterClockwise(cube.bottom)
        {
          const temp = [...cube.front[2]]
          newCube.front[2] = [...cube.right[2]]
          newCube.right[2] = [...cube.back[2]]
          newCube.back[2] = [...cube.left[2]]
          newCube.left[2] = temp
        }
        break
      case 'D2':
        newCube.bottom = rotateFaceClockwise(rotateFaceClockwise(cube.bottom))
        {
          const temp = [...cube.front[2]]
          newCube.front[2] = [...cube.back[2]]
          newCube.back[2] = temp
          const temp2 = [...cube.left[2]]
          newCube.left[2] = [...cube.right[2]]
          newCube.right[2] = temp2
        }
        break
      case 'L':
        newCube.left = rotateFaceClockwise(cube.left)
        {
          const temp = [cube.front[0][0], cube.front[1][0], cube.front[2][0]]
          newCube.front[0][0] = cube.bottom[0][0]
          newCube.front[1][0] = cube.bottom[1][0]
          newCube.front[2][0] = cube.bottom[2][0]
          newCube.bottom[0][0] = cube.back[2][2]
          newCube.bottom[1][0] = cube.back[1][2]
          newCube.bottom[2][0] = cube.back[0][2]
          newCube.back[0][2] = cube.top[2][0]
          newCube.back[1][2] = cube.top[1][0]
          newCube.back[2][2] = cube.top[0][0]
          newCube.top[0][0] = temp[0]
          newCube.top[1][0] = temp[1]
          newCube.top[2][0] = temp[2]
        }
        break
      case "L'":
        newCube.left = rotateFaceCounterClockwise(cube.left)
        {
          const temp = [cube.front[0][0], cube.front[1][0], cube.front[2][0]]
          newCube.front[0][0] = cube.top[0][0]
          newCube.front[1][0] = cube.top[1][0]
          newCube.front[2][0] = cube.top[2][0]
          newCube.top[0][0] = cube.back[2][2]
          newCube.top[1][0] = cube.back[1][2]
          newCube.top[2][0] = cube.back[0][2]
          newCube.back[0][2] = cube.bottom[2][0]
          newCube.back[1][2] = cube.bottom[1][0]
          newCube.back[2][2] = cube.bottom[0][0]
          newCube.bottom[0][0] = temp[0]
          newCube.bottom[1][0] = temp[1]
          newCube.bottom[2][0] = temp[2]
        }
        break
      case 'L2':
        newCube.left = rotateFaceClockwise(rotateFaceClockwise(cube.left))
        {
          const temp = [cube.front[0][0], cube.front[1][0], cube.front[2][0]]
          newCube.front[0][0] = cube.back[2][2]
          newCube.front[1][0] = cube.back[1][2]
          newCube.front[2][0] = cube.back[0][2]
          newCube.back[0][2] = temp[0]
          newCube.back[1][2] = temp[1]
          newCube.back[2][2] = temp[2]
          const temp2 = [cube.top[0][0], cube.top[1][0], cube.top[2][0]]
          newCube.top[0][0] = cube.bottom[0][0]
          newCube.top[1][0] = cube.bottom[1][0]
          newCube.top[2][0] = cube.bottom[2][0]
          newCube.bottom[0][0] = temp2[0]
          newCube.bottom[1][0] = temp2[1]
          newCube.bottom[2][0] = temp2[2]
        }
        break
      case 'R':
        newCube.right = rotateFaceClockwise(cube.right)
        {
          const temp = [cube.front[0][2], cube.front[1][2], cube.front[2][2]]
          newCube.front[0][2] = cube.top[0][2]
          newCube.front[1][2] = cube.top[1][2]
          newCube.front[2][2] = cube.top[2][2]
          newCube.top[0][2] = cube.back[2][0]
          newCube.top[1][2] = cube.back[1][0]
          newCube.top[2][2] = cube.back[0][0]
          newCube.back[0][0] = cube.bottom[2][2]
          newCube.back[1][0] = cube.bottom[1][2]
          newCube.back[2][0] = cube.bottom[0][2]
          newCube.bottom[0][2] = temp[0]
          newCube.bottom[1][2] = temp[1]
          newCube.bottom[2][2] = temp[2]
        }
        break
      case "R'":
        newCube.right = rotateFaceCounterClockwise(cube.right)
        {
          const temp = [cube.front[0][2], cube.front[1][2], cube.front[2][2]]
          newCube.front[0][2] = cube.bottom[0][2]
          newCube.front[1][2] = cube.bottom[1][2]
          newCube.front[2][2] = cube.bottom[2][2]
          newCube.bottom[0][2] = cube.back[2][0]
          newCube.bottom[1][2] = cube.back[1][0]
          newCube.bottom[2][2] = cube.back[0][0]
          newCube.back[0][0] = cube.top[2][2]
          newCube.back[1][0] = cube.top[1][2]
          newCube.back[2][0] = cube.top[0][2]
          newCube.top[0][2] = temp[0]
          newCube.top[1][2] = temp[1]
          newCube.top[2][2] = temp[2]
        }
        break
      case 'R2':
        newCube.right = rotateFaceClockwise(rotateFaceClockwise(cube.right))
        {
          const temp = [cube.front[0][2], cube.front[1][2], cube.front[2][2]]
          newCube.front[0][2] = cube.back[2][0]
          newCube.front[1][2] = cube.back[1][0]
          newCube.front[2][2] = cube.back[0][0]
          newCube.back[0][0] = temp[0]
          newCube.back[1][0] = temp[1]
          newCube.back[2][0] = temp[2]
          const temp2 = [cube.top[0][2], cube.top[1][2], cube.top[2][2]]
          newCube.top[0][2] = cube.bottom[0][2]
          newCube.top[1][2] = cube.bottom[1][2]
          newCube.top[2][2] = cube.bottom[2][2]
          newCube.bottom[0][2] = temp2[0]
          newCube.bottom[1][2] = temp2[1]
          newCube.bottom[2][2] = temp2[2]
        }
        break
      case 'F':
        newCube.front = rotateFaceClockwise(cube.front)
        {
          const temp = [cube.top[2][0], cube.top[2][1], cube.top[2][2]]
          newCube.top[2][0] = cube.left[2][2]
          newCube.top[2][1] = cube.left[1][2]
          newCube.top[2][2] = cube.left[0][2]
          newCube.left[0][2] = cube.bottom[0][2]
          newCube.left[1][2] = cube.bottom[0][1]
          newCube.left[2][2] = cube.bottom[0][0]
          newCube.bottom[0][0] = cube.right[2][0]
          newCube.bottom[0][1] = cube.right[1][0]
          newCube.bottom[0][2] = cube.right[0][0]
          newCube.right[0][0] = temp[0]
          newCube.right[1][0] = temp[1]
          newCube.right[2][0] = temp[2]
        }
        break
      case "F'":
        newCube.front = rotateFaceCounterClockwise(cube.front)
        {
          const temp = [cube.top[2][0], cube.top[2][1], cube.top[2][2]]
          newCube.top[2][0] = cube.right[0][0]
          newCube.top[2][1] = cube.right[1][0]
          newCube.top[2][2] = cube.right[2][0]
          newCube.right[0][0] = cube.bottom[0][2]
          newCube.right[1][0] = cube.bottom[0][1]
          newCube.right[2][0] = cube.bottom[0][0]
          newCube.bottom[0][0] = cube.left[2][2]
          newCube.bottom[0][1] = cube.left[1][2]
          newCube.bottom[0][2] = cube.left[0][2]
          newCube.left[0][2] = temp[0]
          newCube.left[1][2] = temp[1]
          newCube.left[2][2] = temp[2]
        }
        break
      case 'F2':
        newCube.front = rotateFaceClockwise(rotateFaceClockwise(cube.front))
        {
          const temp = [cube.top[2][0], cube.top[2][1], cube.top[2][2]]
          newCube.top[2][0] = cube.bottom[0][2]
          newCube.top[2][1] = cube.bottom[0][1]
          newCube.top[2][2] = cube.bottom[0][0]
          newCube.bottom[0][0] = temp[0]
          newCube.bottom[0][1] = temp[1]
          newCube.bottom[0][2] = temp[2]
          const temp2 = [cube.left[0][2], cube.left[1][2], cube.left[2][2]]
          newCube.left[0][2] = cube.right[0][0]
          newCube.left[1][2] = cube.right[1][0]
          newCube.left[2][2] = cube.right[2][0]
          newCube.right[0][0] = temp2[0]
          newCube.right[1][0] = temp2[1]
          newCube.right[2][0] = temp2[2]
        }
        break
      case 'B':
        newCube.back = rotateFaceClockwise(cube.back)
        {
          const temp = [cube.top[0][0], cube.top[0][1], cube.top[0][2]]
          newCube.top[0][0] = cube.right[0][2]
          newCube.top[0][1] = cube.right[1][2]
          newCube.top[0][2] = cube.right[2][2]
          newCube.right[0][2] = cube.bottom[2][2]
          newCube.right[1][2] = cube.bottom[2][1]
          newCube.right[2][2] = cube.bottom[2][0]
          newCube.bottom[2][0] = cube.left[2][0]
          newCube.bottom[2][1] = cube.left[1][0]
          newCube.bottom[2][2] = cube.left[0][0]
          newCube.left[0][0] = temp[0]
          newCube.left[1][0] = temp[1]
          newCube.left[2][0] = temp[2]
        }
        break
      case "B'":
        newCube.back = rotateFaceCounterClockwise(cube.back)
        {
          const temp = [cube.top[0][0], cube.top[0][1], cube.top[0][2]]
          newCube.top[0][0] = cube.left[0][0]
          newCube.top[0][1] = cube.left[1][0]
          newCube.top[0][2] = cube.left[2][0]
          newCube.left[0][0] = cube.bottom[2][0]
          newCube.left[1][0] = cube.bottom[2][1]
          newCube.left[2][0] = cube.bottom[2][2]
          newCube.bottom[2][0] = cube.right[2][2]
          newCube.bottom[2][1] = cube.right[1][2]
          newCube.bottom[2][2] = cube.right[0][2]
          newCube.right[0][2] = temp[0]
          newCube.right[1][2] = temp[1]
          newCube.right[2][2] = temp[2]
        }
        break
      case 'B2':
        newCube.back = rotateFaceClockwise(rotateFaceClockwise(cube.back))
        {
          const temp = [cube.top[0][0], cube.top[0][1], cube.top[0][2]]
          newCube.top[0][0] = cube.bottom[2][0]
          newCube.top[0][1] = cube.bottom[2][1]
          newCube.top[0][2] = cube.bottom[2][2]
          newCube.bottom[2][0] = temp[0]
          newCube.bottom[2][1] = temp[1]
          newCube.bottom[2][2] = temp[2]
          const temp2 = [cube.left[0][0], cube.left[1][0], cube.left[2][0]]
          newCube.left[0][0] = cube.right[0][2]
          newCube.left[1][0] = cube.right[1][2]
          newCube.left[2][0] = cube.right[2][2]
          newCube.right[0][2] = temp2[0]
          newCube.right[1][2] = temp2[1]
          newCube.right[2][2] = temp2[2]
        }
        break
    }
    return newCube
  }

  useFrame((state, delta) => {
    if (
      groupRef.current &&
      moveQueue.current.length > 0 &&
      isAnimating.current
    ) {
      const current = moveQueue.current[0]
      const speed = 2 // Radians per second
      let targetAngle: number
      switch (current) {
        case 'U2':
        case 'D2':
        case 'L2':
        case 'R2':
        case 'F2':
        case 'B2':
          targetAngle = Math.PI
          break
        case "U'":
        case "D'":
        case "L'":
        case "R'":
        case "F'":
        case "B'":
          targetAngle = -Math.PI / 2
          break
        default:
          targetAngle = Math.PI / 2
      }

      rotationProgress.current += delta * speed
      const progress = Math.min(
        rotationProgress.current / (Math.abs(targetAngle) / speed),
        1
      )

      let axis: [number, number, number] = [0, 0, 0]
      let faceCubies: [number, number, number][] = []

      switch (current.charAt(0)) {
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

      if (!rotatingGroupRef.current) {
        // Create a new group for the rotating face
        rotatingGroupRef.current = new ThreeGroup()
        groupRef.current.add(rotatingGroupRef.current)

        // Move relevant cubies to the rotating group
        const cubiesToRotate = groupRef.current.children.filter((child) => {
          const pos = child.position.toArray() as [number, number, number]
          return faceCubies.some(
            ([fx, fy, fz]) =>
              Math.abs(pos[0] - fx * 1.05) < 0.1 &&
              Math.abs(pos[1] - fy * 1.05) < 0.1 &&
              Math.abs(pos[2] - fz * 1.05) < 0.1
          )
        })

        cubiesToRotate.forEach((cubie) => {
          groupRef.current?.remove(cubie)
          rotatingGroupRef.current?.add(cubie)
        })
      }

      // Rotate the entire group
      const vectorAxis = new Vector3(...axis)
      const angle = targetAngle * progress
      rotatingGroupRef.current.quaternion.set(0, 0, 0, 1) // Reset quaternion
      rotatingGroupRef.current.rotateOnWorldAxis(vectorAxis, angle)

      if (progress >= 1) {
        // Move cubies back to the main group
        while (rotatingGroupRef.current.children.length > 0) {
          const cubie = rotatingGroupRef.current.children[0]
          rotatingGroupRef.current.remove(cubie)
          groupRef.current.add(cubie)
        }
        groupRef.current.remove(rotatingGroupRef.current)
        rotatingGroupRef.current = null

        isAnimating.current = false
        rotationProgress.current = 0
        const newCubeState = updateCubeState(cube, current)
        moveQueue.current.shift()
        if (onMoveComplete) onMoveComplete(newCubeState)
      }
    }
  })

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

  const isHighlighted = (x: number, y: number, z: number) => {
    if (!currentMove || !isAnimating.current) return false
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
    if (currentMove && !isAnimating.current) {
      isAnimating.current = true
      moveQueue.current = [currentMove]
    } else if (currentMove) {
      moveQueue.current.push(currentMove)
    }
  }, [currentMove])

  return <group ref={groupRef}>{createCubelets()}</group>
}

export default Cube3D
