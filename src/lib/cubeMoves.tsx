// src/lib/cubeMoves.ts
import { CubeState } from '@/interfaces/cubeState'
import { convertCubeStringToCubeState } from './convertCubeStringToCubeState'
import { convertCubeStateToCubeString } from './solverEngine'
// @ts-expect-error: cubejs has no type definitions
import CubeJS from 'cubejs'

export function applyMove(cube: CubeState, move: string): void {
  const cubeString = convertCubeStateToCubeString(cube)
  const cubejsInstance = CubeJS.fromString(cubeString)
  cubejsInstance.move(move)
  const newCubeState = convertCubeStringToCubeState(cubejsInstance.asString())
  Object.assign(cube, newCubeState)
}
