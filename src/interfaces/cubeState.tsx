import { CubeFace } from '@/types/cubeType'

export const cubeFaceNames = [
  'front',
  'back',
  'left',
  'right',
  'top',
  'bottom'
] as const
export type CubeFaceName = (typeof cubeFaceNames)[number]

export interface CubeState {
  front: CubeFace
  back: CubeFace
  left: CubeFace
  right: CubeFace
  top: CubeFace
  bottom: CubeFace
}
