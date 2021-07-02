import complex from "./complexNumber"
import fft from "./fft"
import plural from "./plural"
import type { PointType } from "./types"

/**
 * Calculate the DFT and some other data on some samples
 * @param points    sampled points
 * @param timeSpan  time span in seconds
 * @returns         DFT and other data
 */
export default function getDftData(
  points: PointType[],
  timeSpan: number,
) {
  const complexPoints = points.map(p => complex.makeNew({r: p.y})) //convert the samples into complex numbers
  const dftPoints = fft(complexPoints).map((n,i) => ({ //find the DFT
    x: i/timeSpan,
    y: complex.magnitude(n)
  }))
  const slicedDftPoints = dftPoints.slice(0, complexPoints.length / 2).slice(0, 10*timeSpan + 1) //slice to 10
  
  const sampleRate = points.length / timeSpan
  const sampleRateText = `${sampleRate.toFixed(1)} ${plural(sampleRate, "sample")} per second (Hz)`

  return {
    dftPoints,
    sampleRate,
    sampleRateText,
    slicedDftPoints,
  }
}