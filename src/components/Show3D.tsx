// Show3D.tsx
import React from 'react'
import { Cube3D, Move } from './Cube3D'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CubeState } from '@/interfaces/cubeState'

interface ChildProps {
  solutionSteps: string[]
  currentStep: number
  cube: CubeState
  currentMove?: Move
  onMoveComplete?: () => void
}

const Show3D: React.FC<ChildProps> = ({
  cube,
  currentMove,
  onMoveComplete
}) => {
  return (
    <div className='h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden'>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <Cube3D
          cube={cube}
          currentMove={currentMove}
          onMoveComplete={onMoveComplete}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={3}
        />
      </Canvas>
    </div>
  )
}

export default Show3D
