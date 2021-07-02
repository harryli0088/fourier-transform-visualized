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

  const SHIFTED = false
  const INITIAL_FUNC_FREQ = 2
  const funcFreq = tweened(INITIAL_FUNC_FREQ, { //this is the partial frequency for 2pi omitted for simplicity
    duration: 500,
    easing: cubicOut
  })
  $: fullFuncFreq = TWO_PI * $funcFreq //multiply by 2pi to get the full frequency to use
  $: func = getCos(fullFuncFreq, 0, SHIFTED)
  $: points = getPoints(domain, func, numSamples)

  /* Discrete Fourier Transform */
  $: ({
    sampleRate,
    sampleRateText,
    slicedDftPoints,
  } = getDftData(points, timeSpan))
</script>

<main>
  <h2>Discrete Fourier Transform</h2>
  <p>Fourier Transforms on continuous functions work great when we know exactly how the signals behave (so far our signals have all been simple cosines). Often though, the real world is not so simple or predictable, so we want to sample an incoming signal. Once we start taking discrete samples, we need to use the <b>Discrete Fourier Transform</b>. The DFT is similar to the regular Fourier Transform, but is instead used on discretely sampled signals. In this playground, you can play with a basic example of the DFT.</p>
  <div>
    <timeSpan><b>Signal Frequency: </b>{$funcFreq.toFixed(1)} {plural($funcFreq, "beat")} per second (Hz)</timeSpan>
    <input
      max={WINDING_FREQ_MAX}
      min="0.05"
      on:input={e => funcFreq.set(parseFloat(e.target.value))}
      step="0.05"
      type="range"
      value={INITIAL_FUNC_FREQ}
    />
  </div>
  <div>
    <timeSpan><b>Time Span: </b>{timeSpanText}</timeSpan>
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
    <b>Number of Samples: </b>
    <select bind:value={numSamples}>
      {#each sampleOptions as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </div>
  <div>
    <b>Sample Rate: </b> {numSamplesText} / {timeSpanText} = {sampleRateText}
  </div>
  
  <Plot discrete discreteCircleR={2} {points} xTitle="Time in seconds"/>
  <!-- <Plot points={ftPoints} xTitle="Fourier Transform" stroke={GREEN}/> -->


	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>

  <div>
    <p>In this scenario, we take {numSamplesText} over a time span of {timeSpanText}, which gives us a sample rate of {sampleRateText}. Notice that:</p>
    <ul>
      <li>The "density" of the DFT depends directly on how long we sample the signal. Right now because the time span of the signal is {timeSpanText}, in our DFT we get {timeSpan.toFixed(1)} {plural(timeSpan, "sample")} per frequency.</li>
      <li>The magnitude (or "confidence") of our the DFT depends on our sample rate. The higher our sample rate, the more confident we are in the signal frequency</li>
    </ul>
    <p>While we only show up to frequency 10, the DFT can actually calculate up to a frequency that is half of our sampling rate, currently {sampleRate.toFixed(1)} Hz / 2 = {(sampleRate/2).toFixed(1)} Hz. This is due to a phenomenon called "aliasing" (add link later).</p>
  </div>
</main>

<style>
</style>
