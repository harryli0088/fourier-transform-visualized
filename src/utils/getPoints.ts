import type { MathFunc, PointType } from "./types"

/**
 * Given the domain, function, and other arguments, return an array of points sampled from the function
 * @param domain          2 element number array [start x value, end x value]
 * @param func            the numeric function to sample
 * @param numPoints       the total number of points/samples
 * @param includeEndPoint whether or not to include the end point in the domain
 * @returns               array of sampled points
 */
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