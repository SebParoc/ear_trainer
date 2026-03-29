import React from 'react';
import { INTERVALS, NOTES, type NoteName, getNoteName, getIntervalColor } from '../core/theory';
import { Check, Music, ArrowUpRight, Languages, Lightbulb } from 'lucide-react';

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
    duckSoundEnabled: boolean;
    setDuckSoundEnabled: (enabled: boolean) => void;
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
    duckSoundEnabled,
    setDuckSoundEnabled,
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

    const toggleCategory = (type: 'Major' | 'Minor' | 'Augmented') => {
        const intervalsToToggle = INTERVALS.filter(i => {
            if (type === 'Major') return i.type === 'Major' || i.type === 'Perfect';
            if (type === 'Minor') return i.type === 'Minor';
            return i.type === 'Augmented';
        }).map(i => i.semitones);

        const allSelected = intervalsToToggle.every(i => selectedIntervals.includes(i));

        if (allSelected) {
            setSelectedIntervals(selectedIntervals.filter(i => !intervalsToToggle.includes(i)));
        } else {
            const newSelection = new Set([...selectedIntervals, ...intervalsToToggle]);
            setSelectedIntervals(Array.from(newSelection).sort((a, b) => a - b));
        }
    };

    const toggleAll = () => {
        if (selectedIntervals.length === INTERVALS.length) {
            setSelectedIntervals([]);
        } else {
            setSelectedIntervals(INTERVALS.map(i => i.semitones));
        }
    };

    const isCategorySelected = (type: 'Major' | 'Minor' | 'Augmented') => {
        const categoryIntervals = INTERVALS.filter(i => {
            if (type === 'Major') return i.type === 'Major' || i.type === 'Perfect';
            if (type === 'Minor') return i.type === 'Minor';
            return i.type === 'Augmented';
        }).map(i => i.semitones);
        return categoryIntervals.every(i => selectedIntervals.includes(i));
    };

    const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
        <div className={`bg-gradient-to-br from-charcoal-blue/50 to-ink-black/70 backdrop-blur-xl rounded-2xl p-6 mb-4 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.4)] border border-cool-steel/15 ${className}`}>
            {children}
        </div>
    );

    const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
        <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-lg bg-cool-steel/15">
                {icon}
            </div>
            <h3 className="text-xs font-bold text-cool-steel/80 uppercase tracking-[0.15em]">{label}</h3>
        </div>
    );

    const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: () => void; label: string; description: string }) => (
        <div
            className="flex items-center justify-between cursor-pointer p-4 rounded-xl bg-ink-black/20 hover:bg-ink-black/35 transition-all duration-200 border border-cool-steel/8"
            onClick={onChange}
        >
            <div className="flex-1">
                <div className="font-semibold text-base text-soft-blush mb-0.5">{label}</div>
                <div className="text-sm text-slate-grey/70">{description}</div>
            </div>
            <div className={`relative w-14 h-8 rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-celadon to-celadon/80 shadow-[0_0_15px_rgba(156,222,159,0.3)]' : 'bg-rosy-granite/40'}`}>
                <div className={`absolute top-1 left-1 w-6 h-6 bg-soft-blush rounded-full transition-all duration-300 shadow-md ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-3xl mx-auto pb-10 px-4 animate-fade-in">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-soft-blush mb-1.5">
                    Impostazioni
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-cool-steel/40" />
                    <p className="text-slate-grey/60 text-sm">Personalizza il tuo ear training</p>
                    <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-cool-steel/40" />
                </div>
            </div>

            {/* Visualization */}
            <SectionCard>
                <SectionHeader icon={<Music className="w-4 h-4 text-cool-steel" />} label="Visualizzazione" />
                <div className="space-y-3">
                    <Toggle
                        enabled={pianoMode}
                        onChange={() => {
                            const newPianoMode = !pianoMode;
                            setPianoMode(newPianoMode);
                            if (newPianoMode) {
                                setTimeout(() => onClose(), 300);
                            }
                        }}
                        label="Pianoforte Interattivo"
                        description="Suona la risposta direttamente sulla tastiera"
                    />
                    <Toggle
                        enabled={duckSoundEnabled}
                        onChange={() => setDuckSoundEnabled(!duckSoundEnabled)}
                        label="Ducky Idol"
                        description="Abilita suoni di papera e feedback visivo"
                    />
                </div>
            </SectionCard>

            {/* Language */}
            <SectionCard>
                <SectionHeader icon={<Languages className="w-4 h-4 text-soft-blush/70" />} label="Sistema di Notazione" />
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { key: 'anglo' as const, label: 'Anglo-Americano', sub: 'C, D, E, F, G, A, B' },
                        { key: 'italian' as const, label: 'Italiano', sub: 'Do, Re, Mi, Fa, Sol, La, Si' },
                    ].map(({ key, label, sub }) => (
                        <button
                            key={key}
                            onClick={() => setLanguage(key)}
                            className={`py-4 rounded-xl font-medium text-base transition-all duration-200
                                ${language === key
                                    ? 'bg-celadon text-charcoal-blue shadow-lg scale-[1.02] font-bold'
                                    : 'bg-charcoal-blue/60 text-soft-blush hover:bg-cool-steel/15 border border-cool-steel/15'}`}
                        >
                            <div className="font-bold mb-0.5">{label}</div>
                            <div className="text-xs opacity-60">{sub}</div>
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Start Note */}
            <SectionCard>
                <SectionHeader icon={<Lightbulb className="w-4 h-4 text-soft-blush/70" />} label="Nota di Partenza" />
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {(['Random', ...NOTES] as const).map((note) => (
                        <button
                            key={note}
                            onClick={() => setSelectedStartNote(note)}
                            className={`py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                                ${selectedStartNote === note
                                    ? 'bg-celadon text-charcoal-blue shadow-lg scale-[1.03] font-bold'
                                    : 'bg-charcoal-blue/60 text-soft-blush hover:bg-cool-steel/15 border border-cool-steel/15'}
                                ${note === 'Random' ? 'col-span-2 sm:col-span-1' : ''}`}
                        >
                            {note === 'Random' ? 'Random' : getNoteName(note, language)}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Octaves */}
            <SectionCard>
                <SectionHeader icon={<Music className="w-4 h-4 text-soft-blush/70" />} label="Ottave Attive" />
                <div className="flex gap-3 justify-center">
                    {[2, 3, 4, 5].map((octave) => {
                        const isSelected = selectedOctaves.includes(octave);
                        return (
                            <button
                                key={octave}
                                onClick={() => toggleOctave(octave)}
                                className={`w-14 h-14 rounded-xl font-bold text-xl transition-all duration-200 flex items-center justify-center
                                    ${isSelected
                                        ? 'bg-celadon text-charcoal-blue shadow-lg scale-[1.05]'
                                        : 'bg-charcoal-blue/60 text-soft-blush hover:bg-cool-steel/15 border border-cool-steel/15'}`}
                            >
                                {octave}
                            </button>
                        );
                    })}
                </div>
            </SectionCard>

            {/* Direction */}
            <SectionCard>
                <SectionHeader icon={<ArrowUpRight className="w-4 h-4 text-celadon/70" />} label="Direzione Intervalli" />
                <div className="grid grid-cols-3 gap-2">
                    {([
                        { key: 'Ascending' as const, label: 'Ascendenti', icon: '\u2191' },
                        { key: 'Descending' as const, label: 'Discendenti', icon: '\u2193' },
                        { key: 'Both' as const, label: 'Entrambi', icon: '\u2195' },
                    ]).map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setIntervalDirection(key)}
                            className={`py-3 rounded-xl font-medium text-sm transition-all duration-200
                                ${intervalDirection === key
                                    ? 'bg-celadon text-charcoal-blue shadow-lg scale-[1.02] font-bold'
                                    : 'bg-charcoal-blue/60 text-soft-blush hover:bg-cool-steel/15 border border-cool-steel/15'}`}
                        >
                            <span className="text-lg mr-1">{icon}</span> {label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Intervals */}
            <SectionCard>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
                    <SectionHeader icon={<Check className="w-4 h-4 text-celadon/70" />} label="Intervalli" />
                    <button
                        onClick={toggleAll}
                        className="text-xs font-bold text-celadon hover:text-soft-blush uppercase tracking-wider px-3 py-1.5 rounded-lg bg-celadon/10 hover:bg-celadon/20 transition-all duration-200 border border-celadon/20 hover:border-celadon/40"
                    >
                        {selectedIntervals.length === INTERVALS.length ? 'Deseleziona' : 'Tutti'}
                    </button>
                </div>

                {/* Category Toggles */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                        { key: 'Major' as const, label: 'Maggiori/\nGiusti' },
                        { key: 'Minor' as const, label: 'Minori' },
                        { key: 'Augmented' as const, label: 'Tritono' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => toggleCategory(key)}
                            className={`py-3 px-2 rounded-xl border transition-all duration-200 text-xs sm:text-sm font-medium leading-tight whitespace-pre-line
                                ${isCategorySelected(key)
                                    ? 'bg-celadon text-charcoal-blue border-celadon shadow-lg font-bold'
                                    : 'bg-ink-black/20 hover:bg-ink-black/35 border-cool-steel/15 hover:border-cool-steel/30 text-cool-steel hover:text-soft-blush'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {INTERVALS.map(interval => {
                        const isSelected = selectedIntervals.includes(interval.semitones);
                        const qualityColor = getIntervalColor(interval.type);
                        return (
                            <button
                                key={interval.semitones}
                                onClick={() => toggleInterval(interval.semitones)}
                                className={`relative w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 border overflow-hidden group
                                    ${isSelected
                                        ? 'bg-gradient-to-r from-cool-steel/25 to-bitter-chocolate/15 border-cool-steel/40 shadow-[0_4px_20px_rgba(119,160,169,0.15)]'
                                        : 'bg-ink-black/15 border-cool-steel/8 hover:bg-ink-black/30 hover:border-cool-steel/20'}`}
                            >
                                {/* Quality color accent */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-opacity duration-200"
                                    style={{ backgroundColor: qualityColor, opacity: isSelected ? 0.8 : 0.3 }}
                                />

                                <div className="flex items-center gap-3 ml-2">
                                    <span className={`font-semibold text-base transition-all ${isSelected ? 'text-soft-blush' : 'text-slate-grey group-hover:text-soft-blush/80'}`}>
                                        {interval.name[language]}
                                    </span>
                                    <span className="text-[10px] text-slate-grey/40 font-mono">{interval.shortName}</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                    ${isSelected ? 'bg-cool-steel border-cool-steel scale-110 shadow-[0_0_10px_rgba(119,160,169,0.4)]' : 'border-rosy-granite/40 group-hover:border-cool-steel/40'}`}>
                                    {isSelected && <Check className="w-4 h-4 text-charcoal-blue" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </SectionCard>
        </div>
    );
};

export default Settings;
