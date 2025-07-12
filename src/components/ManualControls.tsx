/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { faceRotations } from '@/constants/cubeConstant'

type ChildProps = {
  executeMove: (move: string) => void
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
          R=Right, L=Left, U=Up, D=Down, F=Front, B=Back. ' = Counter-clockwise
        </div>
      </CardContent>
    </Card>
  )
}

export default ManualControls
