import complex from "./complexNumber"
import { COSINE_SHIFTED, TWO_PI } from "./constants"
import type { MathComplexFunc } from "./types"

/**
 * Returns a function for the indefinite fourier transform for a cosine function
 * Derivation:
 * ^ is used as raising to a power, not the JS XOR operator
 * a = magnitude constant of the input cosine function cos(a*t + b)
 * b = phase shift constant of the input cosine function cos(a*t + b)
 * i = imaginary unit
 * H = definite integral higher bound (resolved in getDefiniteIntegralFunction)
 * L = definite integral lower bound (resolved in getDefiniteIntegralFunction)
 * t = time
 * w = frequency
 * Fourier Transform(freq) = ∫(from t = L to H) cos(at+b)*e^(-2πitw) dt
 * (through Euler's formula) = ∫(from t = L to H) cos(at+b)cos(-2πtw) + icos(at+b)sin(-2πtw) dt
 * (through trig identities) = (1/2)∫(from t = L to H) cos(at+b-2πtw) + cos(at+b+2πtw) + isin(-2πtw+at+b) + isin(-2πtw-at-b) dt
 * (simplified) = (1/2)∫(from t = L to H) cos((a-2πtw)t+b) + cos((a+2πw)t+b) + isin((a-2πw)t+b) +isin((-a-2πw)t-b) dt
 * = (1/2)( sin((a-2πw)t+b)/(a-2πw) + sin((a+2πw)t+b)/(a+2πw) - icos((a-2πw)t+b)/(a-2πw) + icos((-a-2πw)t-b)/(a+2πw) ) ](from t = L to H)
 * 
 * If the function is shifted up, cos(at+b) becomes cos(at+b)/2 + 1
 * The original derivation for cosine is multiplied by another 1/2 to make the factor 1/4
 * The derivation for the extra +1 term is:
 * ∫(from t = L to H) e^(-2πitw) dt
 * = ∫(from t = L to H) cos(-2πtw) + isin(-2πtw) dt
 * = -sin(-2πtw)/2πw + icos(-2πtw)/2πw ](from t = L to H)
 *
 * @param a       the magnitude constant in the function cos(a*t + b)
 * @param b       the phase shift constant in the function cos(a*t + b)
 * @param shifted whether the function is shifted up to be between 1 and 0. If true, the cosine function is cos(a*t + b)/2 + 1
 * @returns       a function that given an input x, returns the fourier transform for freq
 */
export default function getCosineFourierTransform(
  a: number,
  b: number,
  shifted: boolean = COSINE_SHIFTED
):(t: number) => MathComplexFunc {
  const factor = 1 / (shifted ? 4 : 2)

  return (t: number):MathComplexFunc => {
    return (freq: number) => {
      if(freq===0 || a === TWO_PI*freq || a === -TWO_PI*freq) { //if the frequency of the input cosine matches
        freq += 0.000000001 //increment the frequency a little so we don't end up with a zero denominator
      }
      const twoPiFreq = TWO_PI*freq
      const aMinusTwoPiFreq = a - twoPiFreq
      const aPlusTwoPiFreq = a + twoPiFreq

      const imagPlusOnePart = shifted ? (Math.cos(-twoPiFreq*t)/twoPiFreq) : 0
      const realPlusOnePart = shifted ? (-Math.sin(-twoPiFreq*t)/twoPiFreq) : 0

      return complex.makeNew({
        i: (
          Math.cos(-1*aPlusTwoPiFreq*t - b) / aPlusTwoPiFreq
          - Math.cos(aMinusTwoPiFreq*t + b) / aMinusTwoPiFreq
        ) * factor + imagPlusOnePart,
        r: (
          Math.sin(aMinusTwoPiFreq*t + b) / aMinusTwoPiFreq
          + Math.sin(aPlusTwoPiFreq*t + b) / aPlusTwoPiFreq
        ) * factor + realPlusOnePart,
      })
    }
  }
}


