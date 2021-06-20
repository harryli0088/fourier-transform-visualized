<script lang="ts">
  import { POLAR_HEIGHT } from '../utils/constants';
</script>

<main style={`--polar-height:${POLAR_HEIGHT}px`}>
  <div class="polar-ft-container">
    <div class="polar-container">
      <slot name="polar"/>
    </div>
    <div class="ft-container">
      <slot name="ft"/>
    </div>
  </div>

</main>

<style>
  .polar-ft-container {
    display: flex;
  }

  .polar-container {
    width: var(--polar-height);
  }

  .ft-container {
    width: calc(100% - var(--polar-height));
  }

  @media only screen and (max-width: 1400px) {
    .polar-ft-container {
      flex-direction: column;
    }

    .polar-container {
      margin-left: auto;
      margin-right: auto;
    }
    
		.ft-container {
			width: 100%;
		}
	}
</style>