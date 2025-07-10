/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  RotateCw,
  RotateCcw,
  Shuffle,
  Play,
  SkipForward,
  SkipBack,
  RefreshCw,
  Lightbulb
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EnhancedCube3D } from './Cube3D'

// Rubik's cube state representation
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

const colorMap: Record<CubeColor, string> = {
  white: 'bg-white border-gray-300',
  yellow: 'bg-yellow-400 border-yellow-500',
  red: 'bg-red-500 border-red-600',
  orange: 'bg-orange-500 border-orange-600',
  blue: 'bg-blue-500 border-blue-600',
  green: 'bg-green-500 border-green-600'
}

const createSolvedCube = (): CubeState => ({
  front: [
    ['red', 'red', 'red'],
    ['red', 'red', 'red'],
    ['red', 'red', 'red']
  ],
  back: [
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange']
  ],
  left: [
    ['green', 'green', 'green'],
    ['green', 'green', 'green'],
    ['green', 'green', 'green']
  ],
  right: [
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue']
  ],
  top: [
    ['white', 'white', 'white'],
    ['white', 'white', 'white'],
    ['white', 'white', 'white']
  ],
  bottom: [
    ['yellow', 'yellow', 'yellow'],
    ['yellow', 'yellow', 'yellow']
  ]
})

const scrambleCube = (cube: CubeState): CubeState => {
  const colors: CubeColor[] = [
    'white',
    'yellow',
    'red',
    'orange',
    'blue',
    'green'
  ]
  const newCube = { ...cube }

  Object.keys(newCube).forEach((face) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newCube[face as keyof CubeState][i][j] =
          colors[Math.floor(Math.random() * colors.length)]
      }
    }
  })

  return newCube
}

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

export default function RubikResolver() {
  const [cube, setCube] = useState<CubeState>(createSolvedCube())
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSolving, setIsSolving] = useState(false)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [show3D, setShow3D] = useState(true)

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

  const executeMove = (move: string) => {
    setMoveHistory((prev) => [...prev, move])
    // In a real implementation, this would actually rotate the cube
    console.log(`Executing move: ${move}`)
  }

  const faceRotations = [
    { label: 'R', move: 'R', icon: RotateCw },
    { label: "R'", move: "R'", icon: RotateCcw },
    { label: 'L', move: 'L', icon: RotateCw },
    { label: "L'", move: "L'", icon: RotateCcw },
    { label: 'U', move: 'U', icon: RotateCw },
    { label: "U'", move: "U'", icon: RotateCcw },
    { label: 'D', move: 'D', icon: RotateCw },
    { label: "D'", move: "D'", icon: RotateCcw },
    { label: 'F', move: 'F', icon: RotateCw },
    { label: "F'", move: "F'", icon: RotateCcw },
    { label: 'B', move: 'B', icon: RotateCw },
    { label: "B'", move: "B'", icon: RotateCcw }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Rubik's Cube Solver
          </h1>
          <p className='text-gray-600'>
            Solve your cube step by step with our advanced algorithm
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Cube Visualization */}
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

          {/* Solution Panel */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Solution Steps</CardTitle>
              </CardHeader>
              <CardContent>
                {solutionSteps.length > 0 ? (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Badge variant='secondary'>
                        Step {currentStep + 1} of {solutionSteps.length}
                      </Badge>
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            setCurrentStep(Math.max(0, currentStep - 1))
                          }
                          disabled={currentStep === 0}
                        >
                          <SkipBack className='w-4 h-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            setCurrentStep(
                              Math.min(
                                solutionSteps.length - 1,
                                currentStep + 1
                              )
                            )
                          }
                          disabled={currentStep === solutionSteps.length - 1}
                        >
                          <SkipForward className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      {solutionSteps.map((step, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            index === currentStep
                              ? 'bg-blue-50 border-blue-200'
                              : index < currentStep
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <span className='font-mono text-sm'>{step}</span>
                            {index === currentStep && (
                              <Button
                                size='sm'
                                onClick={() => executeMove(step)}
                                className='gap-1'
                              >
                                <Play className='w-3 h-3' />
                                Execute
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <Lightbulb className='w-12 h-12 mx-auto mb-3 opacity-50' />
                    <p>Click "Solve" to generate solution steps</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Move History */}
            <Card>
              <CardHeader>
                <CardTitle>Move History</CardTitle>
              </CardHeader>
              <CardContent>
                {moveHistory.length > 0 ? (
                  <div className='space-y-2 max-h-40 overflow-y-auto'>
                    {moveHistory.map((move, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between text-sm'
                      >
                        <span className='font-mono'>{move}</span>
                        <Badge variant='outline' className='text-xs'>
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4 text-muted-foreground text-sm'>
                    No moves yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cube Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Total Moves:</span>
                  <Badge variant='secondary'>{moveHistory.length}</Badge>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Solution Steps:</span>
                  <Badge variant='secondary'>{solutionSteps.length}</Badge>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Current Step:</span>
                  <Badge variant='secondary'>{currentStep + 1}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
