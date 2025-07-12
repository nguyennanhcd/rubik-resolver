// convertCubeStringToCubeState.ts
import { CubeState } from '@/interfaces/cubeState'
import { CubeColor, CubeFace } from '@/types/cubeType'

const faceToColor: Record<string, CubeColor> = {
  U: 'white',
  D: 'yellow',
  F: 'red',
  B: 'orange',
  L: 'blue',
  R: 'green'
}

const faceNames: (keyof CubeState)[] = [
  'top',
  'bottom',
  'front',
  'back',
  'left',
  'right'
]

export function convertCubeStringToCubeState(cubeString: string): CubeState {
  if (cubeString.length !== 54) {
    throw new Error('Invalid cube string length')
  }

  const cubeState: Partial<CubeState> = {}

  for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
    const faceName = faceNames[faceIndex]
    const faceString = cubeString.slice(faceIndex * 9, (faceIndex + 1) * 9)

    const faceMatrix: CubeFace = []
    for (let row = 0; row < 3; row++) {
      const rowColors: CubeColor[] = []
      for (let col = 0; col < 3; col++) {
        const ch = faceString[row * 3 + col]
        const color = faceToColor[ch]
        if (!color) throw new Error(`Unknown face character: ${ch}`)
        rowColors.push(color)
      }
      faceMatrix.push(rowColors)
    }

    cubeState[faceName] = faceMatrix
  }

  return cubeState as CubeState
}
