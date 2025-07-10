'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Group } from 'three'

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
  yellow: '#ffff00',
  red: '#ff0000',
  orange: '#ff8800',
  blue: '#0000ff',
  green: '#00ff00'
}

interface CubieProps {
  position: [number, number, number]
  colors: {
    front?: CubeColor
    back?: CubeColor
    left?: CubeColor
    right?: CubeColor
    top?: CubeColor
    bottom?: CubeColor
  }
}

function Cubie({ position, colors }: CubieProps) {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial color='#1a1a1a' />

      {/* Front face */}
      {colors.front && (
        <mesh position={[0, 0, 0.48]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.front]} />
        </mesh>
      )}

      {/* Back face */}
      {colors.back && (
        <mesh position={[0, 0, -0.48]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.back]} />
        </mesh>
      )}

      {/* Right face */}
      {colors.right && (
        <mesh position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.right]} />
        </mesh>
      )}

      {/* Left face */}
      {colors.left && (
        <mesh position={[-0.48, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.left]} />
        </mesh>
      )}

      {/* Top face */}
      {colors.top && (
        <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.top]} />
        </mesh>
      )}

      {/* Bottom face */}
      {colors.bottom && (
        <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={colorToHex[colors.bottom]} />
        </mesh>
      )}
    </mesh>
  )
}

export function RubiksCube3D({ cube }: { cube: CubeState }) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const getCubieColors = (x: number, y: number, z: number) => {
    const colors: CubieProps['colors'] = {}

    // Map 3D positions to 2D face positions
    if (z === 1) colors.front = cube.front[1 - y][x + 1]
    if (z === -1) colors.back = cube.back[1 - y][1 - x]
    if (x === 1) colors.right = cube.right[1 - y][1 - z]
    if (x === -1) colors.left = cube.left[1 - y][z + 1]
    if (y === 1) colors.top = cube.top[1 - z][x + 1]
    if (y === -1) colors.bottom = cube.bottom[z + 1][x + 1]

    return colors
  }

  return (
    <group ref={groupRef}>
      {/* Generate all 27 cubies (3x3x3) */}
      {[-1, 0, 1].map((x) =>
        [-1, 0, 1].map((y) =>
          [-1, 0, 1].map((z) => {
            // Only render visible cubies (edge and corner pieces)
            const isVisible = x !== 0 || y !== 0 || z !== 0
            if (!isVisible) return null

            const colors = getCubieColors(x, y, z)

            return (
              <Cubie
                key={`${x}-${y}-${z}`}
                position={[x, y, z]}
                colors={colors}
              />
            )
          })
        )
      )}

      {/* Add some ambient elements */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color='#f0f0f0' transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
