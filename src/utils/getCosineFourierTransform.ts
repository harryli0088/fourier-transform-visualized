import complex from "./complexNumber"
import { TWO_PI } from "./constants"
import type { MathComplexFunc } from "./types"

/**
 * Returns a function for the indefinite fourier transform for a cosine function
 * Derivation:
 * ^ is used as raising to a power, not the JS XOR operator
 * a = magnitude constant of the input cosine function cos(a*t + b)
 * b = phase shift constant of the input cosine function cos(a*t + b)
 * f = frequency
 * i = imaginary unit
 * H = definite integral higher bound (resolved in getDefiniteIntegralFunction)
 * L = definite integral lower bound (resolved in getDefiniteIntegralFunction)
 * t = time
 * Fourier Transform(freq) = ∫(from t = L to H) cos(at+b)*e^(-2πitf) dt
 * (through Euler's formula) = ∫(from t = L to H) cos(at+b)cos(-2πtf) + icos(at+b)sin(-2πtf) dx
 * (through trig identities) = (1/2)∫(from t = L to H) cos(at+b-2πtf) + cos(at+b+2πtf) + isin(-2πtf+at+b) + isin(-2πtf-at-b) dx
 * (simplified) = (1/2)∫(from t = L to H) cos((a-2πtf)t+b) + cos((a+2πf)t+b) + isin((a-2πf)t+b) +isin((-a-2πf)t-b) dx
 * = (1/2)( sin((a-2πf)t+b)/(a-2πf) + sin((a+2πf)t+b)/(a+2πf) - icos((a-2πf)t+b)/(a-2πf) + icos((-a-2πf)t-b)/(a+2πf) ) ](from t = L to H)
 * 
 * @param a the magnitude constant in the function cos(a*t + b)
 * @param b the phase shift constant in the function cos(a*t + b)
 * @returns a function that given an input x, returns the fourier transform for freq
 */
export default function getCosineFourierTransform(
  a: number,
  b: number,
):(t: number) => MathComplexFunc {
  return (t: number):MathComplexFunc => {
    return (freq: number) => {
      if(a === TWO_PI*freq || a === -TWO_PI*freq) { //if the frequency of the input cosine matches
        freq += 0.000000001 //increment the frequency a little so we don't end up with a zero denominator
      }
      const twoPiFreq = TWO_PI*freq
      const aMinusTwoPiFreq = a - twoPiFreq
      const aPlusTwoPiFreq = a + twoPiFreq
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


