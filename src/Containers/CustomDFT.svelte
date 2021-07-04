<script lang="ts">
  import { afterUpdate } from 'svelte'

  import PickNumSamples from '../Components/PickNumSamples.svelte';
  import Plot from "../Components/Plot.svelte";

  import { GREEN, RED } from '../utils/constants';
  import { zeroPad } from '../utils/fft';
  import getDftData from '../utils/getDftData';
  import plural from '../utils/plural';

  //DPR is important for improving the picture quality of the canvas, especially for text
  //based off this fiddle http://jsfiddle.net/65maD/83/ from this stack answer https://stackoverflow.com/a/54027313
  const DPR = window.devicePixelRatio
  let canvas
  const CANVAS_MARGIN = {b:40,l:32,r:10,t:6}

  let numSamples = 64
  $: numSamplesText = `${numSamples} ${plural(numSamples, "sample")}`

  const height = 200
  const halfHeight = height / 2
  let width = 500
  $: canvasHeight = height - CANVAS_MARGIN.b - CANVAS_MARGIN.t
  $: canvasWidth = width - CANVAS_MARGIN.l - CANVAS_MARGIN.r
  $: cellWidth = canvasWidth / numSamples
  $: halfCellWidth = cellWidth / 2

  $: console.log("WIDTH", width, (width - 400)/200 + 1)
  let domain: [number, number] = [0, 1]
  $: domain = [domain[0], Math.round(Math.min(3, Math.max(1, (width - 400)/200 + 1)))]
  $: timeSpan = domain[1] - domain[0]
  $: timeSpanText = `${timeSpan.toFixed(1)} ${plural(timeSpan, "second")}`

  let canvasYValues: number[] = []
  function reset() {
    canvasYValues = []
    return true
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
  <PickNumSamples bind:numSamples={numSamples}/>
  <div>
    <b>Sample Rate: </b> {numSamplesText} / {timeSpanText} = {sampleRateText}
  </div>
  <br/>
  <div><button on:click={reset}>Clear</button></div>
  
  <div bind:clientWidth={width} style="position:relative;">
    <div style={`
      background:#444;
      position:absolute;
      bottom:${CANVAS_MARGIN.b}px;
      height:${canvasHeight}px;
      left:${CANVAS_MARGIN.l}px;
      width:${canvasWidth}px;
    `}/>

    <Plot {domain} {height} range={[-1,1]} xTitle="Time in seconds"/>

    <canvas
      bind:this={canvas}
      height={canvasHeight}
      on:mousemove={onMouseMove}
      on:touchmove={onTouchMove}
      style={`
        position:absolute;
        left:${CANVAS_MARGIN.l}px;
        top:${CANVAS_MARGIN.t}px;
      `}
      width={canvasWidth}
    />
  </div>

	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>
</main>

<style>
</style>
