import { CubeState } from '@/interfaces/cubeState'
import { CubeFace } from '@/types/cubeType'

export function solveCube(
  cube: CubeState,
  executeMove: (move: string, cube: CubeState) => CubeState
): string[] {
  let currentCube = { ...cube }
  const moves: string[] = []
  const MAX_ITERATIONS = 1000

  function isPieceSolved(
    face: CubeFace,
    row: number,
    col: number,
    expectedColor: string
  ): boolean {
    return face[row][col] === expectedColor
  }

  // Helper to execute a move and update the cube state
  function applyMove(move: string): void {
    if (moves.length >= MAX_ITERATIONS) {
      throw new Error('Maximum iterations reached; possible infinite loop.')
    }
    moves.push(move)
    currentCube = executeMove(move, currentCube) // Update cube state
  }

  // Step 1: Bottom Cross (bottom face, e.g., white)
  function solveBottomCross(): void {
    const centerColor = currentCube.bottom[1][1]
    const edges = [
      { face: 'front', row: 2, col: 1, target: 'bottom', tRow: 2, tCol: 1 }, // Front edge
      { face: 'right', row: 2, col: 1, target: 'bottom', tRow: 1, tCol: 2 }, // Right edge
      { face: 'back', row: 2, col: 1, target: 'bottom', tRow: 0, tCol: 1 }, // Back edge
      { face: 'left', row: 2, col: 1, target: 'bottom', tRow: 1, tCol: 0 } // Left edge
    ]

    for (const edge of edges) {
      let iteration = 0
      while (
        !isPieceSolved(
          currentCube[edge.target as keyof CubeState],
          edge.tRow,
          edge.tCol,
          centerColor
        ) &&
        iteration < 50
      ) {
        if (
          currentCube[edge.face as keyof CubeState][edge.row][edge.col] ===
          centerColor
        ) {
          applyMove(`${edge.face[0].toUpperCase()}2`)
        } else {
          applyMove('U')
        }
        iteration++
      }
      if (iteration >= 50) {
        console.warn(`Max iterations reached for edge ${edge.face}`)
      }
    }
  }

  // Step 2: Bottom Corners
  function solveBottomCorners(): void {
    const corners = [
      { face: 'front', row: 2, col: 0, target: 'bottom', tRow: 2, tCol: 0 }, // Front-left
      { face: 'front', row: 2, col: 2, target: 'bottom', tRow: 2, tCol: 2 }, // Front-right
      { face: 'back', row: 2, col: 0, target: 'bottom', tRow: 0, tCol: 0 }, // Back-left
      { face: 'back', row: 2, col: 2, target: 'bottom', tRow: 0, tCol: 2 } // Back-right
    ]
    const cornerAlg = ["R'", "D'", 'R', 'D']

    for (const corner of corners) {
      let iteration = 0
      while (
        !isPieceSolved(
          currentCube[corner.target as keyof CubeState],
          corner.tRow,
          corner.tCol,
          currentCube.bottom[1][1]
        ) &&
        iteration < 50
      ) {
        if (currentCube.top[2][0] === currentCube.bottom[1][1]) {
          for (const move of cornerAlg) applyMove(move)
        } else {
          applyMove('U')
        }
        iteration++
      }
    }
  }

  // Step 3: Middle Edges
  function solveMiddleEdges(): void {
    const edges = [
      { face: 'front', row: 1, col: 1, target: 'front', tRow: 1, tCol: 1 }, // Front
      { face: 'right', row: 1, col: 1, target: 'right', tRow: 1, tCol: 1 }, // Right
      { face: 'back', row: 1, col: 1, target: 'back', tRow: 1, tCol: 1 }, // Back
      { face: 'left', row: 1, col: 1, target: 'left', tRow: 1, tCol: 1 } // Left
    ]
    const rightAlg = ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F']
    const leftAlg = ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"]

    for (const edge of edges) {
      let iteration = 0
      while (
        !isPieceSolved(
          currentCube[edge.target as keyof CubeState],
          edge.tRow,
          edge.tCol,
          currentCube[edge.target as keyof CubeState][1][1]
        ) &&
        iteration < 50
      ) {
        if (
          currentCube.top[2][1] ===
          currentCube[edge.target as keyof CubeState][1][1]
        ) {
          for (const move of edge.target === 'front' || edge.target === 'right'
            ? rightAlg
            : leftAlg) {
            applyMove(move)
          }
        } else {
          applyMove('U')
        }
        iteration++
      }
    }
  }

  // Step 4: Top Cross
  function solveTopCross(): void {
    const centerColor = currentCube.top[1][1]
    let iteration = 0
    while (
      !(
        isPieceSolved(currentCube.top, 0, 1, centerColor) &&
        isPieceSolved(currentCube.top, 1, 0, centerColor) &&
        isPieceSolved(currentCube.top, 1, 2, centerColor) &&
        isPieceSolved(currentCube.top, 2, 1, centerColor)
      ) &&
      iteration < 50
    ) {
      const alg = ['F', 'R', 'U', "R'", "U'", "F'"]
      for (const move of alg) applyMove(move)
      iteration++
    }
  }

  // Step 5: Orient Top Cross
  function orientTopCross(): void {
    let iteration = 0
    while (
      !(
        currentCube.front[0][1] === currentCube.front[1][1] &&
        currentCube.right[0][1] === currentCube.right[1][1] &&
        currentCube.back[0][1] === currentCube.back[1][1] &&
        currentCube.left[0][1] === currentCube.left[1][1]
      ) &&
      iteration < 50
    ) {
      const alg = ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
      for (const move of alg) applyMove(move)
      iteration++
    }
  }

  // Step 6: Position Top Corners
  function positionTopCorners(): void {
    let iteration = 0
    while (
      !(
        currentCube.top[0][0] === currentCube.top[1][1] &&
        currentCube.top[0][2] === currentCube.top[1][1] &&
        currentCube.top[2][0] === currentCube.top[1][1] &&
        currentCube.top[2][2] === currentCube.top[1][1]
      ) &&
      iteration < 50
    ) {
      const alg = ['U', 'R', "U'", "L'", 'U', "R'", "U'", 'L']
      for (const move of alg) applyMove(move)
      iteration++
    }
  }

  // Step 7: Orient Top Corners
  function orientTopCorners(): void {
    const cornerAlg = ["R'", "D'", 'R', 'D']
    let iteration = 0
    while (
      !(
        currentCube.top[0][0] === currentCube.top[1][1] &&
        currentCube.top[0][2] === currentCube.top[1][1] &&
        currentCube.top[2][0] === currentCube.top[1][1] &&
        currentCube.top[2][2] === currentCube.top[1][1]
      ) &&
      iteration < 50
    ) {
      for (const move of cornerAlg) applyMove(move)
      applyMove('U')
      iteration++
    }
  }

  // Execute all steps
  try {
    solveBottomCross()
    solveBottomCorners()
    solveMiddleEdges()
    solveTopCross()
    orientTopCross()
    positionTopCorners()
    orientTopCorners()
  } catch (error) {
    console.error('Error solving cube:', error)
  }

  return moves
}
