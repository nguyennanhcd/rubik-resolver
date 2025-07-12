import { CubeState } from '@/interfaces/cubeState'

export const createSolvedCube = (): CubeState => ({
  front: [
    ['red', 'red', 'red'],
    ['red', 'red', 'red'],
    ['red', 'red', 'red']
  ],
  back: [
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange']
  ],
  left: [
    ['green', 'green', 'green'],
    ['green', 'green', 'green'],
    ['green', 'green', 'green']
  ],
  right: [
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue']
  ],
  top: [
    ['white', 'white', 'white'],
    ['white', 'white', 'white'],
    ['white', 'white', 'white']
  ],
  bottom: [
    ['yellow', 'yellow', 'yellow'],
    ['yellow', 'yellow', 'yellow'],
    ['yellow', 'yellow', 'yellow']
  ]
})
