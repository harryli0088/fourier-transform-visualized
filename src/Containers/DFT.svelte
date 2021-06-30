<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";

  import complex from '../utils/complexNumber';
  import { DOMAIN, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import fft from '../utils/fft';
  import getCos from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';

  const SHIFTED = false
  const INITIAL_FUNC_FREQ = 2
  const funcFreq = tweened(INITIAL_FUNC_FREQ, { //this is the partial frequency for 2pi omitted for simplicity
    duration: 500,
    easing: cubicOut
  })
  $: fullFuncFreq = TWO_PI * $funcFreq //multiply by 2pi to get the full frequency to use
  $: func = getCos(fullFuncFreq, 0, SHIFTED)
  $: points = getPoints(DOMAIN, func)

  $: zeroPaddedPoints = getPoints(DOMAIN, func, 4096).map(
    p => complex.makeNew({r: p.y})
  )
  $: span = DOMAIN[1] - DOMAIN[0]
  $: dftPoints = fft(zeroPaddedPoints).map((n,i) => ({
    x: i/span,
    y: complex.magnitude(n) / points.length
  })).slice(0, zeroPaddedPoints.length / 2).slice(0, 10*span + 1)
  $: console.log("zeroPaddedPoints.length",zeroPaddedPoints.length)

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0, SHIFTED)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, DOMAIN[0], DOMAIN[1])
  $: getReal = (freq: number) => definiteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal)
</script>

<main>
  <h2>Discrete Fourier Transform</h2>
  <p></p>
  <div>
    <span><b>Function Frequency: </b>{$funcFreq.toFixed(1)} {plural($funcFreq, "beat")} per second (Hz)</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0.05"
      on:input={e => funcFreq.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={INITIAL_FUNC_FREQ}
    />
  </div>
  <Plot {points} xTitle="Time in seconds"/>
  <Plot points={ftPoints} xTitle="Fourier Transform"/>
	<Plot points={dftPoints} xTitle="Discrete Fourier Transform"/>
</main>

<style>
</style>
