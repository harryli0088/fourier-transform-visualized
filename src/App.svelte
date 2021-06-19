<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "./Components/Plot.svelte";
  import Polar from "./Components/Polar.svelte";
  import complex from './utils/complexNumber';
  import getCos from './utils/getCos';
  import type { MathFunc, PointType } from './utils/types';
  // import fft, { zeroPad } from './utils/fft';
  import getCosineFourierTransform from './utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from './utils/getDefiniteIntegralFunction';
import { TWO_PI } from './utils/constants';

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
  const stepSize: number = 0.001
  function getPoints(
    domain: [number, number],
    func: MathFunc,
    stepSize: number,
  ):PointType[] {
    const points: PointType[] = []
    for(let i=domain[0]; i<domain[1]; i+=stepSize) {
      points.push({x: i, y: func(i)})
    }
    points.push({x: domain[1], y: func(domain[1])})

    return points
  }
  $: points = getPoints(domain, func, stepSize)

  const INITIAL_WINDING_FREQ = 1
  const WINDING_FREQ_MAX = 10
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
  $: ftPoints = getPoints([0, 10], getReal, stepSize)
</script>

<main>
  <div>
    <span><b>Draw Proportion: </b>{$drawProportion}</span>
    <input
      max="1"
      min="0"
      on:input={e => drawProportion.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={onMountDrawProportion}
    >
  </div>
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
      max="10"
      min="0"
      on:input={e => windingFreq.set(parseFloat(e.target.value))}
      step="0.01"
      type="range"
      value={INITIAL_WINDING_FREQ}
    >
  </div>
  <Polar drawProportion={$drawProportion} freq={$windingFreq} {points}/>

	<Plot drawProportion={$drawProportion} points={ftPoints} windingFreq={Infinity}/>
</main>

<style>
  input[type=range] {
    width: 100%;
  }
</style>