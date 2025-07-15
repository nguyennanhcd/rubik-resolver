/* eslint-disable @typescript-eslint/no-require-imports */
// scrambleCube.ts
import { CubeState } from '@/interfaces/cubeState'
import { convertCubeStringToCubeState } from './convertCubeStringToCubeState'
const Cube = require('cubejs')

export function scrambleCube(): CubeState {
  const randomCube = new Cube()
  randomCube.randomize()
  const cubeString = randomCube.asString()
  const cubeState = convertCubeStringToCubeState(cubeString)
  console.log('🎲 Scrambled CubeState:', cubeState)
  return cubeState
}
