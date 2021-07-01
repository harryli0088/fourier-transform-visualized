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

  let domain: [number, number] = [DOMAIN[0], DOMAIN[1]]
  $: timeSpan = domain[1] - domain[0]

  const SHIFTED = false
  const INITIAL_FUNC_FREQ = 2
  const funcFreq = tweened(INITIAL_FUNC_FREQ, { //this is the partial frequency for 2pi omitted for simplicity
    duration: 500,
    easing: cubicOut
  })
  $: fullFuncFreq = TWO_PI * $funcFreq //multiply by 2pi to get the full frequency to use
  $: func = getCos(fullFuncFreq, 0, SHIFTED)
  $: points = getPoints(domain, func)

  const sampleOptions = [512, 1024, 2048, 4096]
  let numSamples = 4096
  $: zeroPaddedPoints = getPoints(domain, func, numSamples).map(
    p => complex.makeNew({r: p.y})
  )
  $: dftPoints = fft(zeroPaddedPoints).map((n,i) => ({
    x: i/timeSpan,
    y: complex.magnitude(n) / points.length
  })).slice(0, zeroPaddedPoints.length / 2).slice(0, 10*timeSpan + 1)
  $: console.log("zeroPaddedPoints.length",zeroPaddedPoints.length)

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0, SHIFTED)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, domain[0], domain[1])
  $: getReal = (freq: number) => definiteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal)
</script>

<main>
  <h2>Discrete Fourier Transform</h2>
  <p></p>
  <div>
    <timeSpan><b>Time Span: </b>{timeSpan.toFixed(1)} {plural(timeSpan, "second")}</timeSpan>
    <input
      max="10"
      min="1"
      on:input={e => domain[1] = parseFloat(e.target.value)}
      step="0.1"
      type="range"
      value={DOMAIN[1]}
    />
  </div>
  <div>
    <timeSpan><b>Function Frequency: </b>{$funcFreq.toFixed(1)} {plural($funcFreq, "beat")} per second (Hz)</timeSpan>
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

  <div>
    <b>Number of Samples: </b>
    <select bind:value={numSamples}>
      {#each sampleOptions as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </div>
	<Plot discrete={true} points={dftPoints} xTitle="Discrete Fourier Transform"/>
</main>

<style>
</style>
