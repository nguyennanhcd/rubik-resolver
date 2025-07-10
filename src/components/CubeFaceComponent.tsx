import { colorMap } from '@/constants/colorMap'
import { CubeFace } from '@/types/cubeType'
import React from 'react'

const CubeFaceComponent = ({
  face,
  title
}: {
  face: CubeFace
  title: string
}) => {
  return (
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
}

export default CubeFaceComponent
