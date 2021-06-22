<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import PolarFtContainer from './PolarFTContainer.svelte';

  import { DOMAIN, GREEN, POLAR_HEIGHT, STEP_SIZE, TWO_PI } from '../utils/constants';
  import getCos from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';

  const funcFreq = 2
  const fullFuncFreq = TWO_PI * funcFreq //multiply by 2pi to get the full frequency to use
  const func = getCos(fullFuncFreq)
  const points = getPoints(DOMAIN, func, STEP_SIZE)

  const INITIAL_WINDING_FREQ = 0
  const WINDING_FREQ_MAX = 3
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })
  function play() {
    windingFreq.set(0, {duration: 0})
    windingFreq.set(WINDING_FREQ_MAX, {duration: 20000})
  }


  const cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0)
  const definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, DOMAIN[0], DOMAIN[1])
  const getReal = (freq: number) => definiteIntegralFunction(freq).r
  const ftPoints = getPoints([0, WINDING_FREQ_MAX], getReal, STEP_SIZE)
</script>

<main>
  <h2>Center of Mass</h2>

  <p>Now imagine that the purple polar plot is a wound up piece of wire with some mass. We can mark the center of mass of this wire as the green dot. Next, we can plot the x coordinate of this center of mass. Finally, watch what happens to the center of mass as we change the winding frequency.</p>

	<Plot {points} windingFreq={$windingFreq} xTitle="Time in seconds"/>

  
  <div><button on:click={play}>Play</button></div>
  <div><b>Winding Frequency: </b> {$windingFreq.toFixed(1)} {plural($windingFreq, "cycle")} per second (Hz)</div>
  

  <PolarFtContainer>
    <span slot="polar">
      <Polar {definiteIntegralFunction} domain={DOMAIN} freq={$windingFreq} height={POLAR_HEIGHT} maxMagnitude={1} {points}/>
    </span>
    <span slot="ft">
      <Plot drawProportion={$windingFreq/WINDING_FREQ_MAX} points={ftPoints} stroke={GREEN} windingFreq={Infinity} xTitle="Winding Frequency (Hz)"/>
    </span>
  </PolarFtContainer>

  <p>This green line is the Fourier Transform! In these examples, there will be spikes around 0 because all the cosine functions are shifted up to be positive. (You could shift the cosine functions back down to be between -1 and 1, but negative values can be tricky to think about). Notice that when our winding frequency is 2Hz, the wire lines up nicely, so that we get a small spike of mass.</p>
</main>

<style>
</style>