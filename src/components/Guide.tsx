import React from 'react';
import { INTERVALS, getIntervalColor, getDifficultyColor } from '../core/theory';
import { Music, BookOpen, Lightbulb, ArrowLeftRight, GraduationCap } from 'lucide-react';

interface GuideProps {
    language: 'anglo' | 'italian';
}

const INTERVAL_CHARACTERS: Record<number, { anglo: string; italian: string }> = {
    0:  { anglo: "Identity — the same note", italian: "Identica — la stessa nota" },
    1:  { anglo: "Tense, dissonant, \"crunchy\"", italian: "Teso, dissonante, \"graffiante\"" },
    2:  { anglo: "Neutral, like a step on a staircase", italian: "Neutro, come un passo sulle scale" },
    3:  { anglo: "Sad, dark, melancholic", italian: "Triste, scuro, malinconico" },
    4:  { anglo: "Happy, bright, stable", italian: "Allegro, luminoso, stabile" },
    5:  { anglo: "Open, solemn, like a hymn", italian: "Aperto, solenne, come un inno" },
    6:  { anglo: "Restless, unstable, wants to resolve", italian: "Inquieto, instabile, vuole risolvere" },
    7:  { anglo: "Powerful, hollow, open", italian: "Potente, vuoto, aperto" },
    8:  { anglo: "Bittersweet, yearning", italian: "Agrodolce, nostalgico" },
    9:  { anglo: "Warm, tender, sweet", italian: "Caldo, tenero, dolce" },
    10: { anglo: "Bluesy, expectant, wants resolution", italian: "Blues, in attesa, cerca risoluzione" },
    11: { anglo: "Dreamy, wide, almost an octave", italian: "Sognante, ampio, quasi un'ottava" },
    12: { anglo: "Complete, pure, the same note higher", italian: "Completo, puro, la stessa nota pi\u00f9 in alto" },
};

const INVERSIONS: [number, number][] = [
    [1, 11],   // m2 <-> M7
    [2, 10],   // M2 <-> m7
    [3, 9],    // m3 <-> M6
    [4, 8],    // M3 <-> m6
    [5, 7],    // P4 <-> P5
];

const Guide: React.FC<GuideProps> = ({ language }) => {
    const isIt = language === 'italian';

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

    const getIntervalBySteps = (semitones: number) => INTERVALS.find(i => i.semitones === semitones)!;

    return (
        <div className="w-full max-w-3xl mx-auto pb-10 px-4 animate-fade-in">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-soft-blush mb-1.5">
                    {isIt ? 'Guida agli Intervalli' : 'Interval Guide'}
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-cool-steel/40" />
                    <p className="text-slate-grey/60 text-sm">
                        {isIt ? 'Tutto quello che serve per allenare l\'orecchio' : 'Everything you need to train your ear'}
                    </p>
                    <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-cool-steel/40" />
                </div>
            </div>

            {/* Section 1: What is an interval */}
            <SectionCard>
                <SectionHeader icon={<Music className="w-4 h-4 text-cool-steel" />} label={isIt ? "Cos'\u00e8 un Intervallo?" : "What is an Interval?"} />
                <p className="text-soft-blush/80 text-sm leading-relaxed mb-4">
                    {isIt
                        ? "Un intervallo \u00e8 la distanza tra due note. Si misura in semitoni \u2014 il semitono \u00e8 la distanza pi\u00f9 piccola possibile tra due note (ad esempio, da Do a Do#, o da Mi a Fa)."
                        : "An interval is the distance between two notes. It is measured in semitones \u2014 the semitone is the smallest possible distance between two notes (e.g., from C to C#, or from E to F)."}
                </p>
                <p className="text-soft-blush/80 text-sm leading-relaxed">
                    {isIt
                        ? "Ogni intervallo ha un nome composto da due parti: una qualit\u00e0 (che descrive il \"colore\" sonoro) e un numero (che indica il grado della scala)."
                        : "Each interval has a name composed of two parts: a quality (describing its sonic \"color\") and a number (indicating the scale degree)."}
                </p>
            </SectionCard>

            {/* Section 2: The quality system */}
            <SectionCard>
                <SectionHeader icon={<BookOpen className="w-4 h-4 text-soft-blush/70" />} label={isIt ? "Le Qualit\u00e0 degli Intervalli" : "Interval Qualities"} />
                <p className="text-soft-blush/60 text-xs mb-4 leading-relaxed">
                    {isIt
                        ? "Ogni intervallo appartiene a una famiglia sonora. Impara a riconoscere queste \"famiglie\" \u2014 \u00e8 il primo passo per distinguere gli intervalli a orecchio."
                        : "Each interval belongs to a sonic family. Learning to recognize these \"families\" is the first step to distinguishing intervals by ear."}
                </p>
                <div className="space-y-3">
                    {([
                        {
                            quality: 'Perfect' as const,
                            labelIt: 'Giusto (P)',
                            labelEn: 'Perfect (P)',
                            descIt: 'Suono aperto, puro, stabile. Sono gli intervalli che suonano pi\u00f9 \"consonanti\". Include: Prima (P1), Quarta (P4), Quinta (P5), Ottava (P8).',
                            descEn: 'Open, pure, stable sound. These are the most \"consonant\" intervals. Includes: Unison (P1), Fourth (P4), Fifth (P5), Octave (P8).',
                            abbrevIt: 'P = Perfetto/Giusto',
                            abbrevEn: 'P = Perfect',
                        },
                        {
                            quality: 'Major' as const,
                            labelIt: 'Maggiore (M)',
                            labelEn: 'Major (M)',
                            descIt: 'Suono luminoso, allegro, brillante. La versione \"grande\" dell\'intervallo. Include: Seconda (M2), Terza (M3), Sesta (M6), Settima (M7).',
                            descEn: 'Bright, happy, brilliant sound. The \"larger\" version of the interval. Includes: Second (M2), Third (M3), Sixth (M6), Seventh (M7).',
                            abbrevIt: 'M = Maggiore (maiuscola!)',
                            abbrevEn: 'M = Major (uppercase!)',
                        },
                        {
                            quality: 'Minor' as const,
                            labelIt: 'Minore (m)',
                            labelEn: 'Minor (m)',
                            descIt: 'Suono scuro, malinconico, triste. La versione \"piccola\", un semitono pi\u00f9 stretta del Maggiore. Include: Seconda (m2), Terza (m3), Sesta (m6), Settima (m7).',
                            descEn: 'Dark, melancholic, sad sound. The \"smaller\" version, one semitone narrower than Major. Includes: Second (m2), Third (m3), Sixth (m6), Seventh (m7).',
                            abbrevIt: 'm = minore (minuscola!)',
                            abbrevEn: 'm = minor (lowercase!)',
                        },
                        {
                            quality: 'Augmented' as const,
                            labelIt: 'Tritono (TT)',
                            labelEn: 'Tritone (TT)',
                            descIt: 'Il \"diabolus in musica\" \u2014 l\'intervallo pi\u00f9 instabile e teso. Si trova esattamente a met\u00e0 dell\'ottava (6 semitoni). Pu\u00f2 essere visto come Quarta Aumentata o Quinta Diminuita.',
                            descEn: 'The \"diabolus in musica\" \u2014 the most unstable and tense interval. Located exactly at the middle of the octave (6 semitones). Can be seen as an Augmented Fourth or Diminished Fifth.',
                            abbrevIt: 'TT = Tritono (3 toni interi)',
                            abbrevEn: 'TT = Tritone (3 whole tones)',
                        },
                    ] as const).map(({ quality, labelIt, labelEn, descIt, descEn, abbrevIt, abbrevEn }) => (
                        <div key={quality} className="flex gap-3 p-4 rounded-xl bg-ink-black/20 border border-cool-steel/8">
                            <div
                                className="w-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getIntervalColor(quality) }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-soft-blush text-base">{isIt ? labelIt : labelEn}</span>
                                </div>
                                <p className="text-soft-blush/60 text-sm leading-relaxed mb-1.5">
                                    {isIt ? descIt : descEn}
                                </p>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-charcoal-blue/60 text-cool-steel/70">
                                    {isIt ? abbrevIt : abbrevEn}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Section 3: How to read shorthand */}
            <SectionCard>
                <SectionHeader icon={<GraduationCap className="w-4 h-4 text-celadon/70" />} label={isIt ? "Come Leggere le Abbreviazioni" : "Reading Shorthand Notation"} />
                <p className="text-soft-blush/80 text-sm leading-relaxed mb-4">
                    {isIt
                        ? "Le abbreviazioni sono composte da una lettera (la qualit\u00e0) e un numero (il grado). La lettera ti dice il \"colore\" sonoro, il numero ti dice quanto \u00e8 ampio l'intervallo."
                        : "Shorthand notation combines a letter (the quality) with a number (the degree). The letter tells you the sonic \"color\", the number tells you how wide the interval is."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {([
                        { short: 'P', fullIt: 'Perfetto / Giusto', fullEn: 'Perfect' },
                        { short: 'M', fullIt: 'Maggiore', fullEn: 'Major' },
                        { short: 'm', fullIt: 'minore', fullEn: 'minor' },
                        { short: 'TT', fullIt: 'Tritono', fullEn: 'Tritone' },
                    ]).map(({ short, fullIt, fullEn }) => (
                        <div key={short} className="flex items-center gap-3 p-3 rounded-xl bg-ink-black/20 border border-cool-steel/8">
                            <span className="font-mono font-bold text-lg text-warm-gold w-8 text-center">{short}</span>
                            <span className="text-soft-blush/70 text-sm">=</span>
                            <span className="text-soft-blush text-sm font-medium">{isIt ? fullIt : fullEn}</span>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-xl bg-ink-black/30 border border-warm-gold/15">
                    <p className="text-xs font-bold text-warm-gold/80 uppercase tracking-wider mb-3">
                        {isIt ? 'Esempi' : 'Examples'}
                    </p>
                    <div className="space-y-2">
                        {([
                            { short: 'm3', nameIt: 'Terza Minore', nameEn: 'Minor 3rd', explainIt: 'm = minore, 3 = terza', explainEn: 'm = minor, 3 = third' },
                            { short: 'P5', nameIt: 'Quinta Giusta', nameEn: 'Perfect 5th', explainIt: 'P = perfetto, 5 = quinta', explainEn: 'P = perfect, 5 = fifth' },
                            { short: 'M7', nameIt: 'Settima Maggiore', nameEn: 'Major 7th', explainIt: 'M = maggiore, 7 = settima', explainEn: 'M = major, 7 = seventh' },
                        ]).map(({ short, nameIt, nameEn, explainIt, explainEn }) => (
                            <div key={short} className="flex items-center gap-3 text-sm">
                                <span className="font-mono font-bold text-cool-steel w-8 text-center">{short}</span>
                                <span className="text-soft-blush/50">=</span>
                                <span className="text-soft-blush font-medium">{isIt ? nameIt : nameEn}</span>
                                <span className="text-slate-grey/40 text-xs ml-auto">({isIt ? explainIt : explainEn})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-soft-blush/50 text-xs mt-3 italic">
                    {isIt
                        ? "Attenzione: la M maiuscola indica Maggiore, la m minuscola indica minore. Non confonderle!"
                        : "Note: uppercase M means Major, lowercase m means minor. Don't mix them up!"}
                </p>
            </SectionCard>

            {/* Section 4: Full interval table */}
            <SectionCard>
                <SectionHeader icon={<Music className="w-4 h-4 text-cool-steel" />} label={isIt ? "Tabella Completa degli Intervalli" : "Complete Interval Table"} />

                <div className="space-y-2">
                    {INTERVALS.map(interval => {
                        const character = INTERVAL_CHARACTERS[interval.semitones];
                        const qualityColor = getIntervalColor(interval.type);
                        const diffColor = getDifficultyColor(interval.difficulty);
                        return (
                            <div key={interval.semitones} className="relative flex flex-col p-4 rounded-xl bg-ink-black/20 border border-cool-steel/8 overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                                    style={{ backgroundColor: qualityColor, opacity: 0.7 }}
                                />

                                <div className="flex items-center justify-between ml-2 mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-sm text-cool-steel bg-charcoal-blue/60 px-2 py-0.5 rounded">
                                            {interval.shortName}
                                        </span>
                                        <span className="font-semibold text-soft-blush text-base">
                                            {interval.name[language]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-grey/50">
                                            {interval.semitones} {isIt ? 'semitoni' : 'semitones'}
                                        </span>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                                            style={{ color: diffColor, backgroundColor: `${diffColor}15` }}
                                        >
                                            {interval.difficulty === 'beginner' ? (isIt ? 'base' : 'easy') :
                                             interval.difficulty === 'intermediate' ? (isIt ? 'medio' : 'medium') :
                                             (isIt ? 'avanzato' : 'hard')}
                                        </span>
                                    </div>
                                </div>

                                <div className="ml-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <p className="text-soft-blush/50 text-xs italic flex-1">
                                        {character[language]}
                                    </p>
                                    <p className="text-xs text-warm-gold/60 flex-shrink-0">
                                        <span className="text-warm-gold/40">{isIt ? 'Rif: ' : 'Ref: '}</span>
                                        {interval.hint[language]}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SectionCard>

            {/* Section 5: Inversions */}
            <SectionCard>
                <SectionHeader icon={<ArrowLeftRight className="w-4 h-4 text-warm-gold/70" />} label={isIt ? "Le Inversioni" : "Inversions"} />
                <p className="text-soft-blush/80 text-sm leading-relaxed mb-2">
                    {isIt
                        ? "Ogni intervallo ha un \"gemello specchio\": se capovolgi un intervallo (scambi la nota bassa con quella alta), ottieni la sua inversione. Insieme, formano sempre un'ottava (12 semitoni)."
                        : "Every interval has a \"mirror twin\": if you flip an interval (swap the low and high notes), you get its inversion. Together, they always form an octave (12 semitones)."}
                </p>
                <p className="text-soft-blush/60 text-xs mb-4 leading-relaxed">
                    {isIt
                        ? "La regola: Maggiore diventa minore, minore diventa Maggiore, Giusto resta Giusto."
                        : "The rule: Major becomes minor, minor becomes Major, Perfect stays Perfect."}
                </p>

                <div className="space-y-2">
                    {INVERSIONS.map(([a, b]) => {
                        const intA = getIntervalBySteps(a);
                        const intB = getIntervalBySteps(b);
                        return (
                            <div key={`${a}-${b}`} className="flex items-center gap-2 p-3 rounded-xl bg-ink-black/20 border border-cool-steel/8">
                                <div className="flex-1 text-right">
                                    <span className="font-mono text-xs text-cool-steel mr-1.5">{intA.shortName}</span>
                                    <span className="text-soft-blush text-sm font-medium">{intA.name[language]}</span>
                                    <span className="text-slate-grey/40 text-xs ml-1.5">({a}st)</span>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1 px-3">
                                    <ArrowLeftRight className="w-4 h-4 text-warm-gold/50" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-soft-blush text-sm font-medium">{intB.name[language]}</span>
                                    <span className="font-mono text-xs text-cool-steel ml-1.5">{intB.shortName}</span>
                                    <span className="text-slate-grey/40 text-xs ml-1.5">({b}st)</span>
                                </div>
                            </div>
                        );
                    })}
                    {/* Tritone is its own inversion */}
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-ink-black/20 border border-warm-gold/15">
                        <span className="font-mono text-xs text-cool-steel mr-1">TT</span>
                        <span className="text-soft-blush text-sm font-medium">{isIt ? 'Tritono' : 'Tritone'}</span>
                        <span className="text-slate-grey/40 text-xs">(6st)</span>
                        <span className="text-warm-gold/50 text-xs mx-2">{isIt ? '\u2014 inversione di s\u00e9 stesso!' : '\u2014 its own inversion!'}</span>
                    </div>
                </div>
            </SectionCard>

            {/* Section 6: Practice Tips */}
            <SectionCard>
                <SectionHeader icon={<Lightbulb className="w-4 h-4 text-warm-gold/70" />} label={isIt ? "Consigli per l'Allenamento" : "Practice Tips"} />
                <div className="space-y-3">
                    {([
                        {
                            tipIt: "Canta l'intervallo prima di rispondere",
                            descIt: "Cantare attiva la memoria muscolare e aiuta a interiorizzare il suono. Anche canticchiare a bocca chiusa funziona.",
                            tipEn: "Sing the interval before answering",
                            descEn: "Singing activates muscle memory and helps internalize the sound. Even humming works.",
                        },
                        {
                            tipIt: "Inizia confrontando coppie simili",
                            descIt: "Non allenare tutti gli intervalli insieme. Inizia con M3 vs m3 (allegro vs triste), poi P4 vs P5 (solenne vs potente). Il contrasto \u00e8 il miglior insegnante.",
                            tipEn: "Start by comparing similar pairs",
                            descEn: "Don't train all intervals at once. Start with M3 vs m3 (happy vs sad), then P4 vs P5 (solemn vs powerful). Contrast is the best teacher.",
                        },
                        {
                            tipIt: "Ascolta la \"famiglia\" prima del nome",
                            descIt: "Prima chiediti: \u00e8 Giusto, Maggiore o minore? Poi identifica quale. Riduce le scelte da 13 a 3-4.",
                            tipEn: "Listen for the \"family\" before the name",
                            descEn: "First ask: is it Perfect, Major, or minor? Then identify which one. This reduces choices from 13 to 3-4.",
                        },
                        {
                            tipIt: "Gli intervalli discendenti sono pi\u00f9 difficili",
                            descIt: "Il cervello ricorda meglio la prima nota. Negli intervalli discendenti, la nota alta svanisce e resta quella bassa \u2014 \u00e8 pi\u00f9 ambiguo. Allenali separatamente.",
                            tipEn: "Descending intervals are harder",
                            descEn: "The brain remembers the first note better. In descending intervals, the high note fades and the low one remains \u2014 more ambiguous. Train them separately.",
                        },
                        {
                            tipIt: "Usa i riferimenti, poi abbandonali",
                            descIt: "I brani di riferimento (es. Star Wars per la Quinta) sono utili all'inizio, ma l'obiettivo \u00e8 riconoscere l'intervallo direttamente, senza dover pensare a una canzone.",
                            tipEn: "Use song references, then drop them",
                            descEn: "Song references (e.g., Star Wars for the Fifth) are useful at first, but the goal is to recognize the interval directly, without needing to think of a song.",
                        },
                    ]).map(({ tipIt, descIt, tipEn, descEn }, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-ink-black/20 border border-cool-steel/8">
                            <p className="font-semibold text-soft-blush text-sm mb-1">
                                {isIt ? tipIt : tipEn}
                            </p>
                            <p className="text-soft-blush/50 text-xs leading-relaxed">
                                {isIt ? descIt : descEn}
                            </p>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
};

export default Guide;
