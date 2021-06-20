<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Icon from 'fa-svelte'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'

  import Plot from "../Components/Plot.svelte";
  import Polar from "../Components/Polar.svelte";
  import DrawProportion from '../Components/DrawProportion.svelte';
  import complex from '../utils/complexNumber';
  import { getCombinedCos } from '../utils/getCos';
  import getCosineFourierTransform from '../utils/getCosineFourierTransform';
  import getDefiniteIntegralFunction from '../utils/getDefiniteIntegralFunction';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';
  import { STEP_SIZE, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';

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
  let frequencies:number[] = [INITIAL_FUNC_FREQ, 7]
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
  $: combinedFunc = getCombinedCos(fullFrequencies)
  
  $: points = getPoints(domain, combinedFunc, STEP_SIZE)

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
  <form on:submit={addFreq}>
    <input 
      bind:value={newFreq}
      max={1000}
      min={1}
      type="number"
    />
    <button type="submit">Add</button>
  </form>

  <div>
    {#each frequencies as f, i}
      <div>
        <input
          max={1000}
          min={1}
          on:change={e => editFreq(i, e.target.value)}
          type="number"
          value={f}
        />
        {#if frequencies.length > 1}
          <span class="icon-button" on:click={e => deleteFreq(i)}><Icon icon={faTimes}/></span>
        {/if}
      </div>
    {/each}
  </div>

  <DrawProportion {drawProportion} initialValue={onMountDrawProportion}/>
	<Plot drawProportion={$drawProportion} {points} windingFreq={$windingFreq} xTitle="Time in seconds"/>

  <div>
    <span><b>Winding Frequency: </b> {$windingFreq} {plural($windingFreq, "cycle")} per second</span>
    <input
      max={WINDING_FREQ_MAX}
      min="0"
      on:input={e => windingFreq.set(parseFloat(e.target.value))}
      step="0.01"
      type="range"
      value={INITIAL_WINDING_FREQ}
    >
  </div>
  <Polar
    definiteIntegralFunction={combinedDefiniteIntegralFunction}
    {domain}
    drawProportion={$drawProportion}
    freq={$windingFreq}
    maxMagnitude={frequencies.length}
    {points}
  />

	<Plot drawProportion={$drawProportion} points={ftPoints} windingFreq={Infinity} xTitle="Frequency (Hz)"/>
</main>

<style>
</style>