import React, { useRef, useEffect, useState, useMemo } from 'react';
import { NOTES, getNoteName, type Note } from '../core/theory';
import { playNote } from '../core/audio';

interface PianoProps {
    startOctave?: number;
    highlightNotes?: Note[];
    onNoteClick?: (note: Note) => void;
    language: 'anglo' | 'italian';
    scrollAlignment?: 'left' | 'right';
    visibleOctaves?: number[];
    disabled?: boolean;
    highlightState?: 'neutral' | 'success' | 'error';
}

const Piano: React.FC<PianoProps> = ({
    highlightNotes = [],
    onNoteClick,
    language,
    scrollAlignment = 'left',
    visibleOctaves = [3, 4, 5],
    disabled = false,
    highlightState = 'neutral'
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastStartNoteRef = useRef<string | null>(null);
    const lastScrollAlignmentRef = useRef<'left' | 'right' | null>(null);
    const [visibleLabels, setVisibleLabels] = useState<Set<string>>(new Set());
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    const keys = useMemo(() => {
        const sortedOctaves = [...visibleOctaves].sort((a, b) => a - b);
        const generatedKeys = sortedOctaves.flatMap(octave =>
            NOTES.map(noteName => ({
                name: noteName,
                isBlack: noteName.includes('#'),
                note: { name: noteName, octave } as Note
            }))
        );

        if (sortedOctaves.length > 0) {
            const lastOctave = sortedOctaves[sortedOctaves.length - 1];
            generatedKeys.push({
                name: "C",
                isBlack: false,
                note: { name: "C", octave: lastOctave + 1 }
            });
        }

        return generatedKeys;
    }, [visibleOctaves]);

    // Auto-scroll logic
    useEffect(() => {
        if (highlightNotes.length > 0 && scrollContainerRef.current) {
            const firstHighlight = highlightNotes[0];
            const startNoteKey = `${firstHighlight.name}-${firstHighlight.octave}`;

            if (startNoteKey !== lastStartNoteRef.current || scrollAlignment !== lastScrollAlignmentRef.current) {
                let index = keys.findIndex(k => k.name === firstHighlight.name && k.note.octave === firstHighlight.octave);

                if (index !== -1) {
                    if (scrollAlignment === 'left') {
                        if (keys[index].isBlack) {
                            index = Math.max(0, index - 1);
                        }
                    }

                    const whiteKeyIndex = keys.slice(0, index).filter(k => !k.isBlack).length;
                    const keyWidth = 96;

                    let scrollAmount = 0;

                    if (scrollAlignment === 'left') {
                        scrollAmount = whiteKeyIndex * keyWidth;
                    } else {
                        scrollAmount = ((whiteKeyIndex + 1) * keyWidth) - scrollContainerRef.current.clientWidth;
                    }

                    scrollContainerRef.current.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });

                    lastStartNoteRef.current = startNoteKey;
                    lastScrollAlignmentRef.current = scrollAlignment;
                }
            }
        }
    }, [highlightNotes, scrollAlignment, keys]);

    // Clear visible labels when state resets
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        if (highlightState === 'neutral') {
            timeoutId = setTimeout(() => {
                setVisibleLabels(new Set());
            }, 0);
        }
        return () => clearTimeout(timeoutId);
    }, [highlightState]);

    const handleNoteClick = (note: Note) => {
        if (disabled) return;

        playNote(note);
        onNoteClick?.(note);

        // Visual press feedback
        const noteId = `${note.name}-${note.octave}`;
        setPressedKey(noteId);
        setTimeout(() => setPressedKey(null), 150);

        setVisibleLabels(prev => {
            const newSet = new Set(prev);
            newSet.add(noteId);
            return newSet;
        });

        setTimeout(() => {
            setVisibleLabels(prev => {
                const newSet = new Set(prev);
                newSet.delete(noteId);
                return newSet;
            });
        }, 1200);
    };

    return (
        <div className="relative w-full h-full select-none perspective-1000">
            <div
                ref={scrollContainerRef}
                className="flex h-full w-full rounded-2xl overflow-x-auto overflow-y-hidden shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)] ring-2 ring-cool-steel/20 bg-gradient-to-b from-ink-black to-charcoal-blue scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {keys.map((key, index) => {
                    if (key.isBlack) return null;

                    const isHighlighted = highlightNotes.some(n => n.name === key.name && n.octave === key.note.octave);
                    const noteId = `${key.name}-${key.note.octave}`;
                    const isLabelVisible = isHighlighted || visibleLabels.has(noteId);
                    const isPressed = pressedKey === noteId;

                    const nextKey = keys[index + 1];
                    const hasBlackKey = nextKey?.isBlack;
                    const nextKeyId = nextKey ? `${nextKey.name}-${nextKey.note.octave}` : '';
                    const isNextKeyLabelVisible = nextKey && (highlightNotes.some(n => n.name === nextKey.name && n.octave === nextKey.note.octave) || visibleLabels.has(nextKeyId));
                    const isNextKeyPressed = nextKey && pressedKey === nextKeyId;

                    // Mark octave boundary (C notes)
                    const isC = key.name === 'C';

                    return (
                        <div key={`${key.name}-${key.note.octave}`} className="relative flex-1 min-w-[4rem] max-w-24 h-full">
                            {/* White Key */}
                            <button
                                disabled={disabled}
                                className={`
                                    w-full h-full bg-gradient-to-b from-white via-[#faf8f6] to-dust-grey
                                    border-r border-slate-grey/15 rounded-b-lg
                                    transition-all duration-100 ease-out transform origin-top
                                    active:brightness-90 active:scale-y-[0.98]
                                    hover:from-white hover:via-white hover:to-soft-blush/80 group
                                    ${isC ? 'border-l border-l-slate-grey/10' : ''}
                                    ${isPressed ? 'brightness-90 scale-y-[0.98] shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)]' : ''}
                                    ${isHighlighted ?
                                        highlightState === 'success'
                                            ? '!bg-gradient-to-b !from-celadon/70 !via-celadon !to-celadon/80 shadow-[0_0_30px_rgba(156,222,159,0.8),inset_0_-4px_12px_rgba(156,222,159,0.3)] z-10'
                                            : highlightState === 'error'
                                                ? '!bg-gradient-to-b !from-bitter-chocolate/70 !via-bitter-chocolate !to-bitter-chocolate/80 shadow-[0_0_30px_rgba(120,38,40,0.8),inset_0_-4px_12px_rgba(120,38,40,0.3)] z-10'
                                                : '!bg-gradient-to-b !from-cool-steel/70 !via-cool-steel !to-cool-steel/80 shadow-[0_0_30px_rgba(119,160,169,0.8),inset_0_-4px_12px_rgba(119,160,169,0.3)] z-10'
                                        : ''}
                                    ${disabled ? 'cursor-not-allowed opacity-90 active:scale-y-100 hover:from-white hover:to-dust-grey' : 'cursor-pointer'}
                                `}
                                onClick={() => handleNoteClick(key.note)}
                            >
                                {/* Octave marker for C */}
                                {isC && (
                                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-grey/30">
                                        {key.note.octave}
                                    </span>
                                )}

                                <span className={`
                                    absolute bottom-6 left-1/2 -translate-x-1/2 text-base font-bold transition-all duration-200
                                    ${isLabelVisible ? 'text-charcoal-blue opacity-100 text-lg' : 'text-rosy-granite opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-80 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-charcoal-blue/70'}
                                `}>
                                    {getNoteName(key.name, language)}
                                    <span className="text-[10px] align-top opacity-50 ml-0.5">{key.note.octave}</span>
                                </span>
                            </button>

                            {/* Black Key */}
                            {hasBlackKey && (
                                <div className="absolute top-0 -right-[30%] w-[60%] h-[62%] z-20 pointer-events-none">
                                    <button
                                        disabled={disabled}
                                        className={`
                                            w-full h-full bg-gradient-to-b from-[#2a3540] via-ink-black to-[#0a0e11]
                                            rounded-b-xl shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]
                                            pointer-events-auto
                                            transition-all duration-100 ease-out transform origin-top
                                            active:scale-y-[0.97] active:brightness-110 border-x-2 border-b-2 border-ink-black/50
                                            hover:from-[#3a4a56] hover:via-charcoal-blue hover:to-ink-black group
                                            ${isNextKeyPressed ? 'scale-y-[0.97] brightness-110' : ''}
                                            ${highlightNotes.some(n => n.name === nextKey.name && n.octave === nextKey.note.octave)
                                                ? highlightState === 'success'
                                                    ? '!bg-gradient-to-b !from-celadon !via-celadon/80 !to-charcoal-blue shadow-[0_0_25px_rgba(156,222,159,0.8)] scale-105'
                                                    : highlightState === 'error'
                                                        ? '!bg-gradient-to-b !from-bitter-chocolate !via-bitter-chocolate/80 !to-charcoal-blue shadow-[0_0_25px_rgba(120,38,40,0.8)] scale-105'
                                                        : '!bg-gradient-to-b !from-cool-steel !via-cool-steel/80 !to-charcoal-blue shadow-[0_0_25px_rgba(119,160,169,0.8)] scale-105'
                                                : ''}
                                            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNoteClick(nextKey.note);
                                        }}
                                    >
                                        {/* Top highlight */}
                                        <div className="absolute inset-x-2 top-2 h-3 bg-gradient-to-b from-slate-grey/25 to-transparent rounded-t-lg pointer-events-none" />

                                        <span className={`
                                            absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold transition-all duration-200 text-white
                                            ${isNextKeyLabelVisible ? 'opacity-100' : 'opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-80'}
                                        `}>
                                            {getNoteName(nextKey.name, language)}
                                            <span className="text-[10px] align-top opacity-50 ml-0.5">{nextKey.note.octave}</span>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reflection overlay */}
            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-soft-blush/20 via-soft-blush/5 to-transparent pointer-events-none rounded-t-2xl" />

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-ink-black/30 to-transparent pointer-events-none rounded-b-2xl" />
        </div>
    );
};

export default Piano;
