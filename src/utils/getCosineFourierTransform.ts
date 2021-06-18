import complex from "./complexNumber"
import { TWO_PI } from "./constants"
import type { MathComplexFunc } from "./types"

/**
 * Returns a function for the indefinite fourier transform for a cosine function
 * @param a the magnitude constant in the function cos(ax + b)
 * @param b the phase shift constant in the function cos(ax + b)
 * @returns a function that given an input x, returns the fourier transform for freq
 */
export default function getCosineFourierTransform(
  a: number,
  b: number,
):(t: number) => MathComplexFunc {
  return (t: number):MathComplexFunc => {
    return (freq: number) => {
      const aMinusTwoPiFreq = a - TWO_PI*freq
      const aPlusTwoPiFreq = a + TWO_PI*freq
      return complex.makeNew({
        i: (
          Math.cos(-1*aPlusTwoPiFreq*t - b) / aPlusTwoPiFreq
          - Math.cos(aMinusTwoPiFreq*t + b) / aMinusTwoPiFreq
        ) / 2,
        r: (
          Math.sin(aMinusTwoPiFreq*t + b) / aMinusTwoPiFreq
          + Math.sin(aPlusTwoPiFreq*t + b) / aPlusTwoPiFreq
        ) / 2,
      })
    }
  }
}


