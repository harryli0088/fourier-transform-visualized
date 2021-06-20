import { now as toneNow, PolySynth, Synth } from 'tone'

const synth = new PolySynth(Synth).toDestination()

export default function playTone(
  note: string[] = ["440"],
  duration: string = "2n",
) {
  synth.triggerAttackRelease(note, duration, toneNow())
}