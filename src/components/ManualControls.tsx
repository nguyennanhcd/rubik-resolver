'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw
} from 'lucide-react'

type Move =
  | 'U'
  | "U'"
  | 'U2'
  | 'D'
  | "D'"
  | 'D2'
  | 'L'
  | "L'"
  | 'L2'
  | 'R'
  | "R'"
  | 'R2'
  | 'F'
  | "F'"
  | 'F2'
  | 'B'
  | "B'"
  | 'B2'

interface FaceRotation {
  label: string
  move: Move
  icon: React.ComponentType<{ className?: string }>
}

const faceRotations: FaceRotation[] = [
  { label: 'U', move: 'U', icon: ArrowUp },
  { label: "U'", move: "U'", icon: RotateCcw },
  { label: 'U2', move: 'U2', icon: RotateCw },
  { label: 'D', move: 'D', icon: ArrowDown },
  { label: "D'", move: "D'", icon: RotateCcw },
  { label: 'D2', move: 'D2', icon: RotateCw },
  { label: 'L', move: 'L', icon: ArrowLeft },
  { label: "L'", move: "L'", icon: RotateCcw },
  { label: 'L2', move: 'L2', icon: RotateCw },
  { label: 'R', move: 'R', icon: ArrowRight },
  { label: "R'", move: "R'", icon: RotateCcw },
  { label: 'R2', move: 'R2', icon: RotateCw },
  { label: 'F', move: 'F', icon: ArrowUp },
  { label: "F'", move: "F'", icon: RotateCcw },
  { label: 'F2', move: 'F2', icon: RotateCw },
  { label: 'B', move: 'B', icon: ArrowDown },
  { label: "B'", move: "B'", icon: RotateCcw },
  { label: 'B2', move: 'B2', icon: RotateCw }
]

type ChildProps = {
  executeMove: (move: Move) => void
}

const ManualControls = ({ executeMove }: ChildProps) => {
  return (
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
          R=Right, L=Left, U=Up, D=Down, F=Front, B=Back. &apos; =
          Counter-clockwise, 2 = 180 degrees
        </div>
      </CardContent>
    </Card>
  )
}

export default ManualControls
