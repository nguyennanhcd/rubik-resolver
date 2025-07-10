import React from 'react'
import { EnhancedCube3D } from './Cube3D'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CubeState } from '@/interfaces/cubeInterfaces'

interface ChildProps {
  solutionSteps: string[]
  currentStep: number
  cube: CubeState
}
const Show3D: React.FC<ChildProps> = ({ solutionSteps, currentStep, cube }) => {
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
        <EnhancedCube3D cube={cube} currentMove={solutionSteps[currentStep]} />
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
