import { COSINE_SHIFTED } from "./constants"

/**
 * Returns a cosine function given an input time t in the form cos(at + b)
 * @param freq    the frequency "a" term
 * @param offset  the phase shift "b" term
 * @param shifted if true, shift the cosine up 1, then divide by 2 to keep the range between 0 and 1
 * @returns       cosine function
 */
export default function getCos(
  freq: number = 1,
  offset: number = 0,
  shifted: boolean = COSINE_SHIFTED
) {
  if(shifted) {
    return (t: number) => (Math.cos(freq*t + offset) + 1) / 2
  }
  return (t: number) => Math.cos(freq*t + offset)
}

/**
 * Given multiple frequencies to add,
 * return a function that, given the time, returns the sum of the cosines
 * @param freqs array of frequencies to add up
 * @returns     a function that, given the time, returns the sum of the cosines
 */
export function getCombinedCos(
  freqs: number[] = [1]
) {
  const funcs = freqs.map(f => getCos(f)) //map all the frequencies to cosine functions
  /**
   * @param t time in seconds
   * @returns sum of all the cosine functions at time t
   */
  return (t: number) => funcs.reduce((sum,func) => sum + func(t), 0)
}