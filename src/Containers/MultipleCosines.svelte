<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import getCos from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import { STEP_SIZE, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import getPoints from '../utils/getPoints';
import complex from '../utils/complexNumber';

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
  const frequencies:number[] = [INITIAL_FUNC_FREQ, 7]
  $: fullFrequencies = frequencies.map(f => f * TWO_PI) //multiply by 2pi to get the full frequency to use
  $: funcs = fullFrequencies.map(getCos)
  $: func = (t: number) => funcs.reduce((sum,func) => sum + func(t), 0)
  
  $: points = getPoints(domain, func, STEP_SIZE)

  const INITIAL_WINDING_FREQ = 1
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })

  $: cosineFourierTransforms = fullFrequencies.map(f => getCosineFourierTransform(f, 0))
  $: definiteIntegralFunctions = cosineFourierTransforms.map(t => getDefiniteIntegralFunction(t, domain[0], domain[1]))
  $: combinedDefiniteIntegralFunction = (freq: number) => definiteIntegralFunctions.reduce((sum, func) => complex.add(sum,func(freq)), complex.makeNew({}))
  $: getReal = (freq: number) => combinedDefiniteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal, STEP_SIZE)
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
  <Polar definiteIntegralFunction={combinedDefiniteIntegralFunction} {domain} drawProportion={$drawProportion} freq={$windingFreq} {points}/>

	<Plot drawProportion={$drawProportion} points={ftPoints} windingFreq={Infinity}/>
</main>

<style>
  input[type=range] {
    width: 100%;
  }
</style>