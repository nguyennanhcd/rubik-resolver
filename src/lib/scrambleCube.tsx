import { CubeFace, CubeColor } from '@/types/cubeType'
import { createSolvedCube } from '@/constants/solveConstant'
import { CubeState } from '@/interfaces/cubeState'

export function scrambleCube(): CubeState {
  let cube = createSolvedCube()
  const moves = [
    'R',
    'Ri',
    'L',
    'Li',
    'U',
    'Ui',
    'D',
    'Di',
    'F',
    'Fi',
    'B',
    'Bi'
  ]
  const numMoves = 20 // Typical scramble length

  // Apply random moves
  for (let i = 0; i < numMoves; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)]
    cube = applyMove(cube, move)
  }

  // Log cube state for debugging
  console.log('Scrambled CubeState:', JSON.stringify(cube, null, 2))
  return cube
}

// Apply a single move to the CubeState
function applyMove(cube: CubeState, move: string): CubeState {
  const newCube = JSON.parse(JSON.stringify(cube)) as CubeState
  const isCounterClockwise = move.endsWith('i')
  const baseMove = move.replace('i', '')

  // Define face rotation (90° clockwise or counterclockwise)
  const rotateFace = (face: CubeFace, ccw: boolean): CubeFace => {
    const newFace = Array(3)
      .fill(0)
      .map(() => Array(3).fill('' as CubeColor))
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const ni = ccw ? j : 2 - j
        const nj = ccw ? 2 - i : i
        newFace[ni][nj] = face[i][j]
      }
    }
    return newFace
  }

  if (baseMove === 'R') {
    newCube.right = rotateFace(newCube.right, isCounterClockwise)
    const temp = [newCube.front[0][2], newCube.front[1][2], newCube.front[2][2]]
    if (!isCounterClockwise) {
      // R: front[*,2] -> top[*,2], top[*,2] -> back[2-*,0], back[2-*,0] -> bottom[*,2], bottom[*,2] -> front[*,2]
      newCube.front[0][2] = newCube.bottom[0][2]
      newCube.front[1][2] = newCube.bottom[1][2]
      newCube.front[2][2] = newCube.bottom[2][2]
      newCube.bottom[0][2] = newCube.back[2][0]
      newCube.bottom[1][2] = newCube.back[1][0]
      newCube.bottom[2][2] = newCube.back[0][0]
      newCube.back[2][0] = newCube.top[0][2]
      newCube.back[1][0] = newCube.top[1][2]
      newCube.back[0][0] = newCube.top[2][2]
      newCube.top[0][2] = temp[0]
      newCube.top[1][2] = temp[1]
      newCube.top[2][2] = temp[2]
    } else {
      // Ri: reverse cycle
      newCube.front[0][2] = newCube.top[0][2]
      newCube.front[1][2] = newCube.top[1][2]
      newCube.front[2][2] = newCube.top[2][2]
      newCube.top[0][2] = newCube.back[2][0]
      newCube.top[1][2] = newCube.back[1][0]
      newCube.top[2][2] = newCube.back[0][0]
      newCube.back[2][0] = newCube.bottom[0][2]
      newCube.back[1][0] = newCube.bottom[1][2]
      newCube.back[0][0] = newCube.bottom[2][2]
      newCube.bottom[0][2] = temp[0]
      newCube.bottom[1][2] = temp[1]
      newCube.bottom[2][2] = temp[2]
    }
  } else if (baseMove === 'L') {
    newCube.left = rotateFace(newCube.left, isCounterClockwise)
    const temp = [newCube.front[0][0], newCube.front[1][0], newCube.front[2][0]]
    if (!isCounterClockwise) {
      // L: front[*,0] -> bottom[*,0], bottom[*,0] -> back[2-*,2], back[2-*,2] -> top[*,0], top[*,0] -> front[*,0]
      newCube.front[0][0] = newCube.top[0][0]
      newCube.front[1][0] = newCube.top[1][0]
      newCube.front[2][0] = newCube.top[2][0]
      newCube.top[0][0] = newCube.back[2][2]
      newCube.top[1][0] = newCube.back[1][2]
      newCube.top[2][0] = newCube.back[0][2]
      newCube.back[2][2] = newCube.bottom[0][0]
      newCube.back[1][2] = newCube.bottom[1][0]
      newCube.back[0][2] = newCube.bottom[2][0]
      newCube.bottom[0][0] = temp[0]
      newCube.bottom[1][0] = temp[1]
      newCube.bottom[2][0] = temp[2]
    } else {
      // Li: reverse cycle
      newCube.front[0][0] = newCube.bottom[0][0]
      newCube.front[1][0] = newCube.bottom[1][0]
      newCube.front[2][0] = newCube.bottom[2][0]
      newCube.bottom[0][0] = newCube.back[2][2]
      newCube.bottom[1][0] = newCube.back[1][2]
      newCube.bottom[2][0] = newCube.back[0][2]
      newCube.back[2][2] = newCube.top[0][0]
      newCube.back[1][2] = newCube.top[1][0]
      newCube.back[0][2] = newCube.top[2][0]
      newCube.top[0][0] = temp[0]
      newCube.top[1][0] = temp[1]
      newCube.top[2][0] = temp[2]
    }
  } else if (baseMove === 'U') {
    newCube.top = rotateFace(newCube.top, isCounterClockwise)
    const temp = [newCube.front[0][0], newCube.front[0][1], newCube.front[0][2]]
    if (!isCounterClockwise) {
      // U: front[0,*] -> right[0,*], right[0,*] -> back[0,*], back[0,*] -> left[0,*], left[0,*] -> front[0,*]
      newCube.front[0][0] = newCube.left[0][0]
      newCube.front[0][1] = newCube.left[0][1]
      newCube.front[0][2] = newCube.left[0][2]
      newCube.left[0][0] = newCube.back[0][0]
      newCube.left[0][1] = newCube.back[0][1]
      newCube.left[0][2] = newCube.back[0][2]
      newCube.back[0][0] = newCube.right[0][0]
      newCube.back[0][1] = newCube.right[0][1]
      newCube.back[0][2] = newCube.right[0][2]
      newCube.right[0][0] = temp[0]
      newCube.right[0][1] = temp[1]
      newCube.right[0][2] = temp[2]
    } else {
      // Ui: reverse cycle
      newCube.front[0][0] = newCube.right[0][0]
      newCube.front[0][1] = newCube.right[0][1]
      newCube.front[0][2] = newCube.right[0][2]
      newCube.right[0][0] = newCube.back[0][0]
      newCube.right[0][1] = newCube.back[0][1]
      newCube.right[0][2] = newCube.back[0][2]
      newCube.back[0][0] = newCube.left[0][0]
      newCube.back[0][1] = newCube.left[0][1]
      newCube.back[0][2] = newCube.left[0][2]
      newCube.left[0][0] = temp[0]
      newCube.left[0][1] = temp[1]
      newCube.left[0][2] = temp[2]
    }
  } else if (baseMove === 'D') {
    newCube.bottom = rotateFace(newCube.bottom, isCounterClockwise)
    const temp = [newCube.front[2][0], newCube.front[2][1], newCube.front[2][2]]
    if (!isCounterClockwise) {
      // D: front[2,*] -> left[2,*], left[2,*] -> back[2,*], back[2,*] -> right[2,*], right[2,*] -> front[2,*]
      newCube.front[2][0] = newCube.right[2][0]
      newCube.front[2][1] = newCube.right[2][1]
      newCube.front[2][2] = newCube.right[2][2]
      newCube.right[2][0] = newCube.back[2][0]
      newCube.right[2][1] = newCube.back[2][1]
      newCube.right[2][2] = newCube.back[2][2]
      newCube.back[2][0] = newCube.left[2][0]
      newCube.back[2][1] = newCube.left[2][1]
      newCube.back[2][2] = newCube.left[2][2]
      newCube.left[2][0] = temp[0]
      newCube.left[2][1] = temp[1]
      newCube.left[2][2] = temp[2]
    } else {
      // Di: reverse cycle
      newCube.front[2][0] = newCube.left[2][0]
      newCube.front[2][1] = newCube.left[2][1]
      newCube.front[2][2] = newCube.left[2][2]
      newCube.left[2][0] = newCube.back[2][0]
      newCube.left[2][1] = newCube.back[2][1]
      newCube.left[2][2] = newCube.back[2][2]
      newCube.back[2][0] = newCube.right[2][0]
      newCube.back[2][1] = newCube.right[2][1]
      newCube.back[2][2] = newCube.right[2][2]
      newCube.right[2][0] = temp[0]
      newCube.right[2][1] = temp[1]
      newCube.right[2][2] = temp[2]
    }
  } else if (baseMove === 'F') {
    newCube.front = rotateFace(newCube.front, isCounterClockwise)
    const temp = [newCube.top[2][0], newCube.top[2][1], newCube.top[2][2]]
    if (!isCounterClockwise) {
      // F: top[2,*] -> left[2-*,2], left[2-*,2] -> bottom[0,2-*], bottom[0,2-*] -> right[*,0], right[*,0] -> top[2,*]
      newCube.top[2][0] = newCube.right[0][0]
      newCube.top[2][1] = newCube.right[1][0]
      newCube.top[2][2] = newCube.right[2][0]
      newCube.right[0][0] = newCube.bottom[0][2]
      newCube.right[1][0] = newCube.bottom[0][1]
      newCube.right[2][0] = newCube.bottom[0][0]
      newCube.bottom[0][2] = newCube.left[2][2]
      newCube.bottom[0][1] = newCube.left[1][2]
      newCube.bottom[0][0] = newCube.left[0][2]
      newCube.left[2][2] = temp[0]
      newCube.left[1][2] = temp[1]
      newCube.left[0][2] = temp[2]
    } else {
      // Fi: reverse cycle
      newCube.top[2][0] = newCube.left[2][2]
      newCube.top[2][1] = newCube.left[1][2]
      newCube.top[2][2] = newCube.left[0][2]
      newCube.left[2][2] = newCube.bottom[0][2]
      newCube.left[1][2] = newCube.bottom[0][1]
      newCube.left[0][2] = newCube.bottom[0][0]
      newCube.bottom[0][2] = newCube.right[0][0]
      newCube.bottom[0][1] = newCube.right[1][0]
      newCube.bottom[0][0] = newCube.right[2][0]
      newCube.right[0][0] = temp[0]
      newCube.right[1][0] = temp[1]
      newCube.right[2][0] = temp[2]
    }
  } else if (baseMove === 'B') {
    newCube.back = rotateFace(newCube.back, isCounterClockwise)
    const temp = [newCube.top[0][0], newCube.top[0][1], newCube.top[0][2]]
    if (!isCounterClockwise) {
      // B: top[0,*] -> right[2-*,2], right[2-*,2] -> bottom[2,2-*], bottom[2,2-*] -> left[*,0], left[*,0] -> top[0,*]
      newCube.top[0][0] = newCube.left[0][0]
      newCube.top[0][1] = newCube.left[1][0]
      newCube.top[0][2] = newCube.left[2][0]
      newCube.left[0][0] = newCube.bottom[2][2]
      newCube.left[1][0] = newCube.bottom[2][1]
      newCube.left[2][0] = newCube.bottom[2][0]
      newCube.bottom[2][2] = newCube.right[2][2]
      newCube.bottom[2][1] = newCube.right[1][2]
      newCube.bottom[2][0] = newCube.right[0][2]
      newCube.right[2][2] = temp[0]
      newCube.right[1][2] = temp[1]
      newCube.right[0][2] = temp[2]
    } else {
      // Bi: reverse cycle
      newCube.top[0][0] = newCube.right[2][2]
      newCube.top[0][1] = newCube.right[1][2]
      newCube.top[0][2] = newCube.right[0][2]
      newCube.right[2][2] = newCube.bottom[2][2]
      newCube.right[1][2] = newCube.bottom[2][1]
      newCube.right[0][2] = newCube.bottom[2][0]
      newCube.bottom[2][2] = newCube.left[0][0]
      newCube.bottom[2][1] = newCube.left[1][0]
      newCube.bottom[2][0] = newCube.left[2][0]
      newCube.left[0][0] = temp[0]
      newCube.left[1][0] = temp[1]
      newCube.left[2][0] = temp[2]
    }
  }

  return newCube
}
