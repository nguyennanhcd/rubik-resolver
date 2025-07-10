/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Shuffle, RefreshCw, Lightbulb } from 'lucide-react'
import { CubeFace } from '@/types/cubeType'
import { colorMap } from '@/constants/colorMap'
import { EnhancedCube3D } from './Cube3D'
import { createSolvedCube } from '@/constants/solveConstant'
import { CubeState } from '@/interfaces/cubeInterfaces'
import { scrambleCube } from '@/lib/scrambleCube'
import { faceRotations } from '@/constants/cubeConstant'

const CubeFaceComponent = ({
  face,
  title
}: {
  face: CubeFace
  title: string
}) => (
  <div className='flex flex-col items-center gap-1'>
    <div className='text-xs font-medium text-muted-foreground'>{title}</div>
    <div className='grid grid-cols-3 gap-0.5 p-2 bg-gray-100 rounded'>
      {face.map((row, i) =>
        row.map((color, j) => (
          <div
            key={`${i}-${j}`}
            className={`w-6 h-6 border-2 rounded-sm ${colorMap[color]}`}
          />
        ))
      )}
    </div>
  </div>
)
interface ChildProps {
  solutionSteps: string[]
  setSolutionSteps: React.Dispatch<React.SetStateAction<string[]>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  setMoveHistory: React.Dispatch<React.SetStateAction<string[]>>
  executeMove: (move: string) => void
}

const CubeVisualization: React.FC<ChildProps> = ({
  solutionSteps,
  setSolutionSteps,
  currentStep,
  setCurrentStep,
  setMoveHistory,
  executeMove
}: ChildProps) => {
  const [show3D, setShow3D] = useState(true)
  const [isSolving, setIsSolving] = useState(false)
  const [cube, setCube] = useState<CubeState>(createSolvedCube())

  const handleScramble = () => {
    setCube(scrambleCube(cube))
    setSolutionSteps([])
    setCurrentStep(0)
    setMoveHistory([])
  }

  const handleReset = () => {
    setCube(createSolvedCube())
    setSolutionSteps([])
    setCurrentStep(0)
    setMoveHistory([])
  }

  const handleSolve = () => {
    setIsSolving(true)
    // Simulate solving algorithm
    const mockSolution = [
      "R U R' U'",
      "F R U' R' U' R U R' F'",
      "R U R' F' R U R' U' R' F R2 U' R'",
      "R U R' U R U2 R'",
      "R U2 R' U' R U' R'",
      "F R U R' U' F'",
      "R U R' U' R' F R F'",
      "R U R' U R U2 R'"
    ]
    setSolutionSteps(mockSolution)
    setCurrentStep(0)
    setTimeout(() => setIsSolving(false), 1000)
  }
  return (
    <div className='lg:col-span-2'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-gradient-to-r from-red-500 to-blue-500 rounded'></div>
              Cube State
            </div>
            <div className='flex gap-2'>
              <Button
                variant={show3D ? 'default' : 'outline'}
                size='sm'
                onClick={() => setShow3D(true)}
              >
                3D View
              </Button>
              <Button
                variant={!show3D ? 'default' : 'outline'}
                size='sm'
                onClick={() => setShow3D(false)}
              >
                2D View
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {show3D ? (
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
                <EnhancedCube3D
                  cube={cube}
                  currentMove={solutionSteps[currentStep]}
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
          ) : (
            <div className='grid grid-cols-4 gap-4 max-w-md mx-auto'>
              <div></div>
              <CubeFaceComponent face={cube.top} title='Top' />
              <div></div>
              <div></div>

              <CubeFaceComponent face={cube.left} title='Left' />
              <CubeFaceComponent face={cube.front} title='Front' />
              <CubeFaceComponent face={cube.right} title='Right' />
              <CubeFaceComponent face={cube.back} title='Back' />

              <div></div>
              <CubeFaceComponent face={cube.bottom} title='Bottom' />
              <div></div>
              <div></div>
            </div>
          )}

          <div className='flex justify-center gap-2 mt-6'>
            <Button
              onClick={handleScramble}
              variant='outline'
              className='gap-2 bg-transparent'
            >
              <Shuffle className='w-4 h-4' />
              Scramble
            </Button>
            <Button
              onClick={handleReset}
              variant='outline'
              className='gap-2 bg-transparent'
            >
              <RefreshCw className='w-4 h-4' />
              Reset
            </Button>
            <Button
              onClick={handleSolve}
              disabled={isSolving}
              className='gap-2'
            >
              <Lightbulb className='w-4 h-4' />
              {isSolving ? 'Solving...' : 'Solve'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-6 gap-2'>
            {faceRotations.map(({ label, move, icon: Icon }) => (
              <Button
                key={move}
                variant='outline'
                size='sm'
                onClick={() => executeMove(move)}
                className='flex flex-col gap-1 h-auto py-2'
              >
                <Icon className='w-4 h-4' />
                <span className='text-xs'>{label}</span>
              </Button>
            ))}
          </div>
          <div className='text-xs text-muted-foreground mt-2'>
            R=Right, L=Left, U=Up, D=Down, F=Front, B=Back. ' =
            Counter-clockwise
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CubeVisualization
