import React from 'react'
import CubeFaceComponent from './CubeFaceComponent'
import { CubeState } from '@/interfaces/cubeInterfaces'

interface ChildProps {
  cube: CubeState
}

const Show2D: React.FC<ChildProps> = ({ cube }) => {
  return (
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
  )
}

export default Show2D
