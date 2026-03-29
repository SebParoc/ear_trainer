import React, { useState, useEffect, useCallback } from 'react';
import { Play, Check, X, Volume2, Music2, Flame, RotateCcw, Lightbulb } from 'lucide-react';
import { getIntervalNote, getIntervalColor, type Note, type Interval, type NoteName, INTERVALS, NOTES } from '../core/theory';
import { playNote, playInterval, playDuckSound, playHappyDuckSound, playStreakSound } from '../core/audio';
import Piano from './Piano';

interface QuizProps {
    language: 'anglo' | 'italian';
    selectedIntervals: number[];
    pianoMode: boolean;
    highlightFirstNote: boolean;
    selectedStartNote: NoteName | 'Random';
    intervalDirection: 'Ascending' | 'Descending' | 'Both';
    selectedOctaves: number[];
    setHeaderCenter: (node: React.ReactNode) => void;
    duckSoundEnabled: boolean;
}

type GameState = 'waiting' | 'playing' | 'success' | 'error';

const Quiz: React.FC<QuizProps> = ({
    language,
    selectedIntervals,
    pianoMode,
    highlightFirstNote,
    selectedStartNote,
    intervalDirection,
    selectedOctaves,
    setHeaderCenter,
    duckSoundEnabled
}) => {
    const [currentStartNote, setCurrentStartNote] = useState<Note | null>(null);
    const [currentInterval, setCurrentInterval] = useState<Interval | null>(null);
    const [currentDirection, setCurrentDirection] = useState<'Ascending' | 'Descending'>('Ascending');
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [wrongButton, setWrongButton] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Session stats
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [streakMilestone, setStreakMilestone] = useState(false);

    const playSequence = useCallback((startNote: Note, interval: Interval, direction: 'Ascending' | 'Descending') => {
        if (isPlaying) return;

        setIsPlaying(true);
        const semitones = direction === 'Ascending' ? interval.semitones : -interval.semitones;
        const endNote = getIntervalNote(startNote, semitones);
        playInterval(startNote, endNote);

        setTimeout(() => {
            setIsPlaying(false);
        }, 2000);
    }, [isPlaying]);

    const generateQuestion = useCallback(() => {
        const availableIntervals = INTERVALS.filter(i => selectedIntervals.includes(i.semitones));
        if (availableIntervals.length === 0) return;

        let valid = false;
        let attempts = 0;
        let startNote: Note | null = null;
        let interval: Interval | null = null;
        let direction: 'Ascending' | 'Descending' = 'Ascending';

        if (intervalDirection === 'Both') {
            direction = Math.random() < 0.5 ? 'Ascending' : 'Descending';
        } else {
            direction = intervalDirection;
        }

        while (!valid && attempts < 50) {
            if (selectedStartNote === 'Random') {
                const octave = selectedOctaves[Math.floor(Math.random() * selectedOctaves.length)];
                startNote = { name: NOTES[Math.floor(Math.random() * NOTES.length)], octave };
            } else {
                const octave = selectedOctaves[Math.floor(Math.random() * selectedOctaves.length)];
                startNote = { name: selectedStartNote, octave };
            }

            interval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];

            const semitones = direction === 'Ascending' ? interval.semitones : -interval.semitones;
            const endNote = getIntervalNote(startNote, semitones);

            const startValue = startNote.octave * 12 + NOTES.indexOf(startNote.name);
            const endValue = endNote.octave * 12 + NOTES.indexOf(endNote.name);

            const minValue = 2 * 12 + NOTES.indexOf("C");
            const maxValue = 5 * 12 + NOTES.indexOf("B");

            const isStartInOctave = selectedOctaves.includes(startNote.octave);

            if (startValue >= minValue && startValue <= maxValue && endValue >= minValue && endValue <= maxValue && isStartInOctave) {
                valid = true;
            }
            attempts++;
        }

        if (!valid || !startNote || !interval) return;

        setCurrentStartNote(startNote);
        setCurrentInterval(interval);
        setCurrentDirection(direction);
        setGameState('waiting');
        setShowHint(false);

        if (hasInteracted) {
            playSequence(startNote, interval, direction);
        }
    }, [selectedIntervals, selectedStartNote, intervalDirection, hasInteracted, selectedOctaves, playSequence]);

    useEffect(() => {
        if (!currentStartNote && selectedIntervals.length > 0) {
            generateQuestion();
        }
    }, [generateQuestion, currentStartNote, selectedIntervals.length]);

    const handlePlay = useCallback(async () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            await import('../core/audio').then(m => m.initAudio());
        }

        if (currentStartNote && currentInterval && !isPlaying) {
            playSequence(currentStartNote, currentInterval, currentDirection);
        }
    }, [hasInteracted, currentStartNote, currentInterval, isPlaying, playSequence, currentDirection]);

    // Keyboard shortcuts for quiz mode
    useEffect(() => {
        if (pianoMode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            // Space to replay
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlay();
                return;
            }

            // Number keys to select intervals
            const availableIntervals = INTERVALS.filter(i => selectedIntervals.includes(i.semitones));
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= availableIntervals.length) {
                const interval = availableIntervals[keyNum - 1];
                if (interval && gameState === 'waiting') {
                    handleGuess(interval);
                }
            }

            // H for hint
            if (e.key === 'h' || e.key === 'H') {
                setShowHint(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pianoMode, handlePlay, selectedIntervals, gameState, currentInterval, currentStartNote, isPlaying, currentDirection]);

    // Header Portal Effect
    useEffect(() => {
        if (pianoMode) {
            setHeaderCenter(
                <div className="flex items-center gap-3">
                    {/* Streak display in header */}
                    {streak > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-warm-gold/20 to-bitter-chocolate/20 border border-warm-gold/30">
                            <Flame className="w-3.5 h-3.5 text-warm-gold" />
                            <span className="text-sm font-bold text-warm-gold">{streak}</span>
                        </div>
                    )}
                    <button
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className={`
                            relative rounded-full bg-gradient-to-br from-bitter-chocolate via-cool-steel to-charcoal-blue flex items-center justify-center
                            shadow-lg border-2 border-white/30 hover:border-white/50
                            active:scale-95 transition-all duration-300 group overflow-hidden transform-gpu
                            w-10 h-10
                            ${isPlaying ? 'opacity-80 cursor-wait animate-pulse-ring' : ''}
                        `}
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-soft-blush/20 to-transparent group-hover:animate-spin-slow" />
                        {isPlaying ? (
                            <Volume2 className="w-5 h-5 text-soft-blush animate-pulse relative z-10" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5 text-soft-blush fill-soft-blush relative z-10" />
                        )}
                    </button>
                </div>
            );
        } else {
            setHeaderCenter(null);
        }
        return () => setHeaderCenter(null);
    }, [pianoMode, isPlaying, handlePlay, setHeaderCenter, streak]);

    const handleGuess = (interval: Interval) => {
        if (!currentInterval || !currentStartNote || isPlaying || gameState !== 'waiting') return;

        if (interval.semitones === currentInterval.semitones) {
            handleSuccess();
        } else {
            handleError(interval.semitones);
        }
    };

    const handlePianoGuess = (note: Note) => {
        if (!currentInterval || !currentStartNote || isPlaying || gameState !== 'waiting') return;

        const semitones = currentDirection === 'Ascending' ? currentInterval.semitones : -currentInterval.semitones;
        const targetNote = getIntervalNote(currentStartNote, semitones);

        if (note.name === targetNote.name && note.octave === targetNote.octave) {
            handleSuccess();
        } else {
            if (note.name === currentStartNote.name && note.octave === currentStartNote.octave) {
                return;
            }
            handleError();
        }
    };

    const handleSuccess = () => {
        setGameState('success');
        const newStreak = streak + 1;
        setStreak(newStreak);
        setTotalCorrect(prev => prev + 1);
        setTotalAttempts(prev => prev + 1);

        if (newStreak > bestStreak) {
            setBestStreak(newStreak);
        }

        // Streak milestones at 5, 10, 15, etc.
        if (newStreak > 0 && newStreak % 5 === 0) {
            setStreakMilestone(true);
            playStreakSound();
            setTimeout(() => setStreakMilestone(false), 1500);
        } else if (duckSoundEnabled) {
            playHappyDuckSound();
        }

        if (currentStartNote && currentInterval) {
            const semitones = currentDirection === 'Ascending' ? currentInterval.semitones : -currentInterval.semitones;
            const endNote = getIntervalNote(currentStartNote, semitones);
            playNote(endNote);
        }
        setTimeout(() => generateQuestion(), 1200);
    };

    const handleError = (intervalSemitones?: number) => {
        setGameState('error');
        setStreak(0);
        setTotalAttempts(prev => prev + 1);

        if (duckSoundEnabled) {
            playDuckSound();
        }
        if (intervalSemitones) {
            setWrongButton(intervalSemitones);
            setTimeout(() => setWrongButton(null), 500);
        }
        setTimeout(() => setGameState('waiting'), 800);
    };

    const getPianoHighlights = () => {
        if (!currentStartNote) return [];
        const highlights = [];

        if (pianoMode || highlightFirstNote || gameState === 'success') {
            highlights.push(currentStartNote);
        }

        if (gameState === 'success' && currentInterval) {
            const semitones = currentDirection === 'Ascending' ? currentInterval.semitones : -currentInterval.semitones;
            highlights.push(getIntervalNote(currentStartNote, semitones));
        }
        return highlights;
    };

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    if (selectedIntervals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
                <div className="bg-gradient-to-br from-charcoal-blue/40 to-ink-black/60 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/20 p-12 max-w-md">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-slate-grey/20 blur-2xl rounded-full" />
                        <div className="relative bg-gradient-to-br from-slate-grey/30 to-cool-steel/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto border border-slate-grey/30">
                            <Music2 className="w-12 h-12 text-slate-grey" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-soft-blush mb-3">Nessun Intervallo Selezionato</h3>
                    <p className="text-slate-grey text-base leading-relaxed">
                        Seleziona almeno un intervallo nelle impostazioni per iniziare il tuo allenamento musicale.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full mx-auto flex flex-col items-center pb-8 ${pianoMode ? 'max-w-full h-[calc(100vh-85px)] lg:max-h-[500px] justify-center px-0' : 'max-w-5xl px-4'}`}>
            {/* Piano Display */}
            {pianoMode && (
                <div className="w-full h-full flex flex-col justify-center relative">
                    <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 p-2 rounded-3xl backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/20 h-full flex items-center">
                        <Piano
                            startOctave={currentStartNote?.octave || 3}
                            highlightNotes={getPianoHighlights()}
                            language={language}
                            onNoteClick={(note) => handlePianoGuess(note)}
                            scrollAlignment={currentDirection === 'Ascending' ? 'left' : 'right'}
                            visibleOctaves={(() => {
                                const octaves = new Set(selectedOctaves);
                                if (currentStartNote) {
                                    octaves.add(currentStartNote.octave);
                                }
                                if (currentStartNote && currentInterval) {
                                    const semitones = currentDirection === 'Ascending' ? currentInterval.semitones : -currentInterval.semitones;
                                    const endNote = getIntervalNote(currentStartNote, semitones);
                                    octaves.add(endNote.octave);
                                }
                                return Array.from(octaves).sort((a, b) => a - b);
                            })()}
                            disabled={gameState !== 'waiting' || isPlaying}
                            highlightState={gameState === 'success' ? 'success' : gameState === 'error' ? 'error' : 'neutral'}
                        />
                    </div>

                    {/* Piano Mode Feedback Overlay */}
                    <div className={`absolute inset-0 flex justify-center items-center pointer-events-none transition-all duration-300 z-50 ${gameState === 'success' || gameState === 'error' ? 'opacity-100' : 'opacity-0'}`}>
                        {gameState === 'success' && duckSoundEnabled && (
                            <div className="flex flex-col items-center animate-scale-in">
                                <img src="/images/corretto.png" alt="Corretto" className="h-48 w-auto max-w-none drop-shadow-2xl animate-bounce-short" />
                                <div className="mt-2 px-4 py-1 bg-charcoal-blue/80 backdrop-blur-md rounded-full border border-celadon/30 shadow-lg animate-fade-in-up">
                                    <span className="text-lg font-bold text-celadon tracking-wide">
                                        {currentInterval?.name[language]}
                                    </span>
                                </div>
                            </div>
                        )}
                        {gameState === 'success' && !duckSoundEnabled && (
                            <div className="flex flex-col items-center animate-scale-in">
                                <div className="px-6 py-2 bg-charcoal-blue/90 backdrop-blur-md rounded-full border border-celadon/50 shadow-[0_0_30px_rgba(156,222,159,0.3)]">
                                    <span className="text-xl font-bold text-celadon tracking-wide">
                                        {currentInterval?.name[language]}
                                    </span>
                                </div>
                            </div>
                        )}
                        {gameState === 'error' && duckSoundEnabled && (
                            <img src="/images/incorretto.png" alt="Incorretto" className="h-48 w-auto max-w-none drop-shadow-2xl shake" />
                        )}
                    </div>

                    {/* Streak Milestone Overlay */}
                    {streakMilestone && (
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-[60]">
                            <div className="animate-streak-pop flex flex-col items-center">
                                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-warm-gold/90 to-bitter-chocolate/90 backdrop-blur-md rounded-2xl border border-warm-gold/50 shadow-[0_0_40px_rgba(212,165,116,0.5)]">
                                    <Flame className="w-7 h-7 text-white" />
                                    <span className="text-2xl font-black text-white">{streak} STREAK!</span>
                                    <Flame className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content Card (Quiz Mode) */}
            {!pianoMode && (
                <div className="w-full max-w-2xl animate-fade-in">
                    {/* Stats Bar */}
                    {totalAttempts > 0 && (
                        <div className="flex items-center justify-between mb-4 px-1 animate-fade-in-down">
                            <div className="flex items-center gap-4">
                                {/* Streak */}
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${streak > 0 ? 'bg-gradient-to-r from-warm-gold/20 to-bitter-chocolate/20 border border-warm-gold/30' : 'bg-charcoal-blue/30 border border-cool-steel/10'}`}>
                                    <Flame className={`w-4 h-4 transition-colors ${streak > 0 ? 'text-warm-gold' : 'text-slate-grey/50'}`} />
                                    <span className={`text-sm font-bold ${streak > 0 ? 'text-warm-gold' : 'text-slate-grey/50'}`}>
                                        {streak}
                                    </span>
                                </div>

                                {/* Best */}
                                {bestStreak > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-slate-grey/60">
                                        <span className="uppercase tracking-wider font-medium">Best</span>
                                        <span className="font-bold text-cool-steel/70">{bestStreak}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Accuracy */}
                                <div className="text-xs text-slate-grey/60">
                                    <span className="font-bold text-soft-blush/70">{accuracy}%</span>
                                    <span className="ml-1 uppercase tracking-wider font-medium">
                                        ({totalCorrect}/{totalAttempts})
                                    </span>
                                </div>

                                {/* Reset */}
                                <button
                                    onClick={() => { setStreak(0); setBestStreak(0); setTotalCorrect(0); setTotalAttempts(0); }}
                                    className="p-1 rounded-lg hover:bg-charcoal-blue/30 text-slate-grey/40 hover:text-slate-grey/70 transition-all"
                                    title="Resetta statistiche"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-charcoal-blue/40 to-ink-black/60 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/20 p-6">

                        {/* Play Button Area */}
                        <div className="flex flex-col items-center mb-5">
                            <div className="relative">
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-cool-steel/40 via-celadon/30 to-cool-steel/40 blur-3xl rounded-full scale-125 transition-opacity duration-500 ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-60'}`} />

                                <button
                                    onClick={handlePlay}
                                    disabled={isPlaying}
                                    className={`
                                        relative rounded-full bg-gradient-to-br from-bitter-chocolate via-cool-steel to-charcoal-blue flex items-center justify-center
                                        shadow-[0_20px_60px_-10px_rgba(120,38,40,0.8)] border-4 border-white/30 hover:border-white/50
                                        active:scale-95 transition-all duration-300 group overflow-hidden transform-gpu
                                        w-20 h-20
                                        ${isPlaying ? 'opacity-80 cursor-wait animate-pulse-ring' : 'hover:shadow-[0_25px_70px_-10px_rgba(120,38,40,0.9)] hover:scale-105'}
                                    `}
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-soft-blush/20 to-transparent group-hover:animate-spin-slow" />
                                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cool-steel/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {isPlaying ? (
                                        <Volume2 className="w-8 h-8 text-soft-blush animate-pulse relative z-10 drop-shadow-[0_0_10px_rgba(241,222,222,0.5)]" />
                                    ) : (
                                        <Play className="w-8 h-8 ml-1 text-soft-blush fill-soft-blush relative z-10 drop-shadow-[0_0_10px_rgba(241,222,222,0.5)]" />
                                    )}
                                </button>

                                {/* Quiz Mode Feedback Overlay */}
                                <div className={`absolute inset-0 flex justify-center items-center pointer-events-none transition-all duration-300 z-50 ${gameState === 'success' || gameState === 'error' ? 'opacity-100' : 'opacity-0'}`}>
                                    {gameState === 'success' && duckSoundEnabled && (
                                        <img src="/images/corretto.png" alt="Corretto" className="h-40 w-auto max-w-none drop-shadow-2xl animate-bounce-short" />
                                    )}
                                    {gameState === 'error' && duckSoundEnabled && (
                                        <img src="/images/incorretto.png" alt="Incorretto" className="h-40 w-auto max-w-none drop-shadow-2xl shake" />
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cool-steel/50" />
                                <p className="text-center text-soft-blush/80 text-xs font-bold tracking-[0.3em] uppercase">
                                    {!hasInteracted ? 'Inizia' : 'Ascolta'}
                                </p>
                                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cool-steel/50" />
                            </div>

                            {/* Direction indicator */}
                            {currentDirection && hasInteracted && (
                                <div className="mt-2 text-xs text-slate-grey/50 font-medium tracking-wide">
                                    {currentDirection === 'Ascending' ? '\u2191 Ascendente' : '\u2193 Discendente'}
                                </div>
                            )}
                        </div>

                        {/* Streak Milestone */}
                        {streakMilestone && (
                            <div className="flex justify-center mb-4">
                                <div className="animate-streak-pop flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-warm-gold/20 to-bitter-chocolate/20 rounded-2xl border border-warm-gold/40">
                                    <Flame className="w-5 h-5 text-warm-gold" />
                                    <span className="text-lg font-black text-warm-gold">{streak} STREAK!</span>
                                    <Flame className="w-5 h-5 text-warm-gold" />
                                </div>
                            </div>
                        )}

                        {/* Answer Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {INTERVALS.filter(i => selectedIntervals.includes(i.semitones)).map((interval, idx) => {
                                const isCorrect = gameState === 'success' && currentInterval?.semitones === interval.semitones;
                                const isWrong = wrongButton === interval.semitones;
                                const qualityColor = getIntervalColor(interval.type);

                                return (
                                    <button
                                        key={interval.semitones}
                                        onClick={() => handleGuess(interval)}
                                        disabled={gameState === 'success'}
                                        className={`
                                            relative h-14 rounded-xl transition-all duration-200
                                            flex items-center justify-center overflow-hidden group
                                            ${isCorrect
                                                ? 'bg-celadon shadow-[0_10px_40px_rgba(156,222,159,0.5)] border-2 border-celadon/50 scale-105'
                                                : isWrong
                                                    ? 'bg-bitter-chocolate shadow-[0_10px_40px_rgba(120,38,40,0.6)] border-2 border-bitter-chocolate scale-95 shake'
                                                    : `bg-charcoal-blue hover:bg-charcoal-blue/80 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] border-2 border-soft-blush/10 hover:border-soft-blush/30 hover:shadow-[0_10px_40px_-10px_rgba(119,160,169,0.3)] hover:scale-[1.03] active:scale-[0.98]`}
                                            disabled:opacity-80 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {/* Interval quality accent */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-60"
                                            style={{ backgroundColor: qualityColor }}
                                        />

                                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-soft-blush/10 to-transparent pointer-events-none" />

                                        {/* Keyboard shortcut hint */}
                                        <span className="absolute top-1.5 left-3 text-[10px] text-soft-blush/20 font-mono">
                                            {idx + 1}
                                        </span>

                                        <span className={`relative z-10 font-bold text-base text-center leading-tight px-2 transition-all ${isCorrect ? 'text-charcoal-blue text-lg' : 'text-soft-blush'}`}>
                                            {interval.name[language]}
                                        </span>

                                        {/* Hint text under interval name */}
                                        {showHint && !isCorrect && !isWrong && (
                                            <span className="absolute bottom-1 text-[9px] text-slate-grey/50 font-medium">
                                                {interval.shortName}
                                            </span>
                                        )}

                                        {isCorrect && (
                                            <div className="absolute top-2 right-2 bg-charcoal-blue/30 rounded-full p-0.5">
                                                <Check className="w-4 h-4 text-charcoal-blue" />
                                            </div>
                                        )}

                                        {isWrong && (
                                            <div className="absolute top-2 right-2 bg-soft-blush/30 rounded-full p-0.5">
                                                <X className="w-4 h-4 text-soft-blush" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Hint toggle & keyboard shortcuts info */}
                        <div className="mt-4 flex items-center justify-between px-1">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className={`flex items-center gap-1.5 text-xs transition-all duration-200 px-2.5 py-1 rounded-lg ${showHint ? 'text-warm-gold bg-warm-gold/10 border border-warm-gold/20' : 'text-slate-grey/40 hover:text-slate-grey/60'}`}
                            >
                                <Lightbulb className="w-3 h-3" />
                                <span className="font-medium">Suggerimenti</span>
                            </button>
                            <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-grey/30">
                                <span><kbd className="px-1 py-0.5 rounded bg-charcoal-blue/40 font-mono">Spazio</kbd> Riascolta</span>
                                <span><kbd className="px-1 py-0.5 rounded bg-charcoal-blue/40 font-mono">1-9</kbd> Rispondi</span>
                                <span><kbd className="px-1 py-0.5 rounded bg-charcoal-blue/40 font-mono">H</kbd> Hint</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
