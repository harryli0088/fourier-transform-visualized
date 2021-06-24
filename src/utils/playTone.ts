import { now as toneNow, PolySynth, Synth } from 'tone'

export default function playTone(
  note: string[] = ["440"],
  duration: string = "2n",
) {
  const synth = new PolySynth(Synth).toDestination()
  synth.volume.value = -24
  synth.triggerAttackRelease(note, duration, toneNow())
}