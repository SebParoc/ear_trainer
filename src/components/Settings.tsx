import React from 'react';
import { INTERVALS, NOTES, type NoteName, getNoteName } from '../core/theory';
import { Check, Music, ArrowUpRight, Languages } from 'lucide-react';

interface SettingsProps {
    language: 'anglo' | 'italian';
    setLanguage: (lang: 'anglo' | 'italian') => void;
    selectedIntervals: number[];
    setSelectedIntervals: (intervals: number[]) => void;
    pianoMode: boolean;
    setPianoMode: (enabled: boolean) => void;
    highlightFirstNote: boolean;
    setHighlightFirstNote: (enabled: boolean) => void;
    selectedStartNote: NoteName | 'Random';
    setSelectedStartNote: (note: NoteName | 'Random') => void;
    intervalDirection: 'Ascending' | 'Descending' | 'Both';
    setIntervalDirection: (dir: 'Ascending' | 'Descending' | 'Both') => void;
    selectedOctaves: number[];
    setSelectedOctaves: (octaves: number[]) => void;
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
    language,
    setLanguage,
    selectedIntervals,
    setSelectedIntervals,
    pianoMode,
    setPianoMode,
    selectedStartNote,
    setSelectedStartNote,
    intervalDirection,
    setIntervalDirection,
    selectedOctaves,
    setSelectedOctaves,
    onClose
}) => {
    const toggleInterval = (semitones: number) => {
        if (selectedIntervals.includes(semitones)) {
            if (selectedIntervals.length > 1) {
                setSelectedIntervals(selectedIntervals.filter(i => i !== semitones));
            }
        } else {
            setSelectedIntervals([...selectedIntervals, semitones]);
        }
    };

    const toggleOctave = (octave: number) => {
        if (selectedOctaves.includes(octave)) {
            if (selectedOctaves.length > 1) {
                setSelectedOctaves(selectedOctaves.filter(o => o !== octave).sort((a, b) => a - b));
            }
        } else {
            setSelectedOctaves([...selectedOctaves, octave].sort((a, b) => a - b));
        }
    };

    const toggleAll = () => {
        if (selectedIntervals.length === INTERVALS.length) {
            setSelectedIntervals([]);
        } else {
            setSelectedIntervals(INTERVALS.map(i => i.semitones));
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto pb-10 px-4 animate-fade-in-up">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold text-soft-blush drop-shadow-lg mb-2">
                    Impostazioni
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-cool-steel/50" />
                    <p className="text-slate-grey text-sm">Personalizza il tuo ear training</p>
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-cool-steel/50" />
                </div>
            </div>

            {/* Piano Mode Card */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-cool-steel/20">
                        <Music className="w-5 h-5 text-cool-steel" />
                    </div>
                    <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Visualizzazione</h3>
                </div>

                <div className="space-y-6">
                    <div
                        className="flex items-center justify-between cursor-pointer p-4 rounded-2xl bg-ink-black/20 hover:bg-ink-black/40 transition-all duration-200 border border-cool-steel/10"
                        onClick={() => {
                            const newPianoMode = !pianoMode;
                            setPianoMode(newPianoMode);
                            // If enabling piano mode, automatically close settings
                            if (newPianoMode) {
                                setTimeout(() => onClose(), 300);
                            }
                        }}
                    >
                        <div className="flex-1">
                            <div className="font-semibold text-lg text-soft-blush mb-1">Pianoforte Interattivo</div>
                            <div className="text-sm text-slate-grey">Suona la risposta direttamente sulla tastiera</div>
                        </div>
                        <div className={`relative w-16 h-9 rounded-full transition-all duration-300 ${pianoMode ? 'bg-gradient-to-r from-celadon to-celadon/80 shadow-[0_0_20px_rgba(156,222,159,0.4)]' : 'bg-rosy-granite/50'}`}>
                            <div className={`absolute top-1 left-1 w-7 h-7 bg-soft-blush rounded-full transition-all duration-300 shadow-lg ${pianoMode ? 'translate-x-7' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Selection Card */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-soft-blush/20">
                        <Languages className="w-5 h-5 text-soft-blush" />
                    </div>
                    <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Sistema di Notazione</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setLanguage('anglo')}
                        className={`
                            py-4 rounded-xl font-medium text-base transition-all duration-200
                            ${language === 'anglo'
                                ? 'bg-celadon text-charcoal-blue shadow-lg scale-105 font-bold'
                                : 'bg-charcoal-blue text-soft-blush hover:bg-cool-steel/20 border border-cool-steel/20'}
                        `}
                    >
                        <div className="font-bold mb-1">Anglo-Americano</div>
                        <div className="text-xs opacity-70">C, D, E, F, G, A, B</div>
                    </button>
                    <button
                        onClick={() => setLanguage('italian')}
                        className={`
                            py-4 rounded-xl font-medium text-base transition-all duration-200
                            ${language === 'italian'
                                ? 'bg-celadon text-charcoal-blue shadow-lg scale-105 font-bold'
                                : 'bg-charcoal-blue text-soft-blush hover:bg-cool-steel/20 border border-cool-steel/20'}
                        `}
                    >
                        <div className="font-bold mb-1">Italiano</div>
                        <div className="text-xs opacity-70">Do, Re, Mi, Fa, Sol, La, Si</div>
                    </button>
                </div>
            </div>

            {/* Start Note Card */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-soft-blush/20">
                        <Music className="w-5 h-5 text-soft-blush" />
                    </div>
                    <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Nota di Partenza</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {(['Random', ...NOTES] as const).map((note) => (
                        <button
                            key={note}
                            onClick={() => setSelectedStartNote(note)}
                            className={`
                py-2 rounded-xl font-medium text-sm transition-all duration-200
                ${selectedStartNote === note
                                    ? 'bg-celadon text-charcoal-blue shadow-lg scale-105 font-bold'
                                    : 'bg-charcoal-blue text-soft-blush hover:bg-cool-steel/20 border border-cool-steel/20'}
              `}
                        >
                            {note === 'Random' ? 'Random' : getNoteName(note, language)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Octave Selection Card */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-soft-blush/20">
                        <Music className="w-5 h-5 text-soft-blush" />
                    </div>
                    <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Ottave Attive</h3>
                </div>

                <div className="flex gap-3 justify-center">
                    {[2, 3, 4, 5].map((octave) => {
                        const isSelected = selectedOctaves.includes(octave);
                        return (
                            <button
                                key={octave}
                                onClick={() => toggleOctave(octave)}
                                className={`
                                    w-16 h-16 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center
                                    ${isSelected
                                        ? 'bg-celadon text-charcoal-blue shadow-lg scale-105'
                                        : 'bg-charcoal-blue text-soft-blush hover:bg-cool-steel/20 border border-cool-steel/20'}
                                `}
                            >
                                {octave}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Interval Direction */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-celadon/20">
                        <ArrowUpRight className="w-5 h-5 text-celadon" />
                    </div>
                    <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Direzione Intervalli</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {(['Ascending', 'Descending', 'Both'] as const).map((dir) => (
                        <button
                            key={dir}
                            onClick={() => setIntervalDirection(dir)}
                            className={`
                py-2 rounded-xl font-medium text-sm transition-all duration-200
                ${intervalDirection === dir
                                    ? 'bg-celadon text-charcoal-blue shadow-lg scale-105 font-bold'
                                    : 'bg-charcoal-blue text-soft-blush hover:bg-cool-steel/20 border border-cool-steel/20'}
              `}
                        >
                            {dir === 'Ascending' ? 'Ascendenti' : dir === 'Descending' ? 'Discendenti' : 'Entrambi'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Intervals Card */}
            <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/30">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-celadon/20">
                            <Check className="w-5 h-5 text-celadon" />
                        </div>
                        <h3 className="text-sm font-bold text-cool-steel uppercase tracking-widest">Intervalli</h3>
                    </div>
                    <button
                        onClick={toggleAll}
                        className="relative text-xs font-bold text-celadon hover:text-soft-blush uppercase tracking-wider px-4 py-2 rounded-xl bg-celadon/10 hover:bg-celadon/20 transition-all duration-200 border border-celadon/30 hover:border-celadon/50 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-celadon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">
                            {selectedIntervals.length === INTERVALS.length ? 'Deseleziona' : 'Tutti'}
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {INTERVALS.map(interval => {
                        const isSelected = selectedIntervals.includes(interval.semitones);
                        return (
                            <button
                                key={interval.semitones}
                                onClick={() => toggleInterval(interval.semitones)}
                                className={`
                  relative w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-200 border overflow-hidden group
                  ${isSelected
                                        ? 'bg-gradient-to-r from-cool-steel/30 to-bitter-chocolate/20 border-cool-steel/50 shadow-[0_4px_20px_rgba(119,160,169,0.2)]'
                                        : 'bg-ink-black/20 border-rosy-granite/20 hover:bg-ink-black/40 hover:border-rosy-granite/40'}
                `}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-soft-blush/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <span className={`font-semibold text-base relative z-10 transition-all ${isSelected ? 'text-soft-blush' : 'text-slate-grey group-hover:text-soft-blush/80'}`}>
                                    {interval.name[language]}
                                </span>
                                <div className={`
                  relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${isSelected ? 'bg-cool-steel border-cool-steel scale-110 shadow-[0_0_15px_rgba(119,160,169,0.5)]' : 'border-rosy-granite group-hover:border-cool-steel/50'}
                `}>
                                    {isSelected && <Check className="w-5 h-5 text-charcoal-blue" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Settings;
