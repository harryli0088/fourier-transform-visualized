<script lang="ts">
  // import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Icon from 'fa-svelte'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'

  // import DrawProportion from '../Components/DrawProportion.svelte';
  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import PolarFtContainer from './PolarFTContainer.svelte';

  import complex from '../utils/complexNumber';
  import { DOMAIN, GREEN, POLAR_HEIGHT, STEP_SIZE, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import { getCombinedCos } from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';

  // const onMountDrawProportion = 1
  // const drawProportion = tweened(0, {
  //   duration: 5000,
  //   easing: cubicOut
  // })
  // onMount(() => {
  //   drawProportion.set(onMountDrawProportion)
  // })

  const SHIFTED = false
  let frequencies:number[] = [2, 7]
  let newFreq: string = "1"
  function addFreq(e: Event) {
    e.preventDefault()
    frequencies = [...frequencies, parseFloat(newFreq)]
  }
  function editFreq(index: number, value: string) {
    const freq = parseFloat(value) //parse the value
    if(!isNaN(freq)) { //if the value is anumber
      frequencies[index] = freq //edit the frequency
      frequencies = frequencies //rerender
    }
  }
  function deleteFreq(index: number) {
    if(frequencies.length > 1) { //if we will have at least one frequency left
      frequencies.splice(index,1) //splice at the index
      frequencies = frequencies //rerender
    }
  }
  $: fullFrequencies = frequencies.map(f => f * TWO_PI) //multiply by 2pi to get the full frequency to use
  $: combinedFunc = getCombinedCos(fullFrequencies, SHIFTED)
  
  $: points = getPoints(DOMAIN, combinedFunc, STEP_SIZE)

  const INITIAL_WINDING_FREQ = 3
	const windingFreq = tweened(INITIAL_WINDING_FREQ, {
    duration: 500,
    easing: cubicOut
  })

  $: cosineFourierTransforms = fullFrequencies.map(f => getCosineFourierTransform(f, 0, SHIFTED))
  $: definiteIntegralFunctions = cosineFourierTransforms.map(t => getDefiniteIntegralFunction(t, DOMAIN[0], DOMAIN[1]))
  $: combinedDefiniteIntegralFunction = (freq: number) => definiteIntegralFunctions.reduce((sum, func) => complex.add(sum,func(freq)), complex.makeNew({}))
  $: getReal = (freq: number) => combinedDefiniteIntegralFunction(freq).r
  $: ftPoints = getPoints([0, 10], getReal, STEP_SIZE)
</script>

<main>
  <h2>Add Multiple Cosines Together</h2>

  <p>In this playground, you can add multiple cosine functions together with different frequencies. </p>
  <form on:submit={addFreq}>
    <span>Add another cosine function of </span>
    <input 
      bind:value={newFreq}
      max={1000}
      min={1}
      type="number"
    />
    <span>
      {plural(parseInt(newFreq), "beat")} per second (Hz)
    </span>
    <button type="submit">Add</button>
  </form>

  <div>
    <ul>
      {#each frequencies as f, i}
        <li>
          <span>Cosine of </span>
          <input
            max={1000}
            min={1}
            on:change={e => editFreq(i, e.target.value)}
            type="number"
            value={f}
          />
          <span>Hz</span>
          &nbsp;&nbsp;&nbsp;
          {#if frequencies.length > 1}
            <span class="icon-button" on:click={e => deleteFreq(i)}><Icon icon={faTimes}/></span>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <!-- <DrawProportion {drawProportion} initialValue={onMountDrawProportion}/> -->
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
    >
  </div>

  <PolarFtContainer>
    <span slot="polar">
      <Polar
        definiteIntegralFunction={combinedDefiniteIntegralFunction}
        domain={DOMAIN}
        freq={$windingFreq}
        height={POLAR_HEIGHT}
        maxMagnitude={frequencies.length}
        {points}
      />
    </span>
    <span slot="ft">
      <Plot drawProportion={$windingFreq/WINDING_FREQ_MAX} points={ftPoints} stroke={GREEN} windingFreq={Infinity} xTitle="Frequency (Hz)"/>
    </span>
  </PolarFtContainer>
</main>

<style>
</style>