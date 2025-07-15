/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import CubeVisualization from './CubeVisualization'
import SolutionPanels from './SolutionPanels'

export default function RubikResolver() {
  const [currentStep, setCurrentStep] = useState(0)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])
  const [pendingMove, setPendingMove] = useState<string | null>(null)

  // This handler will be passed to both SolutionPanels and ManualControls
  const handleExecuteMove = (move: string) => {
    setPendingMove(move)
  }

  // This callback is called by CubeVisualization after the move is animated/applied
  const handleMoveApplied = (move: string) => {
    setMoveHistory((prev) => [...prev, move])
    setPendingMove(null)
  }

  return (
    <div className=' bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
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
          <CubeVisualization
            solutionSteps={solutionSteps}
            setSolutionSteps={setSolutionSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setMoveHistory={setMoveHistory}
            pendingMove={pendingMove}
            onMoveApplied={handleMoveApplied}
          />

          {/* Solution Panel */}
          <SolutionPanels
            executeMove={handleExecuteMove}
            solutionSteps={solutionSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            moveHistory={moveHistory}
            onMoveComplete={() => {
              setCurrentStep((prev) =>
                prev < solutionSteps.length - 1 ? prev + 1 : prev
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
