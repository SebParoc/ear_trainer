import * as Tone from 'tone';
import { getNoteString, type Note } from './theory';

const sampler = new Tone.Sampler({
    urls: {
        "A0": "A0.mp3",
        "C1": "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        "A1": "A1.mp3",
        "C2": "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        "A3": "A3.mp3",
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3",
        "C6": "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        "A6": "A6.mp3",
        "C7": "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        "A7": "A7.mp3",
        "C8": "C8.mp3"
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

export async function initAudio() {
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
    await Tone.loaded();
}

export function playNote(note: Note | string, duration = "8n") {
    const noteStr = typeof note === 'string' ? note : getNoteString(note);
    sampler.triggerAttackRelease(noteStr, duration);
}

export function playInterval(note1: Note, note2: Note) {
    const now = Tone.now();
    const n1 = getNoteString(note1);
    const n2 = getNoteString(note2);

    sampler.triggerAttackRelease(n1, "2n", now);
    sampler.triggerAttackRelease(n2, "2n", now + 0.8); // Slower pace for piano
}

let duckPlayer: Tone.Player | null = null;

export function playDuckSound() {
    // Ensure context is running, but don't block
    if (Tone.context.state !== 'running') {
        initAudio().catch(console.error);
    }

    if (!duckPlayer) {
        duckPlayer = new Tone.Player({
            url: "/sounds/duck.mp3",
            autostart: true,
        }).toDestination();
    } else {
        duckPlayer.start();
    }
}

let happyDuckPlayer: Tone.Player | null = null;

export function playHappyDuckSound() {
    // Ensure context is running, but don't block
    if (Tone.context.state !== 'running') {
        initAudio().catch(console.error);
    }

    if (!happyDuckPlayer) {
        happyDuckPlayer = new Tone.Player({
            url: "/sounds/happyduck.mp3",
            autostart: true,
        }).toDestination();
    } else {
        happyDuckPlayer.start();
    }
}

export function playSuccessSound() {
    if (Tone.context.state !== 'running') {
        initAudio().catch(console.error);
    }

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    // Play a pleasant major triad arpeggio
    synth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "8n", now);
}
