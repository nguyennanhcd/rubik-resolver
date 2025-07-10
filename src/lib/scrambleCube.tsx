import { CubeState } from '@/interfaces/cubeInterfaces'
import { CubeColor } from '@/types/cubeType'

export const scrambleCube = (cube: CubeState): CubeState => {
  const colors: CubeColor[] = [
    'white',
    'yellow',
    'red',
    'orange',
    'blue',
    'green'
  ]
  const newCube = { ...cube }

  Object.keys(newCube).forEach((face) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newCube[face as keyof CubeState][i][j] =
          colors[Math.floor(Math.random() * colors.length)]
      }
    }
  })

  return newCube
}
