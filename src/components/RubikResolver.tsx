/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, SkipForward, SkipBack, Lightbulb } from 'lucide-react'
import CubeVisualization from './CubeVisualization'

export default function RubikResolver() {
  const [currentStep, setCurrentStep] = useState(0)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])

  const executeMove = (move: string) => {
    setMoveHistory((prev) => [...prev, move])
  }

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
          <CubeVisualization
            solutionSteps={solutionSteps}
            setSolutionSteps={setSolutionSteps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setMoveHistory={setMoveHistory}
            executeMove={executeMove}
          />

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
