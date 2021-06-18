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
  import { getDefiniteIntegralFunction } from './utils/definiteIntegral';

  const domain: [number, number] = [0, 2*Math.PI]

  const onMountDrawProportion = 1
  const drawProportion = tweened(0, {
    duration: 5000,
    easing: cubicOut
  })
  onMount(() => {
    drawProportion.set(onMountDrawProportion)
  })

  const initualFuncFreq = 2.5
  const funcFreq = tweened(initualFuncFreq, {
    duration: 500,
    easing: cubicOut
  })
  $: func = getCos($funcFreq)
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

  const initialWindingFreq = 1
	const windingFreq = tweened(initialWindingFreq, {
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

  $: cosineFourierTransform = getCosineFourierTransform($funcFreq, 0)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, domain[0], domain[1])
  $: getMagnitude = (theta: number) => definiteIntegralFunction(theta).r
  $: ftPoints = getPoints([0, 10], getMagnitude, stepSize)
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
      max="10"
      min="0.05"
      on:input={e => funcFreq.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={initualFuncFreq}
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
      value={initialWindingFreq}
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