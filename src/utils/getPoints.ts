import type { MathFunc, PointType } from "./types"

export default function getPoints(
  domain: [number, number],
  func: MathFunc,
  stepSize: number,
):PointType[] {
  const points: PointType[] = []
  for(let i=domain[0]; i<domain[1]; i+=stepSize) {
    points.push({x: i, y: func(i)})
  }
  points.push({x: domain[1], y: func(domain[1])})

  return points
}