<script lang="ts">
  import type { Tweened } from 'svelte/motion'

  export let drawProportion: Tweened<number>
  export let initialValue: number = 1
</script>

<main>
  <div>
    <span><b>Draw Proportion: </b>{$drawProportion}</span>
    <input
      max="1"
      min="0"
      on:input={e => drawProportion.set(parseFloat(e.target.value), {duration: Math.abs($drawProportion-parseFloat(e.target.value))*10000})}
      step="0.05"
      type="range"
      value={initialValue}
    >
  </div>
</main>

<style>
  input[type=range] {
    width: 100%;
  }
</style>