import complex, { ComplexNumber } from "./complexNumber"

/**
 * Generic O(n^2) Discrete Fourier Transform
 * @param x sampled values
 * @returns DFT values as an array of complex numbers
 */
export default function dft(
  x: number[],
) {
  const X: ComplexNumber[] = new Array()
  const N = x.length

  for(let k=0; k<N; ++k) {
    X[k] = complex.makeNew({}) //initialize zero complex number
    
    for(let n=0; n<N; ++n) {
      const term = 2*Math.PI*k*n/N
      complex.addInPlace(
        X[k],
        complex.multiply(
          complex.makeNew({r: x[n]}),
          complex.makeNew({
            i: Math.sin(term),
            r: Math.cos(term),
          })
        )
      )
    }
  }

  return X
}