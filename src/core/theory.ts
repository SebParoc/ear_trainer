export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export interface Note {
    name: NoteName;
    octave: number;
    frequency?: number; // Optional, Tone.js handles this usually by name like "C4"
}

export interface Interval {
    semitones: number;
    name: {
        anglo: string;
        italian: string;
    };
}

export const INTERVALS: Interval[] = [
    { semitones: 0, name: { anglo: "Unison", italian: "Prima Giusta" } },
    { semitones: 2, name: { anglo: "Major 2nd", italian: "Seconda Maggiore" } },
    { semitones: 4, name: { anglo: "Major 3rd", italian: "Terza Maggiore" } },
    { semitones: 5, name: { anglo: "Perfect 4th", italian: "Quarta Giusta" } },
    { semitones: 7, name: { anglo: "Perfect 5th", italian: "Quinta Giusta" } },
    { semitones: 9, name: { anglo: "Major 6th", italian: "Sesta Maggiore" } },
    { semitones: 11, name: { anglo: "Major 7th", italian: "Settima Maggiore" } },
    { semitones: 12, name: { anglo: "Octave", italian: "Ottava" } },
];

export const NOTES: NoteName[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const ITALIAN_NOTES: Record<NoteName, string> = {
    "C": "Do", "C#": "Do#",
    "D": "Re", "D#": "Re#",
    "E": "Mi",
    "F": "Fa", "F#": "Fa#",
    "G": "Sol", "G#": "Sol#",
    "A": "La", "A#": "La#",
    "B": "Si"
};

export function getNoteName(note: NoteName, language: 'anglo' | 'italian'): string {
    if (language === 'italian') {
        return ITALIAN_NOTES[note];
    }
    return note;
}

export function getNoteString(note: Note): string {
    return `${note.name}${note.octave}`;
}

export function getRandomNote(minOctave = 3, maxOctave = 5): Note {
    const note = NOTES[Math.floor(Math.random() * NOTES.length)];
    const octave = Math.floor(Math.random() * (maxOctave - minOctave + 1)) + minOctave;
    return { name: note, octave };
}

export function getIntervalNote(startNote: Note, semitones: number): Note {
    const startIndex = NOTES.indexOf(startNote.name);
    let newIndex = startIndex + semitones;
    let octaveChange = Math.floor(newIndex / 12);
    newIndex = newIndex % 12;

    return {
        name: NOTES[newIndex],
        octave: startNote.octave + octaveChange
    };
}
