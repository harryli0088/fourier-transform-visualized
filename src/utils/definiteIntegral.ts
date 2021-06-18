import complex from "./complexNumber";
import type { MathComplexFunc, MathFunc } from "./types";

/**
 * Return the function value of the high bound minus the low bound
 * @param func      the indefinite integral function, F
 * @param lowBound  the low bound, a
 * @param highBound the high bound, b
 * @returns         the definite integral F(b) - F(a)
 */
export default function definiteIntegral(
  func: MathFunc,
  lowBound: number,
  highBound: number,
) {
  return func(highBound) - func(lowBound)
}

export function getDefiniteIntegralFunction(
  func: (x: number) => MathComplexFunc,
  lowBound: number,
  highBound: number,
) {
  const highBoundFunc = func(highBound)
  const lowBoundFunc = func(lowBound)
  return (theta: number) => (
    complex.subtract(
      highBoundFunc(theta),
      lowBoundFunc(theta),
    )
  )
}