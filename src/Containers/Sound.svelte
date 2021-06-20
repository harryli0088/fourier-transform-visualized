<script lang="ts">
  import Icon from 'fa-svelte'
  import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'

  import Plot from "../Components/Plot.svelte";

  import getCos from '../utils/getCos';
  import getPoints from '../utils/getPoints';
  import playTone from '../utils/playTone';
  import { TWO_PI } from '../utils/constants';

  const DOMAIN:[number, number] = [0, 0.02]
  const STEP_SIZE = 0.00005

  const A440 = getCos(TWO_PI*440)
  const A440Points = getPoints(DOMAIN, A440, STEP_SIZE)

  const D294 = getCos(TWO_PI*294)
  const D294Points = getPoints(DOMAIN, D294, STEP_SIZE)

  const combinedPoints = A440Points.map((p,i) => ({
    x: p.x,
    y: p.y + D294Points[i].y
  }))
</script>

<main>
  <p>Consider the musical nodes A440 and D294. A440 means that the sound wave oscillates at a frequency of 440 beats per second, aka 440 Hertz. D294 means that the sound wave oscillates at a frequency of 294 beats per second, aka 294 Hertz.</p>
  <div>
    <b>A440: </b> <button on:click={() => playTone(["440"])}>Play A440 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={A440Points} stroke="#E74C3C" xTitle="Time"/>

  <br/><br/>

  <div>
    <b>D294: </b> <button on:click={() => playTone(["294"])}>Play D294 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={D294Points} stroke="#3498DB" xTitle="Time"/>

  <p>Notice that D294 seems more stretched out than A440. This because A440 oscillates more frequently that D294. What happens when we play the two notes together?</p>

  <br/><br/>

  <div>
    <b>Combined: </b> <button on:click={() => playTone(["440", "294"])}>Play A440 and D294 <Icon icon={faVolumeUp}/></button>
  </div>
  <Plot points={combinedPoints} stroke="#A569BD" xTitle="Time"/>

  <p>For each point in time, we sum the values of A440 and D294. Where both functions peak, those peaks add up. Where both functions dip, those dips subtract down. Where one function peaks and the other dips, they cancel out.</p>
  <p>Adding up two different functions is easy enough, but is there a way to work backwards? What if we started with the summed function, and we wanted to figure out what the input functions were?</p>
</main>

<style>
</style>