<script lang="ts">
  import Arrow from './Arrow.svelte';
  import type { PointType } from '../utils/types';
  import type { ComplexNumber } from '../utils/complexNumber';
  import { TWO_PI } from '../utils/constants';
  import getRange from '../utils/getRange';

  export let definiteIntegralFunction: (freq: number) => ComplexNumber
  export let diameter:number = 500
  export let domain: [number, number] = [0,Math.PI] //the time domain
  export let drawProportion: number = 1 //between 0 and 1, the proportion of the points to draw
  export let freq: number = 1 //cycles per second, ie Hz
  export let height: number = 500
  export let margin: {b: number, l: number, r: number, t: number} = {b:1,l:1,r:0,t:1}
  export let maxMagnitude: number = 0
  export let points: PointType[] = []
  export let stroke: string = "black"

  let width: number = 500

  $: bottom = height - margin.b
  $: left = margin.l
  $: right = width - margin.r
  $: top = margin.t 

  $: diameter = Math.min(bottom - top, right - left)
  $: radius = diameter / 2

  $: lineIntervals = [-diameter/2, -diameter/4, 0, diameter/4, diameter/2]
  
  function getPolarPoints(
    freq: number,
    points: PointType[],
  ):PointType[] {
    return points.map((p) => {
      const theta = p.x * freq * TWO_PI
      return {x: p.y*Math.cos(theta), y: p.y*Math.sin(theta)}
    })
  }

  $: polarPoints = getPolarPoints(freq, points)
  $: useMaxMagnitude = Math.ceil(
    maxMagnitude > 0 //if the maxMaginitude props is valid
    ? maxMagnitude //use it
    : Math.max(...getRange(polarPoints, (p: PointType) => p.x), ...getRange(polarPoints)) //else dynamically calculate it
  )
  $: unitLengthPixels = radius / useMaxMagnitude //the length of a unit vector in pixels


  $: pixelPoints = polarPoints.map(p => ({x: unitLengthPixels*p.x, y: unitLengthPixels*p.y}))
  $: pointStrings = pixelPoints.map(p => `${p.x},${p.y}`)
  $: sliceIndex = Math.ceil(pointStrings.length * drawProportion)
  $: arrowPoint = pixelPoints[sliceIndex - 1]
  $: pathD = `M ${pointStrings.slice(0, sliceIndex).join(" ")}`

  $: centerOfMass = definiteIntegralFunction(freq)
  $: domainSpan = domain[1] - domain[0] //for the center of mass explanation, we need to divide by the span of the time domain (t2 - t1)
  $: centerOfMassScale = unitLengthPixels / domainSpan //multiply the values by the scale to get to the right spot
</script>

<div bind:clientWidth={width}>
  <svg {width} {height}>
    <g>
      <g transform={`translate(${left + radius},${top + radius})`}>
        {#each lineIntervals as l}
          <line class="tick" x1={-radius} y1={l} x2={radius} y2={l}/>
        {/each}
        {#each lineIntervals as l}
          <line class="tick" x1={l} y1={-radius} x2={l} y2={radius}/>
        {/each}
        <path d={pathD} fill="none" {stroke}/>
        
        {#if drawProportion !== 1 && arrowPoint}
          <Arrow x1={0} y1={0} x2={arrowPoint.x} y2={arrowPoint.y}/>
        {/if}

        <circle cx={centerOfMass.r*centerOfMassScale} cy={-centerOfMass.i*centerOfMassScale} r={10} fill="red"/>
    </g>
    </g>
  </svg>
</div>

<style>
  .tick {
    stroke: gray;
    stroke-width: 2px;
  }

  path {
    stroke-width: 2px;
  }
</style>