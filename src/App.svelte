<script lang="ts">
  import { onMount } from 'svelte';

  import COM from './Containers/COM.svelte';
  import CustomDFT from './Containers/CustomDFT.svelte';
  import DFT from './Containers/DFT.svelte';
  import Header from './Containers/Header.svelte';
  import Intro from './Containers/Intro.svelte';
  import MultipleCosines from "./Containers/MultipleCosines.svelte";
  import OneCosine from "./Containers/OneCosine.svelte";
  import Sound from './Containers/Sound.svelte';
  import initMathJax from './utils/initMathJax';

  onMount(() => {
    initMathJax()
  })
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

    <br/><br/><br/><br/>

    <DFT/>

    <br/><br/><br/><br/>

    <CustomDFT/>

    <br/><br/><br/><br/>

    <div>
      <h2>Questions I had while making this site</h2>

      <div>
        <h3>What is the derivation for these Fourier Transforms?</h3>
        <p>One cosine function has the form {`$ cos(a*t + b)$`}, where {`$a$`} represents the frequency, {`$b$`} represents the phase shift (not used in this site), and {`$t$`} represents time. In the below formulas, {`$f$`} is an input frequency, and {`$i$`} is the imaginary unit.</p>

        <div style="width: 100%;overflow-x: auto;">
          <p>The Fourier Transform is {`$$F(f) = \\int^{t2}_{t1}{ cos(at + b) * e^{(-2πitf)} } dt$$`}</p>
          <p>(through <a href="https://en.wikipedia.org/wiki/Euler%27s_formula" target="_blank" rel="noopener noreferrer">Euler's formula</a>) {`$$= \\int^{t2}_{t1}({ cos(at+b)*cos(-2πtf) + i*cos(at+b)*sin(-2πtf) }) dt$$`}</p>
          <p>(through <a href="https://en.wikipedia.org/wiki/List_of_trigonometric_identities#Product-to-sum_and_sum-to-product_identities" target="_blank" rel="noopener noreferrer">trig product identities</a>) {`$$= \\frac{1}2\\int^{t2}_{t1}({ cos(at+b-2πtf) + cos(at+b+2πtf) + i*sin(-2πtf+a*t+b) + i*sin(-2πtf-at-b) }) dt$$`}</p>
          <p>(simplifying) {`$$= \\frac{1}2\\int^{t2}_{t1}({ cos((a-2πtf)t+b) + cos((a+2πf)t+b) + i*sin((a-2πf)t+b) +i*sin((-a-2πf)t-b) }) dt$$`}</p>
          <p>(after integrating) {`$$= \\frac{1}2\\Bigl( \\frac{sin((a-2πf)t+b)}{a-2πf} + \\frac{sin((a+2πf)t+b)}{a+2πf} - i*\\frac{cos((a-2πf)t+b)}{a-2πf} + i*\\frac{cos((-a-2πf)t-b)}{a+2πf} \\Bigr) \\enspace {\\Bigr|^{t1}_{t2}}$$`}</p>
        </div>

        <p>The real portion of the transform is what's plotted in these visualizations. The imaginary part represents the phase shift.</p>
      </div>

      <br/>

      <div>
        <h3>Why is the Fourier Transform so squiggly? Shouldn't the transform identify the specific pure frequencies?</h3>
        <p>These Fourier Transforms are squiggly because the integral is bounded over times t=0 to t=3. If we were integrating between -∞ and ∞, then we would get dirac deltas at the specific pure frequencies. <a href="https://en.wikipedia.org/wiki/Fourier_transform#Definition" target="_blank" rel="noopener noreferrer">Wikipedia</a>, <a href="https://www.thefouriertransform.com/pairs/sinusoids.php" target="_blank" rel="noopener noreferrer">thefouriertransform.com</a></p>
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
