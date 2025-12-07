import React, { useRef, useEffect } from 'react';
import { NOTES, getNoteName, type Note } from '../core/theory';
import { playNote } from '../core/audio';

interface PianoProps {
    startOctave?: number; // Not strictly used for generation anymore if we show multiple octaves
    highlightNotes?: Note[];
    onNoteClick?: (note: Note) => void;
    language: 'anglo' | 'italian';
}

const Piano: React.FC<PianoProps> = ({
    highlightNotes = [],
    onNoteClick,
    language
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Generate keys for 3 octaves (C3 to B5)
    const octaves = [3, 4, 5];
    const keys = octaves.flatMap(octave =>
        NOTES.map(noteName => ({
            name: noteName,
            isBlack: noteName.includes('#'),
            note: { name: noteName, octave } as Note
        }))
    );

    // Auto-scroll to the first highlighted note on change
    useEffect(() => {
        if (highlightNotes.length > 0 && scrollContainerRef.current) {
            const firstHighlight = highlightNotes[0];
            // Find index of this note
            const index = keys.findIndex(k => k.name === firstHighlight.name && k.note.octave === firstHighlight.octave);

            if (index !== -1) {
                // Key width is now w-24 (6rem = 96px)
                // Scroll to center the key: (index * 96) - (containerWidth / 2) + (keyWidth / 2)
                const keyWidth = 96;
                const scrollAmount = index * keyWidth;
                scrollContainerRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }, [highlightNotes]); // keys is stable enough

    return (
        <div className="relative w-full h-full select-none perspective-1000">
            <div
                ref={scrollContainerRef}
                className="flex h-full w-full rounded-2xl overflow-x-auto overflow-y-hidden shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)] ring-2 ring-cool-steel/20 bg-gradient-to-b from-ink-black to-charcoal-blue scrollbar-hide"
            >
                {keys.map((key, index) => {
                    if (key.isBlack) return null; // Rendered separately

                    const isHighlighted = highlightNotes.some(n => n.name === key.name && n.octave === key.note.octave);

                    // Check for black key to the right
                    const nextKey = keys[index + 1];
                    const hasBlackKey = nextKey?.isBlack;

                    return (
                        <div key={`${key.name}-${key.note.octave}`} className="relative flex-shrink-0 w-24 h-full">
                            {/* White Key */}
                            <button
                                className={`
                  w-full h-full bg-gradient-to-b from-white via-soft-blush to-dust-grey
                  border-r border-slate-grey/20 rounded-b-lg active:from-dust-grey active:to-rosy-granite/50
                  transition-all duration-150 ease-out transform origin-top
                  active:scale-y-[0.97] active:shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)]
                  hover:from-white hover:to-soft-blush group
                  ${isHighlighted ? '!bg-gradient-to-b !from-celadon/60 !via-celadon !to-celadon/80 shadow-[0_0_30px_rgba(156,222,159,0.8),inset_0_-4px_12px_rgba(156,222,159,0.3)] z-10' : ''}
                `}
                                onClick={() => {
                                    playNote(key.note);
                                    onNoteClick?.(key.note);
                                }}
                            >
                                <span className={`
                  absolute bottom-6 left-1/2 -translate-x-1/2 text-base font-bold transition-all duration-200
                  ${isHighlighted ? 'text-charcoal-blue opacity-100 text-lg' : 'text-rosy-granite opacity-0 md:group-hover:opacity-100 md:group-hover:text-charcoal-blue'}
                `}>
                                    {getNoteName(key.name, language)}
                                    <span className="text-[10px] align-top opacity-60 ml-0.5">{key.note.octave}</span>
                                </span>
                            </button>

                            {/* Black Key (Absolute overlay) */}
                            {hasBlackKey && (
                                <div className="absolute top-0 -right-[30%] w-[60%] h-[62%] z-20 pointer-events-none">
                                    <button
                                        className={`
                      w-full h-full bg-gradient-to-b from-charcoal-blue via-ink-black to-ink-black
                      rounded-b-xl shadow-[0_8px_25px_rgba(0,0,0,0.8)] active:from-ink-black active:to-charcoal-blue pointer-events-auto
                      transition-all duration-150 ease-out transform origin-top
                      active:scale-y-[0.96] border-x-2 border-b-2 border-ink-black/50
                      hover:from-slate-grey/60 hover:via-charcoal-blue hover:to-ink-black group
                      ${highlightNotes.some(n => n.name === nextKey.name && n.octave === nextKey.note.octave)
                                                ? '!bg-gradient-to-b !from-cool-steel !via-bitter-chocolate !to-charcoal-blue shadow-[0_0_25px_rgba(119,160,169,0.8)] scale-105' : ''}
                    `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playNote(nextKey.note);
                                            onNoteClick?.(nextKey.note);
                                        }}
                                    >
                                        {/* Top highlight on black key */}
                                        <div className="absolute inset-x-2 top-2 h-3 bg-gradient-to-b from-slate-grey/30 to-transparent rounded-t-lg pointer-events-none" />

                                        {/* Note Label */}
                                        <span className={`
                                            absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold transition-all duration-200 text-white
                                            ${highlightNotes.some(n => n.name === nextKey.name && n.octave === nextKey.note.octave) ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}
                                        `}>
                                            {getNoteName(nextKey.name, language)}
                                            <span className="text-[10px] align-top opacity-60 ml-0.5">{nextKey.note.octave}</span>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Reflection/Gloss */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-soft-blush/30 via-soft-blush/10 to-transparent pointer-events-none rounded-t-2xl" />

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-ink-black/40 to-transparent pointer-events-none rounded-b-2xl" />
        </div>
    );
};

export default Piano;
