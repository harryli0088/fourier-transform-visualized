<script lang="ts">
  export let numSamples = 64
  export let sampleOptions: number[] = [64, 128, 256, 512, 1024]
</script>

<main>
  <div>
    <b>Number of Samples: </b>
    {#each sampleOptions as s}
      <button class={numSamples!==s ? "ghost" : ""} on:click={() => numSamples = s}>{s}</button>
    {/each}
  </div>
</main>
