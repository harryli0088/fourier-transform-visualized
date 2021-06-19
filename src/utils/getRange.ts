import type { PointType } from "./types"

/**
 * Returns the range of y values
 * @param points array of points
 * @returns      array with lowest and highest y values
 */
export default function getRange(points: PointType[]):[number, number] {
  if(points.length > 0) { //if there are points
    //initialize min and max to first points
    let max = points[0].y
    let min = max
    for(let i=1; i<points.length; ++i) { //loop through the rest of the points
      const y = points[i].y
      if(y > max) { //if this is a new max
        max = y //set it
      }
      if(y < min) { //if this is a new min
        min = y //set it
      }
    }
    return [min, max] //[minimum y value, maximum y value]
  }
  return [0,0] //else default to 0,0
}