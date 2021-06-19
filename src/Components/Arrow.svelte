<script lang="ts">
  export let arrowHeight: number = 3
  export let arrowWidth: number = 5
  export let color: string = "gray"
  export let x1: number = 0
  export let x2: number = 0
  export let y1: number = 0
  export let y2: number = 0

  //first draw an arrow of DEFAULT_LENGTH length starting at 0,0
  //then scale the arrow to the right size
  //then translate it to the right spot
  const DEFAULT_LENGTH = 100
  $: ratio = (DEFAULT_LENGTH - arrowWidth*3) / length
  $: length = Math.hypot(x2 - x1,y2 - y1)
  $: x2Short = ratio * (x2 - x1)
  $: y2Short = ratio * (y2 - y1)

  $: {
    if(color === "gold") {
      console.log("LENGTH", length)
      console.log("x2Short", x2Short, x1)
      console.log("y2Short", y2Short)
    }
  }
</script>

<defs>
  <marker id="arrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX="0" refY={arrowHeight/2} orient="auto" fill={color}>
    <polygon points={`0 0, ${arrowWidth} ${arrowHeight/2}, 0 ${arrowHeight}`} />
  </marker>
</defs>
<g transform={`translate(${x1},${y1}) scale(${length / DEFAULT_LENGTH})`}>
  <line class="arrow" x1={0} y1={0} x2={x2Short} y2={y2Short} marker-end="url(#arrow)" />
</g>

<style>
  .arrow {
    stroke: gray;
    stroke-width: 3px;
  }
</style>