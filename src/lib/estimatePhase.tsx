export function estimatePhaseSplit(steps: string[]): {
  phase1: string[]
  phase2: string[]
  splitIndex: number
} {
  // Heuristic: tìm vị trí có độ thay đổi mô hình (bước đơn giảm, nhiều bước 2)
  let maxTransitionScore = -1
  let splitIndex = -1

  for (let i = 3; i < steps.length - 3; i++) {
    // Lấy 3 bước trước và 3 bước sau
    const before = steps.slice(i - 3, i)
    const after = steps.slice(i, i + 3)

    const scoreBefore = scoreMoves(before)
    const scoreAfter = scoreMoves(after)

    const transitionScore = scoreBefore - scoreAfter
    if (transitionScore > maxTransitionScore) {
      maxTransitionScore = transitionScore
      splitIndex = i
    }
  }

  return {
    phase1: steps.slice(0, splitIndex),
    phase2: steps.slice(splitIndex),
    splitIndex
  }
}

function scoreMoves(moves: string[]): number {
  return moves.reduce((score, move) => {
    if (move.endsWith("'")) score += 2
    else if (move.endsWith('2')) score += 1
    else score += 1.5 // các bước 1 chiều
    return score
  }, 0)
}
