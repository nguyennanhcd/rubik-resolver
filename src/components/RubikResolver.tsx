/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import CubeVisualization from './CubeVisualization'
import SolutionPanels from './SolutionPanels'

export default function RubikResolver() {
  const [currentStep, setCurrentStep] = useState(0)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])

  const executeMove = (move: string) => {
    setMoveHistory((prev) => [...prev, move])
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
            executeMove={executeMove}
          />

          {/* Solution Panel */}
          <SolutionPanels
            executeMove={executeMove}
            solutionSteps={solutionSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            moveHistory={moveHistory}
          />
        </div>
      </div>
    </div>
  )
}
