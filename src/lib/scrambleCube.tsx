/* eslint-disable @typescript-eslint/no-require-imports */
// scrambleCube.ts
import { CubeState } from '@/interfaces/cubeState'
import { convertCubeStringToCubeState } from './converCubeStringToCubeState'
const Cube = require('cubejs')

export function scrambleCube(): CubeState {
  const randomCube = Cube.random()
  const cubeString = randomCube.asString()
  const cubeState = convertCubeStringToCubeState(cubeString)
  console.log('🎲 Scrambled CubeState:', cubeState)
  return cubeState
}
