/* eslint-disable @typescript-eslint/no-explicit-any */
// CubeVisualization.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shuffle, RefreshCw, Lightbulb } from 'lucide-react'
import { createSolvedCube } from '@/constants/solveConstant'
import { scrambleCube } from '@/lib/scrambleCube'
import Show3D from './Show3D'
import Show2D from './Show2D'
import { CubeState } from '@/interfaces/cubeState'
import { solveCube } from '@/lib/solverEngine'
import { estimatePhaseSplit } from '@/lib/estimatePhase'
import ManualControls from './ManualControls'
import { applyMove } from '@/lib/cubeMoves'

interface ChildProps {
  solutionSteps: string[]
  setSolutionSteps: React.Dispatch<React.SetStateAction<string[]>>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  setMoveHistory: React.Dispatch<React.SetStateAction<string[]>>
  pendingMove?: string | null
  onMoveApplied?: (move: string) => void
}

const CubeVisualization: React.FC<ChildProps> = ({
  solutionSteps,
  setSolutionSteps,
  currentStep,
  setCurrentStep,
  setMoveHistory,
  pendingMove,
  onMoveApplied
}: ChildProps) => {
  const [show3D, setShow3D] = useState(true)
  const [isSolving, setIsSolving] = useState(false)
  const [cube, setCube] = useState<CubeState>(createSolvedCube())
  const [currentMove, setCurrentMove] = useState<string | undefined>(undefined) // Track current move for animation

  const handleScramble = () => {
    setCube(scrambleCube())
    setSolutionSteps([])
    setCurrentStep(0)
    setMoveHistory([])
    setCurrentMove(undefined)
  }

  const handleReset = () => {
    setCube(createSolvedCube())
    setSolutionSteps([])
    setCurrentStep(0)
    setMoveHistory([])
    setCurrentMove(undefined)
  }

  function isCubeSolved(cube: CubeState): boolean {
    const solved = createSolvedCube()
    for (const face of [
      'front',
      'back',
      'left',
      'right',
      'top',
      'bottom'
    ] as const) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (cube[face][i][j] !== solved[face][i][j]) {
            return false
          }
        }
      }
    }
    return true
  }

  const handleSolve = (cube: CubeState) => {
    if (isCubeSolved(cube)) {
      alert('Cube is already solved!')
      return
    }
    setIsSolving(true)
    try {
      const solution = solveCube(cube)
      const { phase1, phase2 } = estimatePhaseSplit(solution)
      const mergedPhases: string[] = [phase1.join(' '), phase2.join(' ')]
      setSolutionSteps(mergedPhases)
      setCurrentStep(0)
      setMoveHistory([])
    } catch (err) {
      console.error(err)
      alert('Failed to solve cube.')
    } finally {
      setIsSolving(false)
    }
  }

  // Implement executeMove to update cube state and trigger animation
  const handleExecuteMove = (move: string) => {
    if (!isSolving) {
      setCurrentMove(move) // Set the move for animation
      setCube((prevCube) => {
        const newCube = JSON.parse(JSON.stringify(prevCube)) // Deep copy
        applyMove(newCube, move) // Apply the move to update cube state
        return newCube
      })
      // Move history and callback will be handled after animation
    }
  }

  // Callback when move animation is complete
  const handleMoveComplete = () => {
    if (currentMove && onMoveApplied) {
      onMoveApplied(currentMove)
    }
    setCurrentMove(undefined) // Clear current move after animation
  }

  // React to pendingMove prop from parent (SolutionPanels or ManualControls)
  React.useEffect(() => {
    if (pendingMove) {
      handleExecuteMove(pendingMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMove])

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
                className='cursor-pointer'
                variant={show3D ? 'default' : 'outline'}
                size='sm'
                onClick={() => setShow3D(true)}
              >
                3D View
              </Button>
              <Button
                className='cursor-pointer'
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
              currentMove={currentMove as any} // Pass current move
              onMoveComplete={handleMoveComplete} // Pass callback
            />
          ) : (
            <Show2D cube={cube} />
          )}
          <div className='flex justify-center gap-2 mt-6'>
            <Button
              onClick={handleScramble}
              variant='outline'
              className='gap-2 bg-transparent cursor-pointer'
            >
              <Shuffle className='w-4 h-4' />
              Scramble
            </Button>
            <Button
              onClick={handleReset}
              variant='outline'
              className='gap-2 bg-transparent cursor-pointer'
            >
              <RefreshCw className='w-4 h-4' />
              Reset
            </Button>
            <Button
              className='gap-2 cursor-pointer'
              onClick={() => handleSolve(cube)}
              disabled={isSolving || isCubeSolved(cube)}
            >
              <Lightbulb className='w-4 h-4' />
              {isSolving ? 'Solving...' : 'Solve'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ManualControls executeMove={handleExecuteMove} />
    </div>
  )
}

export default CubeVisualization
