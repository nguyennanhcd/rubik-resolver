// src/lib/cubeMoves.ts
import { CubeState } from '@/interfaces/cubeState'
import { CubeFace } from '@/types/cubeType'

// Helper to rotate a 3x3 face matrix 90 degrees clockwise
function rotateFaceClockwise(face: CubeFace): CubeFace {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]]
  ]
}

// Helper to rotate a 3x3 face matrix 90 degrees counterclockwise
function rotateFaceCounterClockwise(face: CubeFace): CubeFace {
  return [
    [face[0][2], face[1][2], face[2][2]],
    [face[0][1], face[1][1], face[2][1]],
    [face[0][0], face[1][0], face[2][0]]
  ]
}

// Helper to copy a face
function copyFace(face: CubeFace): CubeFace {
  return face.map((row) => [...row])
}

export function applyMove(cube: CubeState, move: string): void {
  const newCube = { ...cube }
  let faceToRotate: keyof CubeState
  let isClockwise = true
  let isDouble = false

  // Parse the move
  if (move.includes("'")) {
    isClockwise = false
  } else if (move.includes('2')) {
    isDouble = true
  }
  const baseMove = move[0] as 'U' | 'D' | 'L' | 'R' | 'F' | 'B'

  // Determine which face to rotate
  switch (baseMove) {
    case 'U':
      faceToRotate = 'top'
      break
    case 'D':
      faceToRotate = 'bottom'
      break
    case 'L':
      faceToRotate = 'left'
      break
    case 'R':
      faceToRotate = 'right'
      break
    case 'F':
      faceToRotate = 'front'
      break
    case 'B':
      faceToRotate = 'back'
      break
    default:
      return
  }

  // Rotate the face
  const face = copyFace(newCube[faceToRotate])
  newCube[faceToRotate] = isClockwise
    ? rotateFaceClockwise(face)
    : rotateFaceCounterClockwise(face)
  if (isDouble) {
    newCube[faceToRotate] = rotateFaceClockwise(newCube[faceToRotate])
  }

  // Update adjacent faces
  if (baseMove === 'U') {
    const frontRow = [...newCube.front[0]]
    const rightRow = [...newCube.right[0]]
    const backRow = [...newCube.back[0]]
    const leftRow = [...newCube.left[0]]
    if (isClockwise) {
      newCube.front[0] = leftRow
      newCube.right[0] = frontRow
      newCube.back[0] = rightRow
      newCube.left[0] = backRow
    } else {
      newCube.front[0] = rightRow
      newCube.right[0] = backRow
      newCube.back[0] = leftRow
      newCube.left[0] = frontRow
    }
    if (isDouble) {
      const tempFront = [...newCube.front[0]]
      newCube.front[0] = backRow
      newCube.right[0] = leftRow
      newCube.back[0] = tempFront
      newCube.left[0] = rightRow
    }
  } else if (baseMove === 'D') {
    const frontRow = [...newCube.front[2]]
    const rightRow = [...newCube.right[2]]
    const backRow = [...newCube.back[2]]
    const leftRow = [...newCube.left[2]]
    if (isClockwise) {
      newCube.front[2] = rightRow
      newCube.right[2] = backRow
      newCube.back[2] = leftRow
      newCube.left[2] = frontRow
    } else {
      newCube.front[2] = leftRow
      newCube.right[2] = frontRow
      newCube.back[2] = rightRow
      newCube.left[2] = backRow
    }
    if (isDouble) {
      const tempFront = [...newCube.front[2]]
      newCube.front[2] = backRow
      newCube.right[2] = leftRow
      newCube.back[2] = tempFront
      newCube.left[2] = rightRow
    }
  } else if (baseMove === 'L') {
    const frontCol = [
      newCube.front[0][0],
      newCube.front[1][0],
      newCube.front[2][0]
    ]
    const topCol = [newCube.top[0][0], newCube.top[1][0], newCube.top[2][0]]
    const backCol = [newCube.back[0][2], newCube.back[1][2], newCube.back[2][2]]
    const bottomCol = [
      newCube.bottom[0][0],
      newCube.bottom[1][0],
      newCube.bottom[2][0]
    ]
    if (isClockwise) {
      newCube.front[0][0] = bottomCol[0]
      newCube.front[1][0] = bottomCol[1]
      newCube.front[2][0] = bottomCol[2]
      newCube.top[0][0] = frontCol[0]
      newCube.top[1][0] = frontCol[1]
      newCube.top[2][0] = frontCol[2]
      newCube.back[0][2] = topCol[0]
      newCube.back[1][2] = topCol[1]
      newCube.back[2][2] = topCol[2]
      newCube.bottom[0][0] = backCol[0]
      newCube.bottom[1][0] = backCol[1]
      newCube.bottom[2][0] = backCol[2]
    } else {
      newCube.front[0][0] = topCol[0]
      newCube.front[1][0] = topCol[1]
      newCube.front[2][0] = topCol[2]
      newCube.top[0][0] = backCol[0]
      newCube.top[1][0] = backCol[1]
      newCube.top[2][0] = backCol[2]
      newCube.back[0][2] = bottomCol[0]
      newCube.back[1][2] = bottomCol[1]
      newCube.back[2][2] = bottomCol[2]
      newCube.bottom[0][0] = frontCol[0]
      newCube.bottom[1][0] = frontCol[1]
      newCube.bottom[2][0] = frontCol[2]
    }
    if (isDouble) {
      const tempFront = [
        newCube.front[0][0],
        newCube.front[1][0],
        newCube.front[2][0]
      ]
      newCube.front[0][0] = backCol[0]
      newCube.front[1][0] = backCol[1]
      newCube.front[2][0] = backCol[2]
      newCube.top[0][0] = bottomCol[0]
      newCube.top[1][0] = bottomCol[1]
      newCube.top[2][0] = bottomCol[2]
      newCube.back[0][2] = tempFront[0]
      newCube.back[1][2] = tempFront[1]
      newCube.back[2][2] = tempFront[2]
      newCube.bottom[0][0] = topCol[0]
      newCube.bottom[1][0] = topCol[1]
      newCube.bottom[2][0] = topCol[2]
    }
  } else if (baseMove === 'R') {
    const frontCol = [
      newCube.front[0][2],
      newCube.front[1][2],
      newCube.front[2][2]
    ]
    const topCol = [newCube.top[0][2], newCube.top[1][2], newCube.top[2][2]]
    const backCol = [newCube.back[0][0], newCube.back[1][0], newCube.back[2][0]]
    const bottomCol = [
      newCube.bottom[0][2],
      newCube.bottom[1][2],
      newCube.bottom[2][2]
    ]
    if (isClockwise) {
      newCube.front[0][2] = topCol[0]
      newCube.front[1][2] = topCol[1]
      newCube.front[2][2] = topCol[2]
      newCube.top[0][2] = backCol[0]
      newCube.top[1][2] = backCol[1]
      newCube.top[2][2] = backCol[2]
      newCube.back[0][0] = bottomCol[0]
      newCube.back[1][0] = bottomCol[1]
      newCube.back[2][0] = bottomCol[2]
      newCube.bottom[0][2] = frontCol[0]
      newCube.bottom[1][2] = frontCol[1]
      newCube.bottom[2][2] = frontCol[2]
    } else {
      newCube.front[0][2] = bottomCol[0]
      newCube.front[1][2] = bottomCol[1]
      newCube.front[2][2] = bottomCol[2]
      newCube.top[0][2] = frontCol[0]
      newCube.top[1][2] = frontCol[1]
      newCube.top[2][2] = frontCol[2]
      newCube.back[0][0] = topCol[0]
      newCube.back[1][0] = topCol[1]
      newCube.back[2][0] = topCol[2]
      newCube.bottom[0][2] = backCol[0]
      newCube.bottom[1][2] = backCol[1]
      newCube.bottom[2][2] = backCol[2]
    }
    if (isDouble) {
      const tempFront = [
        newCube.front[0][2],
        newCube.front[1][2],
        newCube.front[2][2]
      ]
      newCube.front[0][2] = backCol[0]
      newCube.front[1][2] = backCol[1]
      newCube.front[2][2] = backCol[2]
      newCube.top[0][2] = bottomCol[0]
      newCube.top[1][2] = bottomCol[1]
      newCube.top[2][2] = bottomCol[2]
      newCube.back[0][0] = tempFront[0]
      newCube.back[1][0] = tempFront[1]
      newCube.back[2][0] = tempFront[2]
      newCube.bottom[0][2] = topCol[0]
      newCube.bottom[1][2] = topCol[1]
      newCube.bottom[2][2] = topCol[2]
    }
  } else if (baseMove === 'F') {
    const topRow = [...newCube.top[2]]
    const rightCol = [
      newCube.right[0][0],
      newCube.right[1][0],
      newCube.right[2][0]
    ]
    const bottomRow = [...newCube.bottom[0]]
    const leftCol = [newCube.left[0][2], newCube.left[1][2], newCube.left[2][2]]
    if (isClockwise) {
      newCube.top[2] = leftCol.reverse()
      newCube.right[0][0] = topRow[0]
      newCube.right[1][0] = topRow[1]
      newCube.right[2][0] = topRow[2]
      newCube.bottom[0] = rightCol.reverse()
      newCube.left[0][2] = bottomRow[0]
      newCube.left[1][2] = bottomRow[1]
      newCube.left[2][2] = bottomRow[2]
    } else {
      newCube.top[2] = rightCol
      newCube.right[0][0] = bottomRow[2]
      newCube.right[1][0] = bottomRow[1]
      newCube.right[2][0] = bottomRow[0]
      newCube.bottom[0] = leftCol
      newCube.left[0][2] = topRow[2]
      newCube.left[1][2] = topRow[1]
      newCube.left[2][2] = topRow[0]
    }
    if (isDouble) {
      const tempTop = [...newCube.top[2]]
      newCube.top[2] = bottomRow.reverse()
      newCube.right[0][0] = leftCol[2]
      newCube.right[1][0] = leftCol[1]
      newCube.right[2][0] = leftCol[0]
      newCube.bottom[0] = tempTop.reverse()
      newCube.left[0][2] = rightCol[2]
      newCube.left[1][2] = rightCol[1]
      newCube.left[2][2] = rightCol[0]
    }
  } else if (baseMove === 'B') {
    const topRow = [...newCube.top[0]]
    const rightCol = [
      newCube.right[0][2],
      newCube.right[1][2],
      newCube.right[2][2]
    ]
    const bottomRow = [...newCube.bottom[2]]
    const leftCol = [newCube.left[0][0], newCube.left[1][0], newCube.left[2][0]]
    if (isClockwise) {
      newCube.top[0] = rightCol
      newCube.right[0][2] = bottomRow[2]
      newCube.right[1][2] = bottomRow[1]
      newCube.right[2][2] = bottomRow[0]
      newCube.bottom[2] = leftCol
      newCube.left[0][0] = topRow[2]
      newCube.left[1][0] = topRow[1]
      newCube.left[2][0] = topRow[0]
    } else {
      newCube.top[0] = leftCol.reverse()
      newCube.right[0][2] = topRow[0]
      newCube.right[1][2] = topRow[1]
      newCube.right[2][2] = topRow[2]
      newCube.bottom[2] = rightCol.reverse()
      newCube.left[0][0] = bottomRow[0]
      newCube.left[1][0] = bottomRow[1]
      newCube.left[2][0] = bottomRow[2]
    }
    if (isDouble) {
      const tempTop = [...newCube.top[0]]
      newCube.top[0] = bottomRow
      newCube.right[0][2] = leftCol[0]
      newCube.right[1][2] = leftCol[1]
      newCube.right[2][2] = leftCol[2]
      newCube.bottom[2] = tempTop
      newCube.left[0][0] = rightCol[0]
      newCube.left[1][0] = rightCol[1]
      newCube.left[2][0] = rightCol[2]
    }
  }

  // Update the cube state
  Object.assign(cube, newCube)
}
