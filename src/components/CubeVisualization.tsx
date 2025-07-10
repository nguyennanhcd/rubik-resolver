/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shuffle, RefreshCw, Lightbulb } from 'lucide-react'
import { createSolvedCube } from '@/constants/solveConstant'
import { CubeState } from '@/interfaces/cubeInterfaces'
import { scrambleCube } from '@/lib/scrambleCube'
import { faceRotations } from '@/constants/cubeConstant'
import Show3D from './Show3D'
import Show2D from './Show2D'

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
      {/* Cube Visualization Card */}
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
            <Show3D
              solutionSteps={solutionSteps}
              currentStep={currentStep}
              cube={cube}
            />
          ) : (
            <Show2D cube={cube} />
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
