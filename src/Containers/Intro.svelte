<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";

  import Icon from 'fa-svelte'
  import { faFastBackward, faFastForward, faPlay } from '@fortawesome/free-solid-svg-icons'

  import Arrow from "../Components/Arrow.svelte";
  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";

  import { BLUE, DOMAIN, POLAR_HEIGHT, PURPLE, RED, STEP_SIZE, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import getCos from '../utils/getCos';
  import getCosineFourierTransform from "../utils/getCosineFourierTransform";
  import getPoints from '../utils/getPoints';
  import getDefiniteIntegralFunction from "../utils/getDefiniteIntegralFunction";
  import plural from "../utils/plural";

  const freq = 2
  const fullFuncFreq = TWO_PI * freq //multiply by 2pi to get the full frequency to use
  const func = getCos(fullFuncFreq)
  const points = getPoints(DOMAIN, func, STEP_SIZE)

  let speedFactor: number = 1/4
  const speedFactorMax = 4
  const speedFactorMin = 1/16
  const totalSeconds = (DOMAIN[1] - DOMAIN[0])
  const drawProportion = tweened(0, { easing: linear })

  let interval = null
  
  function resetAnimation(totalSeconds: number) {
    const totalMilliseconds = totalSeconds * 1000
    clearInterval(interval)
    function resetDrawProportion() {
      drawProportion.set(0, {duration: 0})
      drawProportion.set(1, {duration: totalMilliseconds})
    }
    resetDrawProportion()
    interval = setInterval(resetDrawProportion, totalMilliseconds)
  }

  $: resetAnimation(totalSeconds/speedFactor)

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, DOMAIN[0], DOMAIN[1])

  const INITIAL_WINDING_FREQ = 1
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })
  $: windingProportion = 360 * $drawProportion * totalSeconds * $windingFreq
</script>

<main>
  <h2>Cosine Introduction</h2>

  <div>
    <div class="label"><b>Speed: </b> {speedFactor>=1 ? speedFactor : `1/${1/speedFactor}`}x</div>
    <div>
      <button on:click={() => speedFactor = Math.max(speedFactorMin, speedFactor/2)} disabled={Math.round(1/speedFactor)>=Math.round(1/speedFactorMin)}><Icon icon={faFastBackward}/> Slow Down</button>
      <button on:click={() => speedFactor = 1}>Play Normal <Icon icon={faPlay}/></button>
      <button on:click={() => speedFactor = Math.min(speedFactorMax, speedFactor*2)} disabled={Math.round(speedFactor)>=speedFactorMax}>Speed Up <Icon icon={faFastForward}/></button>
    </div>
  </div>

  <p>Let's take a look at this cosine function that has a frequency of {freq} {plural(freq, "cycle")} per second. You can see that this function moves down and up {freq} {plural(freq, "time")} in one second.</p>
	<Plot drawProportion={$drawProportion} {points} stroke={RED} windingFreq={$windingFreq} xTitle="Time in seconds"/>
  

  <p>Next let's look at this winding function that spins at a frequency of {$windingFreq.toFixed(1)} {plural($windingFreq, "cycle")} per second, ie it takes <span style={`border: 2px dashed ${BLUE};padding:0.3em;`}>{(1/$windingFreq).toFixed(1)} {plural($windingFreq, "second")}</span> to make one full cycle. You can adjust the slider to change the winding frequency.</p>
  
  <div>
    <span><b>Winding Frequency: </b> {$windingFreq.toFixed(1)} {plural($windingFreq, "cycle")} per second (Hz)</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0"
      on:input={e => windingFreq.set(parseFloat(e.target.value))}
      step="0.01"
      type="range"
      value={INITIAL_WINDING_FREQ}
    />
  </div>

  <div style="text-align: center;">
    <svg width={210} height={210}>
      <g transform="translate(5,5)">
        <line x1={0} y1={0} x2={200} y2={0}/>
        <line x1={0} y1={100} x2={200} y2={100}/>
        <line x1={0} y1={200} x2={200} y2={200}/>
  
        <line x1={0} y1={0} x2={0} y2={200}/>
        <line x1={100} y1={0} x2={100} y2={200}/>
        <line x1={200} y1={0} x2={200} y2={200}/>
      </g>
  
      <g style={`transform:translate(105px, 105px) rotate(${windingProportion}deg);`}>
        <Arrow x1={0} y1={0} x2={100} y2={0}/>
        <circle cx={100} cy={0} r={5} fill={BLUE}/>
      </g>
    </svg>
  </div>

  <p>What happens when we multiply the values of the cosine function by the winding function?</p>

  <div style="display: flex; justify-content: center">
    <div style="width: 200px">
      <Polar
        {definiteIntegralFunction}
        drawProportion={$drawProportion}
        domain={DOMAIN}
        freq={$windingFreq}
        height={POLAR_HEIGHT}
        maxMagnitude={1}
        {points}
        showCOM={false}
        stroke={PURPLE}
      />
    </div>
  </div>

  <p>The red cosine function oscillates between 0 and 1. At the same time, the blue winding function winds around in a circular pattern. When we "multiply" these two functions together, we get a winding purple function that </p>
  <ul>
    <li>Grows outward when the red cosine moves up</li>
    <li>Shrinks inwards when the red cosine moves down</li>
  </ul>
  <p>Try changing the winding frequency and see how the purple resulting function changes. The results can be quite pretty!</p>
</main>

<style>
  line {
    stroke: gray;
    stroke-width: 2px;
  }
</style>