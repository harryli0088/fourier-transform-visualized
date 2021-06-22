<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";

  import Arrow from "../Components/Arrow.svelte";
  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";

  import getCos from '../utils/getCos';
  import getCosineFourierTransform from "../utils/getCosineFourierTransform";
  import getPoints from '../utils/getPoints';
  import { POLAR_HEIGHT, STEP_SIZE, TWO_PI } from '../utils/constants';
  import getDefiniteIntegralFunction from "../utils/getDefiniteIntegralFunction";

  const domain: [number, number] = [0, Math.PI]
  const freq = 3
  const fullFuncFreq = TWO_PI * freq //multiply by 2pi to get the full frequency to use
  const func = getCos(fullFuncFreq)
  const points = getPoints(domain, func, STEP_SIZE)

  const rotate = tweened(0, {
    duration: 2000,
    easing: cubicOut
  })
  onMount(() => {
    setInterval(() => {
      rotate.set(0, {duration: 0})
      rotate.set(1)
    }, 2000)
  })

  $: cosineFourierTransform = getCosineFourierTransform(fullFuncFreq, 0)
  $: definiteIntegralFunction = getDefiniteIntegralFunction(cosineFourierTransform, domain[0], domain[1])
</script>

<main>
  <h3>Cosine Introduction</h3>
  <p>Let's take a look at this cosine function that has a frequency of {freq} cycles per second. You can see that this function moves down and up {freq} times in one second.</p>
	<Plot {points} xTitle="Time in seconds"/>

  <p>Next let's look at this winding function that spins at a frequency of 2 cycles per second</p>
  <svg width={210} height={210}>
    <g transform="translate(5,5)">
      <line x1={0} y1={0} x2={200} y2={0}/>
      <line x1={0} y1={100} x2={200} y2={100}/>
      <line x1={0} y1={200} x2={200} y2={200}/>

      <line x1={0} y1={0} x2={0} y2={200}/>
      <line x1={100} y1={0} x2={100} y2={200}/>
      <line x1={200} y1={0} x2={200} y2={200}/>
    </g>

    <g class="rotate">
      <Arrow x1={0} y1={0} x2={100} y2={0}/>
      <circle cx={100} cy={0} r={5}/>
    </g>
  </svg>

  <p>What happens when we multiply the values of the cosine function by the winding function?</p>

  <Polar {definiteIntegralFunction} drawProportion={$rotate} {domain} freq={0.5} height={POLAR_HEIGHT} maxMagnitude={1} {points}/>
</main>

<style>
  g.rotate {
    animation-iteration-count: infinite;
    animation-name: rotate;
    animation-duration: 2s;
    animation-timing-function: linear;
  }

  line {
    stroke: gray;
    stroke-width: 2px;
  }

  @keyframes rotate {
    from {
      transform: translate(105px, 105px) rotate(0deg);
    }
    to {
      transform: translate(105px, 105px) rotate(360deg);
    }
  }
</style>