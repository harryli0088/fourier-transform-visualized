<script lang="ts">
  import Arrow from './Arrow.svelte';
  import type { PointType } from '../utils/types';

  export let diameter:number = 500
  export let drawProportion: number = 1 //between 0 and 1, the proportion of the points to draw
  export let freq: number = 1 //cycles per second, ie Hz
  export let height: number = 500
  export let margin: {b: number, l: number, r: number, t: number} = {b:1,l:1,r:0,t:1}
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
  $: console.log("diameter",diameter, "radius",radius)
  

  function getPixelPoints(
    freq: number,
    points: PointType[],
    radius: number,
  ):PointType[] {
    const pixelPoints: PointType[] = new Array(points.length)

    points.forEach((p, i) => {
      const theta = p.x * freq * 2 * Math.PI
      const magnitude = radius * p.y
      pixelPoints[i] = {x: magnitude*Math.cos(theta), y: magnitude*Math.sin(theta)}
    })

    return pixelPoints
  }

  $: pixelPoints = getPixelPoints(freq, points, radius)
  $: pointStrings = pixelPoints.map(p => `${p.x},${p.y}`)
  $: sliceIndex = Math.ceil(pointStrings.length * drawProportion)
  $: arrowPoint = pixelPoints[sliceIndex - 1]
  $: pathD = `M ${pointStrings.slice(0, sliceIndex).join(" ")}`

  const markerWidth = 7
  const markerHeight = 5
</script>

<main>
	<div bind:clientWidth={width}>
    <svg {width} {height}>
      <defs>
        <marker id="arrowhead" {markerWidth} {markerHeight} refX="0" refY="2.5" orient="auto" fill="gray">
          <polygon points="0 0, 7 2.5, 0 5" />
        </marker>
      </defs>
      
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
      </g>
      </g>
    </svg>
  </div>
</main>

<style>
  .tick {
    stroke: gray;
    stroke-width: 2px;
  }

  path {
    stroke-width: 2px;
  }
</style>