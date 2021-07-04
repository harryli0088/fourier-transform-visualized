import { now as toneNow, PolySynth, Synth } from 'tone'

/**
 * Using the tone library, play audio notes
 * @param notes     array of notes to play
 * @param duration  how long to play the notes 
 */
export default function playTone(
  notes: string[] = ["440"],
  duration: string = "2n",
) {
  const synth = new PolySynth(Synth).toDestination()
  synth.volume.value = -24
  synth.triggerAttackRelease(notes, duration, toneNow())
}