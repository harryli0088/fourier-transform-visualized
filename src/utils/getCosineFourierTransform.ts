import complex from "./complexNumber"
import { TWO_PI } from "./constants"
import type { MathComplexFunc } from "./types"

/**
 * Returns a function for the indefinite fourier transform for a cosine function
 * @param a the magnitude constant in the function cos(ax + b)
 * @param b the phase shift constant in the function cos(ax + b)
 * @returns a function that given an input x, returns the fourier transform for theta
 */
export default function getCosineFourierTransform(
  a: number,
  b: number,
):(x: number) => MathComplexFunc {
  return (x: number):MathComplexFunc => {
    return (theta: number) => {
      const aMinusTwoPiTheta = a - TWO_PI*theta
      const aPlusTwoPiTheta = a + TWO_PI*theta
      return complex.makeNew({
        i: (
          Math.cos(-1*aPlusTwoPiTheta*x - b) / aPlusTwoPiTheta
          - Math.cos(aMinusTwoPiTheta*x + b) / aMinusTwoPiTheta
        ) / 2,
        r: (
          Math.sin(aMinusTwoPiTheta*x + b) / aMinusTwoPiTheta
          + Math.sin(aPlusTwoPiTheta*x + b) / aPlusTwoPiTheta
        ) / 2,
      })
    }
  }
}


