<script lang="ts">
  import { afterUpdate } from 'svelte'

  import Plot from "../Components/Plot.svelte";

  import { DOMAIN, GREEN, RED } from '../utils/constants';
  import { zeroPad } from '../utils/fft';
  import getDftData from '../utils/getDftData';
  import plural from '../utils/plural';

  //DPR is important for improving the picture quality of the canvas, especially for text
  //based off this fiddle http://jsfiddle.net/65maD/83/ from this stack answer https://stackoverflow.com/a/54027313
  const DPR = window.devicePixelRatio
  let canvas
  const CANVAS_MARGIN = {b:13,l:32,r:7,t:10}

  const sampleOptions = [64, 128, 256, 512, 1024]
  let numSamples = 64
  $: numSamplesText = `${numSamples} ${plural(numSamples, "sample")}`

  const height = 200
  const halfHeight = height / 2
  let width = 500
  $: canvasHeight = height - CANVAS_MARGIN.b - CANVAS_MARGIN.t
  $: canvasWidth = width - CANVAS_MARGIN.l - CANVAS_MARGIN.r
  $: cellWidth = canvasWidth / numSamples
  $: halfCellWidth = cellWidth / 2

  let domain: [number, number] = [DOMAIN[0], DOMAIN[1]]
  $: timeSpan = domain[1] - domain[0]
  $: timeSpanText = `${timeSpan.toFixed(1)} ${plural(timeSpan, "second")}`

  let canvasYValues: number[] = []
  function reset() {
    canvasYValues = []
  }
  $: reset() && numSamples //trigger a reset when the number of samples changes
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

      ctx.fillStyle = RED
      canvasYValues.forEach((v,i) => {
        const x = i * cellWidth
        ctx.beginPath()
        ctx.arc(x + halfCellWidth, v + halfCellWidth, 2, 0, 2 * Math.PI)
        ctx.fill()
      })
  	}
  })
</script>

<main>
  <div><button on:click={reset}>Clear</button></div>
  
  <div bind:clientWidth={width} style="position:relative;">
    <div style={`
      background:#444;
      position:absolute;
      bottom:${CANVAS_MARGIN.b}px;
      left:${CANVAS_MARGIN.l}px;
      right:${CANVAS_MARGIN.r}px;
      top:${CANVAS_MARGIN.t}px;
    `}/>

    <Plot domain={[0,3]} {height} range={[-1,1]}/>

    <canvas
      bind:this={canvas}
      height={canvasHeight}
      on:mousemove={onMouseMove}
      on:touchmove={onTouchMove}
      style={`
        background-color:pink;
        position:absolute;
        left:${CANVAS_MARGIN.l}px;
        top:${CANVAS_MARGIN.t}px;
      `}
      width={canvasWidth}
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

	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>
</main>

<style>
</style>
