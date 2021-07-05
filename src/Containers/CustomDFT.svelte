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
  const CANVAS_MARGIN = {b:40,l:32,r:10,t:9}

  let numSamples = 64
  $: numSamplesText = `${numSamples} ${plural(numSamples, "sample")}`

  const height = 200
  let width = 500
  $: canvasHeight = height - CANVAS_MARGIN.b - CANVAS_MARGIN.t
  $: halfCanvasHeight = canvasHeight / 2
  $: canvasWidth = width - CANVAS_MARGIN.l - CANVAS_MARGIN.r
  $: sampleWidth = canvasWidth / numSamples
  $: halfSampleWidth = sampleWidth / 2

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

    const sampleX = Math.floor(canvasX / sampleWidth) //get the sample number
    if( //if we should add more samples
      sampleX >= canvasYValues.length //if we have not sampled this far yet (ie the event is further to the right than the last sample)
      && sampleX < numSamples //if the sample is within bounds of the canvas (on mobile, this even triggers past the canvas width because of touch/drag peculiarities)
    ) {
      const lastYValue = canvasYValues[canvasYValues.length-1] //get the last sample value
      const lastCanvasY = lastYValue===undefined ? halfCanvasHeight : lastYValue //in case we have no samples yet, use the vertical midpoint of the canvas
      const canvasYDiff = canvasY - lastCanvasY //get the canvas pixel distance between the event and the last sample
      const sampleXDiff = sampleX - canvasYValues.length //get the # samples difference between the event and the last sample
      const newValues:number[] = [] //create an an empty array to store new samples
      for(let i=0; i<sampleXDiff; ++i) { //interpolate the skipped cells, if any
        newValues.push(lastCanvasY + i*canvasYDiff/sampleXDiff) //add the new interpolated value
      }
      newValues.push(canvasY) //push the event as a sample
      canvasYValues = canvasYValues.concat(newValues) //concat the new values
    }
  }
  
  //convert pixel positions to points
  $: yValues = canvasYValues.map(v => (halfCanvasHeight - v) / halfCanvasHeight)
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
      ctx.save() //save the context so we can undo the DPR later
      ctx.scale(DPR, DPR) //scale by the DPR
      ctx.clearRect(0,0,width,height) //clear the canvas

      ctx.fillStyle = RED
      canvasYValues.forEach((v,i) => { //dots
        const x = i * sampleWidth
        ctx.beginPath()
        ctx.arc(x + halfSampleWidth, v + halfSampleWidth, 2, 0, 2 * Math.PI)
        ctx.fill()
      })
      ctx.restore() //undo the DPR
  	}
  })
</script>

<main>
  <h2>Build-a-Signal!</h2>
  <p>{width > 500 ? "Hover your mouse" : "Drag your finger"} over the light gray box below from left to right to build your own custom signal. See what the DFT looks like!</p>
  <PickNumSamples bind:numSamples={numSamples}/>
  <div>
    <b>Sample Rate: </b> {numSamplesText} / {timeSpanText} = {sampleRateText}
  </div>
  <br/>
  <div><button on:click={reset}>Clear</button></div>
  
  <div bind:clientWidth={width} style="position:relative;">
    <div style={`
      background:#505050;
      position:absolute;
      height:${canvasHeight}px;
      left:${CANVAS_MARGIN.l}px;
      top:${CANVAS_MARGIN.t}px;
      width:${canvasWidth}px;
    `}/>

    <Plot {domain} {height} range={[-1,1]} xTitle="Time in seconds"/>

    <canvas
      bind:this={canvas}
      height={canvasHeight * DPR}
      on:mousemove={onMouseMove}
      on:touchmove={onTouchMove}
      style={`
        height:${canvasHeight}px;
        width:${canvasWidth}px;
        position:absolute;
        left:${CANVAS_MARGIN.l}px;
        top:${CANVAS_MARGIN.t}px;
      `}
      width={canvasWidth * DPR}
    />
  </div>

	<Plot discrete={true} points={slicedDftPoints} xTitle="Frequency (Discrete Fourier Transform)" stroke={GREEN}/>
</main>

<style>
</style>
