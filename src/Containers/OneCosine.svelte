<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import PolarFtContainer from './PolarFTContainer.svelte';

  import { DOMAIN, GREEN, POLAR_HEIGHT, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
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

  const INITIAL_WINDING_FREQ = 3
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0, SHIFTED)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, DOMAIN[0], DOMAIN[1])
  $: getReal = (freq: number) => definiteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal)
</script>

<main>
  <h2>One Cosine Playground</h2>
  <p>In this playground, you can change the frequency of one cosine signal and the frequency of our winding function, and see how the Fourier Transform changes.</p>
  <!-- <DrawProportion {drawProportion} initialValue={onMountDrawProportion}/> -->
  <div>
    <span><b>Signal Frequency: </b>{$funcFreq.toFixed(1)} {plural($funcFreq, "beat")} per second (Hz)</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0.05"
      on:input={e => funcFreq.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={INITIAL_FUNC_FREQ}
    />
  </div>
	<Plot {points} windingFreq={$windingFreq} xTitle="Time in seconds"/>

  <div>
    <span><b>Winding Frequency: </b> {$windingFreq.toFixed(1)} {plural($windingFreq, "cycle")} per second (Hz)</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0"
      on:input={e => windingFreq.set(parseFloat(e.target.value))}
      step="0.1"
      type="range"
      value={INITIAL_WINDING_FREQ}
    />
  </div>

  <PolarFtContainer>
    <span slot="polar">
      <Polar {definiteIntegralFunction} domain={DOMAIN} freq={$windingFreq} height={POLAR_HEIGHT} maxMagnitude={1} {points}/>
    </span>
    <span slot="ft">
      <Plot drawProportion={$windingFreq/WINDING_FREQ_MAX} points={ftPoints} stroke={GREEN} windingFreq={Infinity} xTitle="Winding Frequency (Hz)"/>
    </span>
  </PolarFtContainer>
</main>

<style>
</style>