import { CubeState } from '@/interfaces/cubeState'
import { CubeFace, CubeColor } from '@/types/cubeType'

// Interface for a cube piece (edge or corner)
interface Piece {
  position: { x: number; y: number; z: number }
  colors: CubeColor[]
}

// Interface for face center pieces
interface CenterPiece {
  position: { x: number; y: number; z: number }
  color: CubeColor
}

// Simplified Cube class to manage state and moves
class Cube {
  private edges: Piece[]
  private corners: Piece[]
  private centers: CenterPiece[]
  private cubeState: CubeState

  constructor(cubeState: CubeState) {
    this.cubeState = JSON.parse(JSON.stringify(cubeState)) as CubeState
    this.edges = []
    this.corners = []
    this.centers = []
    this.initializePieces()
  }

  // Initialize center, edge, and corner pieces
  private initializePieces() {
    // Centers (fixed, one per face)
    this.centers = [
      { position: { x: 0, y: 1, z: 0 }, color: this.cubeState.top[1][1] }, // Up
      { position: { x: 0, y: -1, z: 0 }, color: this.cubeState.bottom[1][1] }, // Down
      { position: { x: -1, y: 0, z: 0 }, color: this.cubeState.left[1][1] }, // Left
      { position: { x: 1, y: 0, z: 0 }, color: this.cubeState.right[1][1] }, // Right
      { position: { x: 0, y: 0, z: 1 }, color: this.cubeState.front[1][1] }, // Front
      { position: { x: 0, y: 0, z: -1 }, color: this.cubeState.back[1][1] } // Back
    ]

    // Edges (12 edges, each with 2 colors)
    this.edges = [
      // Front face edges
      {
        position: { x: 0, y: 1, z: 1 },
        colors: [this.cubeState.front[0][1], this.cubeState.top[2][1]]
      }, // FU
      {
        position: { x: 0, y: -1, z: 1 },
        colors: [this.cubeState.front[2][1], this.cubeState.bottom[0][1]]
      }, // FD
      {
        position: { x: -1, y: 0, z: 1 },
        colors: [this.cubeState.front[1][0], this.cubeState.left[1][2]]
      }, // FL
      {
        position: { x: 1, y: 0, z: 1 },
        colors: [this.cubeState.front[1][2], this.cubeState.right[1][0]]
      }, // FR
      // Back face edges
      {
        position: { x: 0, y: 1, z: -1 },
        colors: [this.cubeState.back[0][1], this.cubeState.top[0][1]]
      }, // BU
      {
        position: { x: 0, y: -1, z: -1 },
        colors: [this.cubeState.back[2][1], this.cubeState.bottom[2][1]]
      }, // BD
      {
        position: { x: -1, y: 0, z: -1 },
        colors: [this.cubeState.back[1][2], this.cubeState.left[1][0]]
      }, // BL
      {
        position: { x: 1, y: 0, z: -1 },
        colors: [this.cubeState.back[1][0], this.cubeState.right[1][2]]
      }, // BR
      // Middle layer edges
      {
        position: { x: -1, y: 1, z: 0 },
        colors: [this.cubeState.left[0][1], this.cubeState.top[1][0]]
      }, // UL
      {
        position: { x: 1, y: 1, z: 0 },
        colors: [this.cubeState.right[0][1], this.cubeState.top[1][2]]
      }, // UR
      {
        position: { x: -1, y: -1, z: 0 },
        colors: [this.cubeState.left[2][1], this.cubeState.bottom[1][0]]
      }, // DL
      {
        position: { x: 1, y: -1, z: 0 },
        colors: [this.cubeState.right[2][1], this.cubeState.bottom[1][2]]
      } // DR
    ]

    // Corners (8 corners, each with 3 colors)
    this.corners = [
      // Front face corners
      {
        position: { x: 1, y: 1, z: 1 },
        colors: [
          this.cubeState.front[0][2],
          this.cubeState.top[2][2],
          this.cubeState.right[0][0]
        ]
      }, // FUR
      {
        position: { x: -1, y: 1, z: 1 },
        colors: [
          this.cubeState.front[0][0],
          this.cubeState.top[2][0],
          this.cubeState.left[0][2]
        ]
      }, // FUL
      {
        position: { x: 1, y: -1, z: 1 },
        colors: [
          this.cubeState.front[2][2],
          this.cubeState.bottom[0][2],
          this.cubeState.right[2][0]
        ]
      }, // FDR
      {
        position: { x: -1, y: -1, z: 1 },
        colors: [
          this.cubeState.front[2][0],
          this.cubeState.bottom[0][0],
          this.cubeState.left[2][2]
        ]
      }, // FDL
      // Back face corners
      {
        position: { x: 1, y: 1, z: -1 },
        colors: [
          this.cubeState.back[0][0],
          this.cubeState.top[0][2],
          this.cubeState.right[0][2]
        ]
      }, // BUR
      {
        position: { x: -1, y: 1, z: -1 },
        colors: [
          this.cubeState.back[0][2],
          this.cubeState.top[0][0],
          this.cubeState.left[0][0]
        ]
      }, // BUL
      {
        position: { x: 1, y: -1, z: -1 },
        colors: [
          this.cubeState.back[2][0],
          this.cubeState.bottom[2][2],
          this.cubeState.right[2][2]
        ]
      }, // BDR
      {
        position: { x: -1, y: -1, z: -1 },
        colors: [
          this.cubeState.back[2][2],
          this.cubeState.bottom[2][0],
          this.cubeState.left[2][0]
        ]
      } // BDL
    ]
  }

  // Get center color for a face
  getCenterColor(face: keyof CubeState): CubeColor {
    return this.cubeState[face][1][1]
  }

  // Find a piece by its colors
  findPiece(color1: CubeColor, color2?: CubeColor, color3?: CubeColor): Piece {
    const colors = [color1]
    if (color2) colors.push(color2)
    if (color3) colors.push(color3)
    const target = colors.length === 2 ? this.edges : this.corners
    const piece = target.find((p) => colors.every((c) => p.colors.includes(c)))
    if (!piece) {
      console.error(`Piece not found with colors: ${colors.join(', ')}`)
      throw new Error('Piece not found')
    }
    return piece
  }

  // Apply a move
  sequence(moveString: string) {
    const moves = moveString.split(' ')
    moves.forEach((move) => {
      this.cubeState = applyMove(this.cubeState, move)
      this.updatePiecesAfterMove(move)
    })
  }

  // Update piece positions and orientations after a move
  private updatePiecesAfterMove(move: string) {
    const isCounterClockwise = move.endsWith('i')
    const baseMove = move.replace('i', '')
    const angle = isCounterClockwise ? -90 : 90
    const axis = this.getAxis(baseMove) as 'x' | 'y' | 'z'

    const rotatePosition = (pos: {
      x: number
      y: number
      z: number
    }): { x: number; y: number; z: number } => {
      const rad = (angle * Math.PI) / 180
      if (axis === 'x') {
        const y = pos.y * Math.cos(rad) - pos.z * Math.sin(rad)
        const z = pos.y * Math.sin(rad) + pos.z * Math.cos(rad)
        return { x: pos.x, y: Math.round(y), z: Math.round(z) }
      } else if (axis === 'y') {
        const x = pos.x * Math.cos(rad) - pos.z * Math.sin(rad)
        const z = pos.x * Math.sin(rad) + pos.z * Math.cos(rad)
        return { x: Math.round(x), y: pos.y, z: Math.round(z) }
      } else if (axis === 'z') {
        const x = pos.x * Math.cos(rad) - pos.y * Math.sin(rad)
        const y = pos.x * Math.sin(rad) + pos.y * Math.cos(rad)
        return { x: Math.round(x), y: Math.round(y), z: pos.z }
      }
      return pos
    }

    const affectedEdges = this.edges.filter(
      (p) => Math.abs(p.position[axis as keyof typeof p.position]) === 1
    )
    const affectedCorners = this.corners.filter(
      (p) => Math.abs(p.position[axis as keyof typeof p.position]) === 1
    )

    affectedEdges.forEach((edge) => {
      edge.position = rotatePosition(edge.position)
      // Update color orientation (simplified)
      if (baseMove === 'R' && !isCounterClockwise) {
        edge.colors = [edge.colors[1], edge.colors[0]] // Swap for simplicity
      }
    })

    affectedCorners.forEach((corner) => {
      corner.position = rotatePosition(corner.position)
      // Update color orientation (simplified)
      if (baseMove === 'R' && !isCounterClockwise) {
        corner.colors = [corner.colors[2], corner.colors[0], corner.colors[1]] // Rotate colors
      }
    })
  }

  // Get rotation axis for a move
  private getAxis(move: string): string {
    const baseMove = move.replace('i', '')
    const axes: { [key: string]: string } = {
      R: 'x',
      L: 'x',
      U: 'y',
      D: 'y',
      F: 'z',
      B: 'z'
    }
    return axes[baseMove] || ''
  }

  // Check if cube is solved
  isSolved(): boolean {
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const
    return faces.every((face) =>
      this.cubeState[face].every((row) =>
        row.every((c) => c === this.cubeState[face][1][1])
      )
    )
  }

  // Convert CubeState to string (for debugging)
  toString(): string {
    const faces = ['top', 'bottom', 'left', 'right', 'front', 'back'] as const
    let result = ''
    for (const face of faces) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          result += this.cubeState[face][i][j][0].toUpperCase()
        }
      }
    }
    return result
  }
}

// Apply a single move to the CubeState
function applyMove(cube: CubeState, move: string): CubeState {
  const newCube = JSON.parse(JSON.stringify(cube)) as CubeState
  const isCounterClockwise = move.endsWith('i')
  const baseMove = move.replace('i', '')

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
  }
  // TODO: Implement other moves (L, U, D, F, B, Li, Ui, Di, Fi, Bi)
  return newCube
}

// Solver class
class Solver {
  private cube: Cube
  private moves: string[]
  private infiniteLoopMaxIterations: number = 12

  constructor(cube: Cube) {
    this.cube = cube
    this.moves = []
  }

  private move(moveStr: string) {
    this.moves.push(...moveStr.split(' '))
    this.cube.sequence(moveStr)
  }

  private cross() {
    const frontColor = this.cube.getCenterColor('front')
    const leftColor = this.cube.getCenterColor('left')
    const rightColor = this.cube.getCenterColor('right')
    const upColor = this.cube.getCenterColor('top')
    const downColor = this.cube.getCenterColor('bottom')

    try {
      const flPiece = this.cube.findPiece(frontColor, leftColor)
      const frPiece = this.cube.findPiece(frontColor, rightColor)
      const fuPiece = this.cube.findPiece(frontColor, upColor)
      const fdPiece = this.cube.findPiece(frontColor, downColor)

      this._crossLeftOrRight(
        flPiece,
        { x: -1, y: 0, z: 0 },
        leftColor,
        'L L',
        'E L Ei Li'
      )
      this._crossLeftOrRight(
        frPiece,
        { x: 1, y: 0, z: 0 },
        rightColor,
        'R R',
        'Ei R E Ri'
      )
      this.move('Z')
      this._crossLeftOrRight(
        fdPiece,
        { x: -1, y: 0, z: 0 },
        downColor,
        'L L',
        'E L Ei Li'
      )
      this._crossLeftOrRight(
        fuPiece,
        { x: 1, y: 0, z: 0 },
        upColor,
        'R R',
        'Ei R E Ri'
      )
      this.move('Zi')
    } catch (e) {
      if (e instanceof Error) {
        console.error('Error in cross:', e.message)
      } else {
        console.error('Error in cross:', e)
      }
      throw e
    }
  }

  private _crossLeftOrRight(
    edgePiece: Piece,
    facePiece: { x: number; y: number; z: number },
    faceColor: CubeColor,
    move1: string,
    move2: string
  ) {
    // Move edge to back face (z=-1) if needed
    let count = 0
    while (
      edgePiece.position.z !== -1 &&
      count < this.infiniteLoopMaxIterations
    ) {
      this.move('B')
      edgePiece.position = this.cube.findPiece(
        faceColor,
        edgePiece.colors.find((c) => c !== faceColor)!
      ).position
      count++
    }
    if (count >= this.infiniteLoopMaxIterations) {
      throw new Error('Stuck in loop during cross')
    }
    // Move to correct position
    count = 0
    while (
      (edgePiece.position.x !== facePiece.x ||
        edgePiece.position.y !== facePiece.y) &&
      count < this.infiniteLoopMaxIterations
    ) {
      this.move('B')
      edgePiece.position = this.cube.findPiece(
        faceColor,
        edgePiece.colors.find((c) => c !== faceColor)!
      ).position
      count++
    }
    if (count >= this.infiniteLoopMaxIterations) {
      throw new Error('Stuck in loop during cross')
    }
    // Orient the piece
    if (edgePiece.colors[0] === faceColor) {
      this.move(move1)
    } else {
      this.move(move2)
    }
  }

  solve(): string[] {
    this.cross()
    // TODO: Implement remaining steps (crossCorners, secondLayer, etc.)
    return this.moves
  }
}

// Main solveCube function
export function solveCube(cubeState: CubeState): string[] {
  if (!cubeState || !isValidCubeState(cubeState)) {
    throw new Error('Invalid cube state')
  }

  const cube = new Cube(cubeState)
  const solver = new Solver(cube)

  try {
    const moves = solver.solve()
    if (!cube.isSolved()) {
      throw new Error('Cube solving failed')
    }
    return moves
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to solve cube: ${e.message}`)
    } else {
      throw new Error('Failed to solve cube: Unknown error')
    }
  }
}

// Validate CubeState
function isValidCubeState(cubeState: CubeState): boolean {
  const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const
  const validColors: CubeColor[] = [
    'white',
    'yellow',
    'red',
    'orange',
    'blue',
    'green'
  ]
  const colorCounts: { [key in CubeColor]?: number } = {}

  for (const face of faces) {
    if (
      !cubeState[face] ||
      !Array.isArray(cubeState[face]) ||
      cubeState[face].length !== 3
    ) {
      console.error(`Invalid face structure for ${face}`)
      return false
    }
    for (let i = 0; i < 3; i++) {
      if (
        !Array.isArray(cubeState[face][i]) ||
        cubeState[face][i].length !== 3
      ) {
        console.error(`Invalid row structure for ${face}[${i}]`)
        return false
      }
      for (let j = 0; j < 3; j++) {
        const color = cubeState[face][i][j]
        if (!validColors.includes(color)) {
          console.error(`Invalid color ${color} at ${face}[${i}][${j}]`)
          return false
        }
        colorCounts[color] = (colorCounts[color] || 0) + 1
      }
    }
  }

  console.log('Color counts:', colorCounts)
  const isValid =
    Object.keys(colorCounts).length === 6 &&
    Object.values(colorCounts).every((count) => count === 9)
  if (!isValid) {
    console.error('Invalid color distribution:', colorCounts)
  }
  return isValid
}
