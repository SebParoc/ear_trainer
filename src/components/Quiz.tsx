import React, { useState, useEffect, useCallback } from 'react';
import { Play, Check, X, Volume2, Music2 } from 'lucide-react';
import { getRandomNote, getIntervalNote, type Note, type Interval, type NoteName, INTERVALS } from '../core/theory';
import { playNote, playInterval, playDuckSound } from '../core/audio';
import Piano from './Piano';

interface QuizProps {
    language: 'anglo' | 'italian';
    selectedIntervals: number[];
    pianoMode: boolean;
    highlightFirstNote: boolean;
    selectedStartNote: NoteName | 'Random';
}

type GameState = 'waiting' | 'playing' | 'success' | 'error';

const Quiz: React.FC<QuizProps> = ({
    language,
    selectedIntervals,
    pianoMode,
    highlightFirstNote,
    selectedStartNote
}) => {
    const [currentStartNote, setCurrentStartNote] = useState<Note | null>(null);
    const [currentInterval, setCurrentInterval] = useState<Interval | null>(null);
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [wrongButton, setWrongButton] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [hasInteracted, setHasInteracted] = useState(false);

    const generateQuestion = useCallback(() => {
        const availableIntervals = INTERVALS.filter(i => selectedIntervals.includes(i.semitones));
        if (availableIntervals.length === 0) return;

        let valid = false;
        let attempts = 0;
        let startNote: Note | null = null;
        let interval: Interval | null = null;

        // Try to generate a valid question (both notes natural if includeSharps is false)
        while (!valid && attempts < 50) {
            if (selectedStartNote === 'Random') {
                startNote = getRandomNote(3, 4);
            } else {
                // Randomize octave only
                const octave = Math.random() < 0.5 ? 3 : 4;
                startNote = { name: selectedStartNote, octave };
            }

            interval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
            valid = true;
            attempts++;
        }

        if (!valid || !startNote || !interval) return; // Should not happen with enough attempts

        setCurrentStartNote(startNote);
        setCurrentInterval(interval);
        setGameState('waiting');

        // Auto-play the question ONLY if user has interacted
        if (hasInteracted) {
            playSequence(startNote, interval);
        }
    }, [selectedIntervals, selectedStartNote, hasInteracted]);

    const playSequence = (startNote: Note, interval: Interval) => {
        if (isPlaying) return;

        setIsPlaying(true);
        const endNote = getIntervalNote(startNote, interval.semitones);
        playInterval(startNote, endNote);

        // Block playback for 2 seconds (0.8s delay + note duration)
        setTimeout(() => {
            setIsPlaying(false);
        }, 2000);
    };

    useEffect(() => {
        if (!currentStartNote && selectedIntervals.length > 0) {
            generateQuestion();
        }
    }, [generateQuestion, currentStartNote, selectedIntervals.length]);

    const handlePlay = async () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            // Initialize audio context on first click
            await import('../core/audio').then(m => m.initAudio());
        }

        if (currentStartNote && currentInterval && !isPlaying) {
            playSequence(currentStartNote, currentInterval);
        }
    };

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

        const targetNote = getIntervalNote(currentStartNote, currentInterval.semitones);

        // Check if clicked note matches target note (name and octave)
        if (note.name === targetNote.name && note.octave === targetNote.octave) {
            handleSuccess();
        } else {
            // If it's the start note, just play it, don't count as error
            if (note.name === currentStartNote.name && note.octave === currentStartNote.octave) {
                return;
            }
            handleError();
        }
    };

    const handleSuccess = () => {
        setGameState('success');
        if (currentStartNote && currentInterval) {
            const endNote = getIntervalNote(currentStartNote, currentInterval.semitones);
            playNote(endNote);
        }
        setTimeout(() => generateQuestion(), 1500);
    };

    const handleError = (intervalSemitones?: number) => {
        setGameState('error');
        playDuckSound();
        if (intervalSemitones) {
            setWrongButton(intervalSemitones);
            setTimeout(() => setWrongButton(null), 500);
        }
        setTimeout(() => setGameState('waiting'), 800);
    };

    const getPianoHighlights = () => {
        if (!currentStartNote) return [];
        const highlights = [];

        // In Piano Mode, ALWAYS highlight the start note
        if (pianoMode || highlightFirstNote || gameState === 'success') {
            highlights.push(currentStartNote);
        }

        if (gameState === 'success' && currentInterval) {
            highlights.push(getIntervalNote(currentStartNote, currentInterval.semitones));
        }
        return highlights;
    };

    if (selectedIntervals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
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
        <div className={`w-full mx-auto flex flex-col items-center pb-8 px-4 ${pianoMode ? 'max-w-full' : 'max-w-5xl'}`}>
            {/* Play Button Area - MOVED UP FOR PIANO MODE */}
            <div className={`flex flex-col items-center ${pianoMode ? 'mb-2 order-first' : 'mb-12'}`}>
                <div className="relative">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-cool-steel/40 via-celadon/30 to-cool-steel/40 blur-3xl rounded-full animate-pulse ${pianoMode ? 'scale-90 opacity-50' : 'scale-150'}`} />

                    <button
                        onClick={handlePlay}
                        disabled={isPlaying}
                        className={`
                                relative rounded-full bg-gradient-to-br from-bitter-chocolate via-cool-steel to-charcoal-blue flex items-center justify-center
                                shadow-[0_20px_60px_-10px_rgba(120,38,40,0.8)] border-4 border-white/30 hover:border-white/50
                                active:scale-95 transition-all duration-300 group overflow-hidden transform-gpu
                                ${pianoMode ? 'w-16 h-16' : 'w-36 h-36'}
                                ${isPlaying ? 'opacity-80 cursor-wait' : ''}
                            `}
                    >
                        {/* Animated ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-soft-blush/20 to-transparent group-hover:animate-spin-slow" />

                        {/* Inner glow */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cool-steel/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {isPlaying ? (
                            <Volume2 className={`${pianoMode ? 'w-6 h-6' : 'w-16 h-16'} text-soft-blush animate-pulse relative z-10 drop-shadow-[0_0_10px_rgba(241,222,222,0.5)]`} />
                        ) : (
                            <Play className={`${pianoMode ? 'w-6 h-6 ml-0.5' : 'w-16 h-16 ml-2'} text-soft-blush fill-soft-blush relative z-10 drop-shadow-[0_0_10px_rgba(241,222,222,0.5)]`} />
                        )}
                    </button>

                    {/* Quiz Mode Feedback Overlay (Centered on Play Button) */}
                    {!pianoMode && (
                        <div className={`absolute inset-0 flex justify-center items-center pointer-events-none transition-all duration-300 z-50 ${gameState === 'success' || gameState === 'error' ? 'opacity-100' : 'opacity-0'
                            }`}>
                            {gameState === 'success' && (
                                <img src="/images/corretto.png" alt="Corretto" className="h-52 w-auto max-w-none drop-shadow-2xl animate-bounce-short" />
                            )}
                            {gameState === 'error' && (
                                <img src="/images/incorretto.png" alt="Incorretto" className="h-52 w-auto max-w-none drop-shadow-2xl animate-shake" />
                            )}
                        </div>
                    )}
                </div>
                {!pianoMode && (
                    <div className="mt-6 flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cool-steel/50" />
                        <p className="text-center text-soft-blush/80 text-sm font-bold tracking-[0.3em] uppercase">
                            Ascolta
                        </p>
                        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cool-steel/50" />
                    </div>
                )}
            </div>

            {/* Piano Display */}
            {pianoMode && (
                <div className="w-full mb-2 animate-fade-in-up relative">
                    <div className="bg-gradient-to-br from-charcoal-blue/60 to-ink-black/80 p-2 rounded-3xl backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/20">
                        <Piano
                            startOctave={currentStartNote?.octave || 3}
                            highlightNotes={getPianoHighlights()}
                            language={language}
                            onNoteClick={(note) => handlePianoGuess(note)}
                        />
                    </div>

                    {/* Piano Mode Feedback Overlay (Centered on Piano/Screen) */}
                    <div className={`absolute inset-0 flex justify-center items-center pointer-events-none transition-all duration-300 z-50 ${gameState === 'success' || gameState === 'error' ? 'opacity-100' : 'opacity-0'
                        }`}>
                        {gameState === 'success' && (
                            <div className="flex flex-col items-center">
                                <img src="/images/corretto.png" alt="Corretto" className="h-48 w-auto max-w-none drop-shadow-2xl animate-bounce-short" />
                                <div className="mt-2 px-4 py-1 bg-charcoal-blue/80 backdrop-blur-md rounded-full border border-celadon/30 shadow-lg animate-fade-in-up">
                                    <span className="text-lg font-bold text-celadon tracking-wide">
                                        {currentInterval?.name[language]}
                                    </span>
                                </div>
                            </div>
                        )}
                        {gameState === 'error' && (
                            <img src="/images/incorretto.png" alt="Incorretto" className="h-48 w-auto max-w-none drop-shadow-2xl animate-shake" />
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Card (Only for Quiz Mode Grid) */}
            {!pianoMode && (
                <div className={`w-full max-w-2xl bg-gradient-to-br from-charcoal-blue/40 to-ink-black/60 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-cool-steel/20 p-8`}>
                    {/* Answer Grid - HIDE IN PIANO MODE */}
                    {!pianoMode && (
                        <div className="grid grid-cols-2 gap-4">
                            {INTERVALS.filter(i => selectedIntervals.includes(i.semitones)).map((interval, idx) => {
                                const buttonStyles = [
                                    { bg: 'charcoal-blue', hover: 'charcoal-blue/80' },
                                    { bg: 'slate-grey', hover: 'slate-grey/80' },
                                    { bg: 'charcoal-blue', hover: 'charcoal-blue/80' },
                                    { bg: 'slate-grey', hover: 'slate-grey/80' },
                                    { bg: 'charcoal-blue', hover: 'charcoal-blue/80' },
                                    { bg: 'slate-grey', hover: 'slate-grey/80' },
                                    { bg: 'charcoal-blue', hover: 'charcoal-blue/80' },
                                    { bg: 'slate-grey', hover: 'slate-grey/80' },
                                ];
                                const style = buttonStyles[idx % buttonStyles.length];
                                const isCorrect = gameState === 'success' && currentInterval?.semitones === interval.semitones;
                                const isWrong = wrongButton === interval.semitones;

                                return (
                                    <button
                                        key={interval.semitones}
                                        onClick={() => handleGuess(interval)}
                                        disabled={gameState === 'success'}
                                        className={`
                    relative h-24 rounded-2xl transition-all duration-200 
                    flex items-center justify-center overflow-hidden group
                    ${isCorrect
                                                ? 'bg-celadon shadow-[0_10px_40px_rgba(156,222,159,0.5)] border-2 border-celadon/50 scale-105'
                                                : isWrong
                                                    ? 'bg-bitter-chocolate shadow-[0_10px_40px_rgba(120,38,40,0.6)] border-2 border-bitter-chocolate scale-95 shake'
                                                    : `bg-${style.bg} hover:bg-${style.hover} shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] border-2 border-soft-blush/10 hover:border-soft-blush/30 hover:shadow-[0_10px_40px_-10px_rgba(119,160,169,0.3)] hover:scale-105 active:scale-100`}
                    disabled:opacity-80 disabled:cursor-not-allowed
                  `}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-soft-blush/10 to-transparent pointer-events-none" />

                                        <span className={`relative z-10 font-bold text-lg text-center leading-tight px-3 transition-all ${isCorrect ? 'text-charcoal-blue text-xl' : 'text-soft-blush'}`}>
                                            {interval.name.italian}
                                        </span>

                                        {isCorrect && (
                                            <div className="absolute top-2 right-2 bg-charcoal-blue/30 rounded-full p-1">
                                                <Check className="w-5 h-5 text-charcoal-blue" />
                                            </div>
                                        )}

                                        {isWrong && (
                                            <div className="absolute top-2 right-2 bg-soft-blush/30 rounded-full p-1">
                                                <X className="w-5 h-5 text-soft-blush" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Quiz;
