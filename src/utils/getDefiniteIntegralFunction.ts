import complex from "./complexNumber";
import type { MathComplexFunc } from "./types";

/**
 * Given an indefinite integraland its time bounds,
 * return a function that returns the definite integral given an input frequency
 * @param func      the indefinite integral function that given a time, returns the function taking in frequencies
 * @param lowBound  the low bound time bound
 * @param highBound the high bound time bound
 * @returns         a function that given the input frequency, returns definite integral
 */
export default function getDefiniteIntegralFunction(
  func: (t: number) => MathComplexFunc,
  lowBound: number,
  highBound: number,
) {
  const highBoundFunc = func(highBound)
  const lowBoundFunc = func(lowBound)
  return (freq: number) => (
    complex.subtract(
      highBoundFunc(freq),
      lowBoundFunc(freq),
    )
  )
}