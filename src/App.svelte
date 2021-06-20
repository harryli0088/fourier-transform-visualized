<script lang="ts">
  import MultipleCosines from "./Containers/MultipleCosines.svelte";
  import OneCosine from "./Containers/OneCosine.svelte";

</script>

<main style="--tablet-padding:calc(50vw - 300px + 1em);--desktop-padding:calc(50vw - 500px)">
  <header>
		<div>
			<h1>Fourier Transform Visualized</h1>
			<p id="sub-heading">How car odometers can teach us to count in binary</p>
			<div>
				<a href="https://github.com/harryli0088/binary-visualized" target="_blank" rel="noopener noreferrer"><img src="img/github.svg" alt="github logo"/></a>
			</div>
		</div>
	</header>

  <section>
    <OneCosine/>

    <hr/>

    <MultipleCosines/>
  </section>

  <footer>
		<p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
		<p>Github Repo: <a href="https://github.com/harryli0088/fourier-transform-visualized" target="_blank" rel="noopener noreferrer">https://github.com/harryli0088/fourier-transform-visualized</a></p>
		<p>Github Logo provided by Font Awesome: <a href="https://fontawesome.com/license" target="_blank" rel="noopener noreferrer">https://fontawesome.com/license</a></p>
	</footer>
</main>

<style>
  header, section, footer {
		padding: 1em;
	}
	@media only screen and (min-width: 600px) {
		header, section, footer {
			padding-left: var(--tablet-padding);
			padding-right: var(--tablet-padding);
		}
	}
	@media only screen and (min-width: 1200px) {
		header, section, footer {
			padding-left: var(--desktop-padding);
			padding-right: var(--desktop-padding);
		}
	}

  footer {
		background-color: #ddd;
	}
</style>