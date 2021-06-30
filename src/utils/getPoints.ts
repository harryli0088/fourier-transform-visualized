import type { MathFunc, PointType } from "./types"

export default function getPoints(
  domain: [number, number],
  func: MathFunc,
  numPoints?: number,
  includeEndPoint: boolean = true
):PointType[] {
  const start = domain[0]
  const span = domain[1] - start
  if(!(numPoints > 0)) {
    numPoints = 1000 * span
  }
  const total = numPoints + (includeEndPoint ? -1 : 0)

  const points: PointType[] = []
  for(let i=0; i<numPoints; ++i) {
    const x = start + span*i/total
    points.push({x, y: func(x)})
  }

  return points
}