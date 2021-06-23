<script lang="ts">
  import COM from './Containers/COM.svelte';
  import Intro from './Containers/Intro.svelte';
  import MultipleCosines from "./Containers/MultipleCosines.svelte";
  import OneCosine from "./Containers/OneCosine.svelte";
  import Sound from './Containers/Sound.svelte';
import Header from './Containers/Header.svelte';

</script>

<main style="--tablet-padding:calc(50vw - 400px + 1em);--desktop-padding:calc(50vw - 600px)">
  <header>
    <Header/>
  </header>

  <section>
    <p>The Fourier Transform is a mathematical transformation that helps us break down functions over time into functions of <i>frequencies</i>. This transform is extremely important for signal processing in technology that we use every day, such as music, radar, WIFI, and phone calls.</p>

    <br/><br/><br/><br/>
    
    <Sound/>

    <br/><br/><br/><br/>

    <Intro/>

    <br/><br/><br/><br/>

    <COM/>

    <br/><br/><br/><br/>

    <OneCosine/>

    <br/><br/><br/><br/>

    <MultipleCosines/>

    <br/><br/><br/><br/>

    <div style="text-align:center">
      <h2>3Blue1Brown's Video</h2>

      <p>Most of this site's material was taken from 3Blue1Brown's fantastic video about the Fourier Transform.</p>

      <div id="limitWidth">
        <div id="videoContainer">
          <iframe title="video" width="560" height="315" src="https://www.youtube.com/embed/spUNpyF58BY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
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
	@media only screen and (min-width: 800px) {
		header, section, footer {
			padding-left: var(--tablet-padding);
			padding-right: var(--tablet-padding);
		}
	}
	@media only screen and (min-width: 1400px) {
		header, section, footer {
			padding-left: var(--desktop-padding);
			padding-right: var(--desktop-padding);
		}
	}

  header {
    background-color: #444;
  }

  #limitWidth {
		margin-left: auto;
		margin-right: auto;
		max-width: 700px;
	}
	#videoContainer {
		position: relative;
		padding-bottom: 56.25%;
		padding-top: 30px;
		height: 0;
		overflow: hidden;
	}
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}


  footer {
		background-color: #222;
	}
</style>