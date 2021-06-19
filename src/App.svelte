<script lang="ts">
  import MultipleCosines from "./Containers/MultipleCosines.svelte";
  import OneCosine from "./Containers/OneCosine.svelte";

</script>

<main>
  <OneCosine/>

  <hr/>

  <MultipleCosines/>
</main>

<style>
  input[type=range] {
    width: 100%;
  }
</style>