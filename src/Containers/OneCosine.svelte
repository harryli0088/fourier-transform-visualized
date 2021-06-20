<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import DrawProportion from '../Components/DrawProportion.svelte';
  // import complex from './utils/complexNumber';
  // import fft, { zeroPad } from './utils/fft';
  import getCos from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import getPoints from '../utils/getPoints';
  // import type { MathFunc, PointType } from '../utils/types';
  import { STEP_SIZE, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';

  const domain: [number, number] = [0, Math.PI]

  const onMountDrawProportion = 1
  const drawProportion = tweened(0, {
    duration: 5000,
    easing: cubicOut
  })
  onMount(() => {
    drawProportion.set(onMountDrawProportion)
  })

  const INITIAL_FUNC_FREQ = 2.5
  const funcFreq = tweened(INITIAL_FUNC_FREQ, { //this is the partial frequency for 2pi omitted for simplicity
    duration: 500,
    easing: cubicOut
  })
  $: fullFuncFreq = TWO_PI * $funcFreq //multiply by 2pi to get the full frequency to use
  $: func = getCos(fullFuncFreq)
  $: points = getPoints(domain, func, STEP_SIZE)

  const INITIAL_WINDING_FREQ = 1
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })

  // $: zeroPaddedPoints = zeroPad(
  //   points.map(
  //     p => complex.makeNew({r: p.y})
  //   )
  // )
  // $: dftPoints = fft(zeroPaddedPoints).map((n,i) => ({
  //   x: i,
  //   y: complex.magnitude(n) / points.length
  // })).slice(0, zeroPaddedPoints.length / 2).slice(0, 100)
  // $: console.log("dftPoints",dftPoints)

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, domain[0], domain[1])
  $: getReal = (freq: number) => definiteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal, STEP_SIZE)
</script>

<main>
  <DrawProportion {drawProportion} initialValue={onMountDrawProportion}/>
  <div>
    <span><b>Function Frequency: </b>{$funcFreq}</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0.05"
      on:input={e => funcFreq.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={INITIAL_FUNC_FREQ}
    >
  </div>
	<Plot drawProportion={$drawProportion} {points} windingFreq={$windingFreq}/>

  <div>
    <span><b>Winding Frequency: </b> {$windingFreq}</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0"
      on:input={e => windingFreq.set(parseFloat(e.target.value))}
      step="0.01"
      type="range"
      value={INITIAL_WINDING_FREQ}
    >
  </div>
  <Polar {definiteIntegralFunction} {domain} drawProportion={$drawProportion} freq={$windingFreq} maxMagnitude={1} {points}/>

	<Plot drawProportion={$drawProportion} points={ftPoints} windingFreq={Infinity} xTitle="Frequency (Hz)"/>
</main>

<style>
</style>