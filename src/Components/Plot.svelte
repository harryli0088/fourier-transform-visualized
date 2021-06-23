<script lang="ts">
  import { scaleLinear } from 'd3'

  import Arrow from './Arrow.svelte';
  import getDomain from '../utils/getDomain';
  import getRange from '../utils/getRange';
  import type { MathFunc, PointType } from '../utils/types';
  import { BLUE, RED } from '../utils/constants';

  export let drawProportion: number = 1 //between 0 and 1, the proportion of the points to draw
  export let height: number = 200
  export let margin: {b: number, l: number, r: number, t: number} = {b:10,l:35,r:10,t:10}
  export let points: PointType[] = []
  export let range: [number, number] | null = null
  export let stroke: string = RED
  export let windingFreq: number = -1
  export let xTickGap: number = 0.25
  export let xTickSize: number = 15
  export let xTitle: string = ""
  export let yTickGap: number = 0.5
  export let yTickSize: number = 15
  export let yTitle: string = ""

  $: domain = getDomain(points)
  $: useRange = range || getRange(points).map((n,i) => i===0?Math.floor(n):Math.ceil(n)) as [number, number] //use the range from props if provided, else use find the range of the points
  $: xTickHalfSize = xTickSize/2
  $: yTickHalfSize = yTickSize/2

  
  let width:number = 500

  $: bottom = height - margin.b - (xTitle===""?0:30)
  $: left = margin.l + (yTitle===""?0:20)
  $: right = width - margin.r
  $: top = margin.t

  $: xScale = scaleLinear<number,number>().domain(domain).range([left, right])
  $: x0 = xScale(0)
  $: yScale = scaleLinear<number,number>().domain(useRange).range([bottom, top])
  $: y0 = yScale(0)


  function getLabels(
    domain: [number,number],
    showZero: boolean = false
  ) {
    const labels: number[] = []
    for(let i=Math.ceil(domain[0]); i<=domain[1]; i++) {
      if(showZero || i !== 0) {
        labels.push(i)
      }
    }
    return labels
  }
  $: xLabels = getLabels(domain)
  $: yLabels = getLabels(useRange, true)

  $: pixelPoints = points.map(p => ({x: xScale(p.x), y: yScale(p.y)}))
  $: pointStrings = pixelPoints.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
  $: sliceIndex = Math.ceil(pointStrings.length * drawProportion)
  $: arrowPoint = pixelPoints[sliceIndex - 1]
  $: pathD = `M ${pointStrings.slice(0, sliceIndex).join(" ")}`


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
  $: xTicks = getTicks(domain, xScale, xTickGap)
  $: yTicks = getTicks(useRange, yScale, yTickGap)


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

    <path d={pathD} fill="none" {stroke}/>

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