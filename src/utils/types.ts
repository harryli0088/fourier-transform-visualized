import type { ComplexNumber } from "./complexNumber"

export type MathFunc = (x: number) => number
export type MathComplexFunc = (x: number) => ComplexNumber

export type PointType = {
  x: number,
  y: number,
}