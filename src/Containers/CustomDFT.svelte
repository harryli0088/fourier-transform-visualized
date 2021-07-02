<script lang="ts">
  import { afterUpdate } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  import Plot from "../Components/Plot.svelte";

  import complex from '../utils/complexNumber';
  import { DOMAIN, GREEN, TWO_PI, WINDING_FREQ_MAX } from '../utils/constants';
  import fft, { zeroPad } from '../utils/fft';
  import getCos from '../utils/getCos';
  import getDftData from '../utils/getDftData';
  import getPoints from '../utils/getPoints';
  import plural from '../utils/plural';

  //DPR is important for improving the picture quality of the canvas, especially for text
  //based off this fiddle http://jsfiddle.net/65maD/83/ from this stack answer https://stackoverflow.com/a/54027313
  const DPR = window.devicePixelRatio
  let canvas

  const sampleOptions = [64, 128, 256, 512, 1024]
  let numSamples = 64
  $: numSamplesText = `${numSamples} ${plural(numSamples, "sample")}`

  let width = 500
  $: cellWidth = width / numSamples
  $: numCellsHigh = Math.ceil(200 / cellWidth) //how many cells high the canvas is
  $: height = numCellsHigh * cellWidth
  $: halfHeight = height / 2

  let domain: [number, number] = [DOMAIN[0], DOMAIN[1]]
  $: timeSpan = domain[1] - domain[0]
  $: timeSpanText = `${timeSpan.toFixed(1)} ${plural(timeSpan, "second")}`

  let canvasYValues: number[] = []
  function reset() {
    canvasYValues = []
  }
  function onMouseMove(e) {
    handleMove(e.clientX, e.clientY)
  }
  function onTouchMove(e) {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
  function handleMove(clientX:number, clientY:number) {
    //get the coordinates of the event relative to the canvas
    const dimensions = canvas.getBoundingClientRect()
    const canvasX = clientX - dimensions.left
    const canvasY = clientY - dimensions.top

    const cellX = Math.floor(canvasX / cellWidth)
    console.log("cellX", cellX, canvasYValues.length)
    if(cellX >= canvasYValues.length) {
      const lastYValue = canvasYValues[canvasYValues.length-1]
      const lastCanvasY = lastYValue===undefined ? halfHeight : lastYValue
      const canvasYDiff = canvasY - lastCanvasY
      const cellXDiff = cellX - canvasYValues.length
      const newValues:number[] = []
      for(let i=0; i<cellXDiff; ++i) { //interpolate the skipped cells
        newValues.push(lastCanvasY + i*canvasYDiff/cellXDiff)
      }
      newValues.push(canvasY)
      canvasYValues = canvasYValues.concat(newValues)
    }
  }
  
  //convert pixel positions to points
  $: yValues = canvasYValues.map(v => (halfHeight - v) / halfHeight)
  $: zeroPaddedValues = zeroPad(yValues, numSamples)

  /* Discrete Fourier Transform */
  $: ({
    sampleRate,
    sampleRateText,
    slicedDftPoints,
  } = getDftData(zeroPaddedValues, timeSpan))


  /* Draw on Canvas */
  afterUpdate(() => {
    const ctx = canvas.getContext('2d')
  	const requestId = requestAnimationFrame(draw)

    function draw() {
      ctx.clearRect(0,0,width,height)

      ctx.fillStyle = "blue"
      canvasYValues.forEach((v,i) => {
        const x = i * cellWidth
        ctx.fillRect(x,v,cellWidth,cellWidth)
      })
  	}
  })
</script>

<main bind:clientWidth={width}>
  <div><button on:click={reset}>Clear</button></div>
  
  <canvas
    bind:this={canvas}
    {height}
    on:mousemove={onMouseMove}
    on:touchmove={onTouchMove}
    style="background:pink"
    {width}
  />

  <div>
    <b>Number of Samples: </b>
    <select bind:value={numSamples} on:change={reset}>
      {#each sampleOptions as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </div>

  <div>
    <b>Sample Rate: </b> {numSamplesText} / {timeSpanText} = {sampleRateText}
  </div>

	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>
</main>

<style>
</style>
