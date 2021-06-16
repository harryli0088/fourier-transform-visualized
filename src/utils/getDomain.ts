import lastArrEle from "./lastArrEle";
import type { PointType } from "./types";

export default function getDomain(points: PointType[]):[number, number] {
  return points.length > 0 //if there are points
  ? [points[0].x, lastArrEle(points).x] //return the first and last elements
  : [0,0] //else default to 0,0
}