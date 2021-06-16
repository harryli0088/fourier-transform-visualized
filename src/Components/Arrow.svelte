<script lang="ts">
  export let arrowHeight: number = 3
  export let arrowWidth: number = 5
  export let color: string = "gray"
  export let x1: number = 0
  export let x2: number = 0
  export let y1: number = 0
  export let y2: number = 0

  $: length = Math.hypot(x2-x1,y2-y1)
  $: ratio = (length - arrowWidth*3) / length
  $: x2Short = x1 + ratio*(x2-x1)
  $: y2Short = y1 + ratio*(y2-y1)
</script>

<defs>
  <marker id="arrow" markerWidth={arrowWidth} markerHeight={arrowHeight} refX="0" refY={arrowHeight/2} orient="auto" fill={color}>
    <polygon points={`0 0, ${arrowWidth} ${arrowHeight/2}, 0 ${arrowHeight}`} />
  </marker>
</defs>
<line class="arrow" {x1} {y1} x2={x2Short} y2={y2Short} marker-end="url(#arrow)" />

<style>
  .arrow {
    stroke: gray;
    stroke-width: 3px;
  }
</style>