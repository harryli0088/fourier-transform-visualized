<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";

  import complex from '../utils/complexNumber';
  import { DOMAIN, GREEN, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import fft from '../utils/fft';
  import getCos from '../utils/getCos';
  import getDftData from '../utils/getDftData';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';

  let domain: [number, number] = [DOMAIN[0], DOMAIN[1]]
  $: timeSpan = domain[1] - domain[0]
  $: timeSpanText = `${timeSpan.toFixed(1)} ${plural(timeSpan, "second")}`

  const sampleOptions = [64, 128, 256, 512, 1024]
  let numSamples = 64
  $: numSamplesText = `${numSamples} ${plural(numSamples, "sample")}`

  $: points = getPoints(domain, func, numSamples)

  /* Discrete Fourier Transform */
  $: ({
    sampleRate,
    sampleRateText,
    slicedDftPoints,
  } = getDftData(points, timeSpan))
</script>

<main>
  <div>
    <b>Sample Rate: </b> {numSamplesText} / {timeSpanText} = {sampleRateText}
  </div>
  
  <Plot discrete discreteCircleR={2} {points} xTitle="Time in seconds"/>
  <!-- <Plot points={ftPoints} xTitle="Fourier Transform" stroke={GREEN}/> -->


	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>
</main>

<style>
</style>
