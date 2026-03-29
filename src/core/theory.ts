export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export interface Note {
    name: NoteName;
    octave: number;
    frequency?: number;
}

export type IntervalQuality = 'Major' | 'Minor' | 'Perfect' | 'Diminished' | 'Augmented';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Interval {
    semitones: number;
    name: {
        anglo: string;
        italian: string;
    };
    shortName: string;
    type: IntervalQuality;
    difficulty: Difficulty;
    /** Common musical reference to help recognize the interval */
    hint: {
        anglo: string;
        italian: string;
    };
}

export const INTERVALS: Interval[] = [
    {
        semitones: 0,
        name: { anglo: "Unison", italian: "Prima Giusta" },
        shortName: "P1",
        type: 'Perfect',
        difficulty: 'beginner',
        hint: { anglo: "Same note repeated", italian: "Stessa nota ripetuta" },
    },
    {
        semitones: 1,
        name: { anglo: "Minor 2nd", italian: "Seconda Minore" },
        shortName: "m2",
        type: 'Minor',
        difficulty: 'intermediate',
        hint: { anglo: "Jaws theme", italian: "Tema di Jaws" },
    },
    {
        semitones: 2,
        name: { anglo: "Major 2nd", italian: "Seconda Maggiore" },
        shortName: "M2",
        type: 'Major',
        difficulty: 'beginner',
        hint: { anglo: "Happy Birthday", italian: "Tanti Auguri" },
    },
    {
        semitones: 3,
        name: { anglo: "Minor 3rd", italian: "Terza Minore" },
        shortName: "m3",
        type: 'Minor',
        difficulty: 'beginner',
        hint: { anglo: "Greensleeves", italian: "Greensleeves" },
    },
    {
        semitones: 4,
        name: { anglo: "Major 3rd", italian: "Terza Maggiore" },
        shortName: "M3",
        type: 'Major',
        difficulty: 'beginner',
        hint: { anglo: "Oh When The Saints", italian: "Oh When The Saints" },
    },
    {
        semitones: 5,
        name: { anglo: "Perfect 4th", italian: "Quarta Giusta" },
        shortName: "P4",
        type: 'Perfect',
        difficulty: 'beginner',
        hint: { anglo: "Here Comes The Bride", italian: "Marcia Nuziale" },
    },
    {
        semitones: 6,
        name: { anglo: "Tritone", italian: "Tritono" },
        shortName: "TT",
        type: 'Augmented',
        difficulty: 'advanced',
        hint: { anglo: "The Simpsons theme", italian: "Tema dei Simpson" },
    },
    {
        semitones: 7,
        name: { anglo: "Perfect 5th", italian: "Quinta Giusta" },
        shortName: "P5",
        type: 'Perfect',
        difficulty: 'beginner',
        hint: { anglo: "Star Wars theme", italian: "Tema di Star Wars" },
    },
    {
        semitones: 8,
        name: { anglo: "Minor 6th", italian: "Sesta Minore" },
        shortName: "m6",
        type: 'Minor',
        difficulty: 'intermediate',
        hint: { anglo: "Love Story theme", italian: "Tema di Love Story" },
    },
    {
        semitones: 9,
        name: { anglo: "Major 6th", italian: "Sesta Maggiore" },
        shortName: "M6",
        type: 'Major',
        difficulty: 'intermediate',
        hint: { anglo: "My Bonnie", italian: "My Bonnie" },
    },
    {
        semitones: 10,
        name: { anglo: "Minor 7th", italian: "Settima Minore" },
        shortName: "m7",
        type: 'Minor',
        difficulty: 'advanced',
        hint: { anglo: "Star Trek theme", italian: "Tema di Star Trek" },
    },
    {
        semitones: 11,
        name: { anglo: "Major 7th", italian: "Settima Maggiore" },
        shortName: "M7",
        type: 'Major',
        difficulty: 'advanced',
        hint: { anglo: "Somewhere (West Side Story)", italian: "Somewhere (West Side Story)" },
    },
    {
        semitones: 12,
        name: { anglo: "Octave", italian: "Ottava" },
        shortName: "P8",
        type: 'Perfect',
        difficulty: 'beginner',
        hint: { anglo: "Somewhere Over The Rainbow", italian: "Somewhere Over The Rainbow" },
    },
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

/** Get the color associated with an interval quality for UI display */
export function getIntervalColor(type: IntervalQuality): string {
    switch (type) {
        case 'Perfect': return '#77a0a9';    // cool-steel
        case 'Major': return '#9cde9f';      // celadon
        case 'Minor': return '#f1dede';      // soft-blush
        case 'Diminished': return '#782628'; // bitter-chocolate
        case 'Augmented': return '#d4a574';  // warm gold
    }
}

/** Get difficulty color for UI */
export function getDifficultyColor(difficulty: Difficulty): string {
    switch (difficulty) {
        case 'beginner': return '#9cde9f';
        case 'intermediate': return '#f5c542';
        case 'advanced': return '#e06c75';
    }
}

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
    const totalSemitones = startIndex + semitones;

    const octaveChange = Math.floor(totalSemitones / 12);
    const newIndex = ((totalSemitones % 12) + 12) % 12;

    return {
        name: NOTES[newIndex],
        octave: startNote.octave + octaveChange
    };
}
