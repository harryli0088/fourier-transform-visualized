import type { PointType } from "./types"

/**
 * Returns the range of values
 * @param points    array of points
 * @param accessor  given the point, return the value, defaults to p.y
 * @returns         array with lowest and highest values
 */
export default function getRange(
  points: PointType[],
  accessor: (p: PointType) => number = (p: PointType) => p.y
):[number, number] {
  if(points.length > 0) { //if there are points
    //initialize min and max to first points
    let max = accessor(points[0])
    let min = max
    for(let i=1; i<points.length; ++i) { //loop through the rest of the points
      const value = accessor(points[i])
      if(value > max) { //if this is a new max
        max = value //set it
      }
      if(value < min) { //if this is a new min
        min = value //set it
      }
    }
    return [min, max] //[minimum value, maximum value]
  }
  return [0,0] //else default to 0,0
}