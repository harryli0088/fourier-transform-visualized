<script lang="ts">
  import { scaleLinear } from 'd3'

  import Arrow from './Arrow.svelte';
  import getDomain from '../utils/getDomain';
  import getRange from '../utils/getRange';
  import type { MathFunc, PointType } from '../utils/types';
  import { BLUE, RED } from '../utils/constants';

  export let discrete: boolean = false //whether or not to draw in discrete mode
  export let discreteCircleR: number = 4 //the default radius of circles in discrete mode
  export let drawProportion: number = 1 //between 0 and 1, the proportion of the points to draw
  export let height: number = 200
  export let margin: {b: number, l: number, r: number, t: number} = {b:10,l:35,r:10,t:10}
  export let points: PointType[] = []
  export let range: [number, number] | undefined = undefined
  export let stroke: string = RED
  export let windingFreq: number = -1
  export let xTickGap: number = 0.25
  export let xTickSize: number = 15
  export let xTitle: string = ""
  export let yTickSize: number = 15
  export let yTitle: string = ""

  /**
   * Given the span and the maximum number of desired labels,
   * return the size of the label increment
   * @param span      the span of the data
   * @param maxLabels the maximum number of labels
   * @return          the label increment to use
   */
  function getLabelIncrement(
    span: number,
    maxLabels: number
  ) {
    const rawIncrement = span / maxLabels //get the unrounded label increment
    if(rawIncrement < 1) return 1 //if the raw increment is less than 1, use 1 for simplicity
    if(rawIncrement < 5) return 5 //use 5 for simplicity
    return Math.ceil(rawIncrement / 10)*10 //round up to the next multiple of 10
  }

  /**
   * Process the range and determine the label increment
   * @param maxLabels maximum number of labels
   * @param range     optionally, the range to use
   * @returns         the range to use and the label increment
   */
  function processRange(
    maxLabels: number,
    range?: [number, number]
  ) {
    let useRange: [number, number]
    if(range) { //use the range from props if provided
      useRange = range
    }
    else { //else find the range of the points
      useRange = getRange(points).map((n,i) => i===0?Math.floor(n):Math.ceil(n)) as [number, number]
    }
    const rangeSpan = useRange[1] - useRange[0] //get the span of this range
    const labelIncrement = getLabelIncrement(rangeSpan, maxLabels) //get the label increment
    useRange[0] = Math.floor(useRange[0] / labelIncrement) * labelIncrement //move down the start the range to the next multiple of the increment
    useRange[1] = Math.ceil(useRange[1] / labelIncrement) * labelIncrement //move up the end of the range to the next multiple of the increment
    
    return {
      labelIncrement,
      useRange, 
    }
  }

  /* Figure out the Domain and Range data */
  $: domain = getDomain(points)
  $: maxYLabels = height / 30
  $: ({
    labelIncrement: yLabelIncrement,
    useRange,
  } = processRange(maxYLabels, range))

  /* Dimensions and Margins */
  let width:number = 500
  $: bottom = height - margin.b - (xTitle===""?0:30)
  $: left = margin.l + (yTitle===""?0:20)
  $: right = width - margin.r
  $: top = margin.t

  /* Pixel Scales */
  $: xScale = scaleLinear<number,number>().domain(domain).range([left, right])
  $: x0 = xScale(0)
  $: yScale = scaleLinear<number,number>().domain(useRange).range([bottom, top])
  $: y0 = yScale(0)

  /* Convert Data to Pixel Positions */
  $: pixelPoints = points.map(p => ({x: xScale(p.x), y: yScale(p.y)}))
  $: pointStrings = pixelPoints.map(p => ({x: p.x.toFixed(2), y: p.y.toFixed(2)}))
  $: sliceIndex = Math.ceil(pointStrings.length * drawProportion)
  $: arrowPoint = pixelPoints[sliceIndex - 1]
  $: slicedPointStrings = pointStrings.slice(0, sliceIndex)


  /* Axis Labels */
  function getLabels(
    domain: [number,number],
    showZero: boolean = false,
    increment: number = 1
  ) {
    const labels: number[] = []
    for(let i=Math.ceil(domain[0]); i<=domain[1]; i+=increment) {
      if(showZero || i !== 0) {
        labels.push(i)
      }
    }
    return labels
  }
  $: xLabels = getLabels(domain)
  $: yLabels = getLabels(useRange, true, yLabelIncrement)

  

  /* Axis Ticks */
  function getTicks(
    domain: [number, number],
    scale: MathFunc,
    tickGap: number,
  ) {
    const ticks: {i: number, o: number}[] = []
    for(let i=Math.ceil(domain[0]); i<=domain[1]; i+=tickGap) {
      ticks.push({i, o: scale(i)})
    }
    return ticks
  }
  function getTickSize(value: number, tickSize: number) {
    return value%1===0 ? tickSize : tickSize/2
  }
  $: xTickHalfSize = xTickSize/2
  $: xTicks = getTicks(domain, xScale, xTickGap)
  $: yTickHalfSize = yTickSize/2
  $: yTicks = getTicks(useRange, yScale, yLabelIncrement===1?0.5:yLabelIncrement)



  /* Winding Frequency Ticks */
  function getWindingFreqTicks(
    domain: [number, number],
    windingFreq: number,
    xScale: MathFunc,
  ) {
    const windingFreqTicks: number[] = []
    if(windingFreq > 0 && windingFreq !== Infinity) { //if we have meaningful winding frequencies to draw
      const windingInverse = 1 / windingFreq //get the inverse of the winding frequency
      let multiple = windingInverse * Math.ceil(domain[0]*windingInverse) //round up to the next multiple of the winding freq inverse
      for(multiple; multiple<domain[1]; multiple+=windingInverse) { //increment by the winding freq inverse through the domain
        if(multiple > 0) { //if the multiple is greater than zero
          windingFreqTicks.push(xScale(multiple)) //push a new tick
        }
      }
    }
    return windingFreqTicks
  }
  $: windingFreqTicks = getWindingFreqTicks(domain, windingFreq, xScale)
</script>

<div bind:clientWidth={width}>
  <svg {width} {height}>
    <line class="gray" x1={xScale(domain[0])} y1={y0} x2={xScale(domain[1])} y2={y0}/>
    <line class="gray" x1={x0} y1={yScale(useRange[0])} x2={x0} y2={yScale(useRange[1])}/>

    {#each windingFreqTicks as t}
      <line class="winding-freq-tick" stroke={BLUE} x1={t} y1={yScale(useRange[0])} x2={t} y2={yScale(useRange[1])}/>
    {/each}

    {#each xTicks as t}
      <line class="gray" x1={t.o} y1={y0 + getTickSize(t.i,xTickHalfSize)} x2={t.o} y2={y0 - getTickSize(t.i,xTickHalfSize)}/>
    {/each}
    {#each yTicks as t}
      <line class="gray" x1={x0 + getTickSize(t.i,yTickHalfSize)} y1={t.o} x2={x0 - getTickSize(t.i,yTickHalfSize)} y2={t.o}/>
    {/each}

    {#each xLabels as l}
      <text x={xScale(l)} y={y0 + xTickHalfSize} dy="1em" text-anchor="middle">{l}</text>
    {/each}
    {#each yLabels as l}
      <text x={x0 - yTickHalfSize - 5} y={yScale(l)} dy="0.4em" text-anchor="end">{l}</text>
    {/each}


    {#if drawProportion !== 1 && arrowPoint}
      <Arrow x1={arrowPoint.x} y1={y0} x2={arrowPoint.x} y2={arrowPoint.y}/>
    {/if}
    
    <text x={xScale((domain[1]-domain[0])/2)} y={height - 5} text-anchor="middle">{xTitle}</text>

    {#if discrete}
      {#each slicedPointStrings as p}
        <circle cx={p.x} cy={p.y} r={discreteCircleR} fill={stroke} stroke="none"/>
      {/each}
    {:else}
      <path d={`M ${slicedPointStrings.map(p => `${p.x},${p.y}`).join(" ")}`} fill="none" {stroke}/>
    {/if}
  </svg>
</div>

<style>
  path {
    stroke-width: 2px;
  }

  line {
    stroke-width: 2px;
  }

  line.gray {
    stroke: gray;
  }

  .winding-freq-tick {
    stroke-dasharray: 5px;
  }
</style>