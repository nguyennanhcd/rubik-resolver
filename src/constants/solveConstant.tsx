import { CubeState } from '@/interfaces/cubeState'

export const createSolvedCube = (): CubeState => ({
  front: [
    ['green', 'green', 'green'],
    ['green', 'green', 'green'],
    ['green', 'green', 'green']
  ],
  back: [
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue'],
    ['blue', 'blue', 'blue']
  ],
  left: [
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange'],
    ['orange', 'orange', 'orange']
  ],
  right: [
    ['red', 'red', 'red'],
    ['red', 'red', 'red'],
    ['red', 'red', 'red']
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
