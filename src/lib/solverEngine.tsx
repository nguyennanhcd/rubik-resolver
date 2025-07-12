/* eslint-disable @typescript-eslint/no-require-imports */
import { CubeState } from '@/interfaces/cubeState'
const Cube = require('cubejs')
Cube.initSolver()

const colorToFace: Record<string, string> = {
  white: 'U',
  yellow: 'D',
  red: 'F',
  orange: 'B',
  blue: 'L',
  green: 'R'
}

const faceOrder: (keyof CubeState)[] = [
  'top',
  'bottom',
  'front',
  'back',
  'left',
  'right'
]

export function convertCubeStateToCubeString(cube: CubeState): string {
  let cubeString = ''

  for (const face of faceOrder) {
    const faceMatrix = cube[face]
    if (
      !faceMatrix ||
      faceMatrix.length !== 3 ||
      faceMatrix.some((row) => row.length !== 3)
    ) {
      throw new Error(`Invalid face matrix for ${face}`)
    }
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const color = faceMatrix[row][col]
        if (!(color in colorToFace)) {
          throw new Error(`Invalid color ${color} at ${face}[${row}][${col}]`)
        }
        cubeString += colorToFace[color]
      }
    }
  }

  if (cubeString.length !== 54) {
    throw new Error('Cube string must be exactly 54 characters')
  }

  return cubeString
}

export function solveCube(cubeState: CubeState): string[] {
  try {
    const cubeString = convertCubeStateToCubeString(cubeState)
    const cube = Cube.fromString(cubeString)

    const solution = cube.solve()
    console.log(solution)
    if (!solution) {
      throw new Error('No solution found')
    }
    return solution.trim().split(' ')
  } catch (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : String(error)
    throw new Error(`Failed to solve cube: ${errorMessage}`)
  }
}
