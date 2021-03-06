<script lang="ts">
  import Icon from 'fa-svelte'
  import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'

  import { detect } from 'detect-browser'

  import Plot from "../Components/Plot.svelte";

  import { BLUE, PURPLE, RED, TWO_PI } from '../utils/constants';
  import getCos from '../utils/getCos';
  import getPoints from '../utils/getPoints';
  import playTone from '../utils/playTone';

  const browser = detect()
  console.log("browser", browser)

  const DOMAIN:[number, number] = [0, 0.02]
  const STEP_SIZE = 0.00005

  const A440 = getCos(TWO_PI*440)
  const A440Points = getPoints(DOMAIN, A440, 1000)

  const D294 = getCos(TWO_PI*294)
  const D294Points = getPoints(DOMAIN, D294, 1000)

  const combinedPoints = A440Points.map((p,i) => ({
    x: p.x,
    y: p.y + D294Points[i].y
  }))
</script>

<main>
  <h2>Examples from Sound</h2>
  <p>Consider the musical notes A440 and D294. A440 means that the sound wave oscillates at a frequency of 440 beats per second, aka 440 Hertz (Hz). D294 means that the sound wave oscillates at a frequency of 294 beats per second, aka 294 Hertz (Hz).</p>
  {#if browser.os === "iOS"}
    <p>(You need to turn silent mode off to hear the sounds)</p>
  {/if}
  <div>
    <b>A440: </b> <button on:click={() => playTone(["440"])}>Play A440 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={A440Points} stroke={RED} xTitle="Time"/>

  <br/><br/>

  <div>
    <b>D294: </b> <button on:click={() => playTone(["294"])}>Play D294 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={D294Points} stroke={BLUE} xTitle="Time"/>

  <p>Notice that A440 is more "squished" than D294. This because A440 oscillates more frequently that D294. What happens when we play the two notes together?</p>

  <br/><br/>

  <div>
    <b>Combined: </b> <button on:click={() => playTone(["440", "294"])}>Play A440 and D294 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={combinedPoints} stroke={PURPLE} xTitle="Time"/>

  <p>For each point in time, we sum the values of A440 and D294. Where both functions peak, those peaks add up. Where both functions dip, the resulting function is low too.</p>
  <p>Adding up two different functions is easy enough, but is there a way to work backwards? What if we started with the purple resulting function, and we wanted to figure out what the input functions were? This kind of signal processing has many applications, for example:</p>
  <ul>
    <li>Our sound recording has an annoying high pitched note. How can we filter it out?</li>
    <li>WIFI and our phones operate at certain frequencies. How can we listen for one particular frequency?</li>
  </ul>
</main>

<style>
</style>