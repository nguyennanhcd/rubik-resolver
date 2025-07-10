/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, SkipForward, SkipBack, Lightbulb } from 'lucide-react'

interface ChildProps {
  solutionSteps: string[]
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  executeMove: (move: string) => void
  moveHistory: string[]
}

const SolutionPanels: React.FC<ChildProps> = ({
  solutionSteps,
  currentStep,
  setCurrentStep,
  executeMove,
  moveHistory
}) => {
  return (
    <div className='space-y-6'>
      {/* Solution Steps */}
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
                    className='cursor-pointer'
                    size='sm'
                    variant='outline'
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <SkipBack className='w-4 h-4' />
                  </Button>
                  <Button
                    className='cursor-pointer'
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      setCurrentStep(
                        Math.min(solutionSteps.length - 1, currentStep + 1)
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
                          className='cursor-pointer gap-1'
                          size='sm'
                          onClick={() => executeMove(step)}
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
  )
}

export default SolutionPanels
