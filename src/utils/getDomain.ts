import lastArrEle from "./lastArrEle";
import type { PointType } from "./types";

/**
 * Returns the x domain of the points, assuming the points are sorted by x
 * @param points array of points, sorted by x
 * @returns      array with first and last values of x
 */
export default function getDomain(points: PointType[]):[number, number] {
  return points.length > 0 //if there are points
  ? [points[0].x, lastArrEle(points).x] //return the first and last elements
  : [0,0] //else default to 0,0
}