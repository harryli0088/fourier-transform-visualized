<script lang="ts">
  import Icon from 'fa-svelte'
  import { faGithub } from '@fortawesome/free-brands-svg-icons'

  import MultipleCosines from "./Containers/MultipleCosines.svelte";
  import OneCosine from "./Containers/OneCosine.svelte";
  import Sound from './Containers/Sound.svelte';

</script>

<main style="--tablet-padding:calc(50vw - 300px + 1em);--desktop-padding:calc(50vw - 500px)">
  <header>
		<div>
			<h1>Fourier Transform Visualized</h1>
			<p>Inspired by <a href="https://www.youtube.com/watch?v=spUNpyF58BY" target="_blank" rel="noopener noreferrer">3Blue1Brown</a></p>
			<div>
				<a href="https://github.com/harryli0088/fourier-transform-visualized" target="_blank" rel="noopener noreferrer"><Icon icon={faGithub}/></a>
			</div>
		</div>
	</header>

  <section>
    <p>The Fourier Transform is a mathematical transformation that helps us break down functions over time into functions of <i>frequencies</i>. This transform is extremely important for signal processing in technology that we use every day, such as music, radar, WIFI, and phone calls.</p>

    <Sound/>

    <OneCosine/>

    <hr/>

    <MultipleCosines/>
  </section>

  <footer>
		<p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
		<p>Github Repo: <a href="https://github.com/harryli0088/fourier-transform-visualized" target="_blank" rel="noopener noreferrer">https://github.com/harryli0088/fourier-transform-visualized</a></p>
		<p>Icons provided by Font Awesome: <a href="https://fontawesome.com/license" target="_blank" rel="noopener noreferrer">https://fontawesome.com/license</a></p>
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

  :global(.fa-svelte) {
    margin-top: 2px;
    margin-bottom: -2px;
  }

  :global(.icon-button) {
    cursor: pointer;
  }
</style>