import { CubeState } from '@/interfaces/cubeInterfaces'
import { CubeColor } from '@/types/cubeType'

export const scrambleCube = (): CubeState => {
  const colors: CubeColor[] = [
    'white',
    'yellow',
    'red',
    'orange',
    'blue',
    'green'
  ]

  // Initialize a new CubeState with empty 3x3 faces
  const newCube: CubeState = {
    front: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white')),
    back: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white')),
    left: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white')),
    right: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white')),
    top: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white')),
    bottom: Array(3)
      .fill(null)
      .map(() => Array(3).fill('white'))
  }

  // Assign random colors to each face
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
