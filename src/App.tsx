import { useState } from 'react';
import Layout from './components/Layout';
import Settings from './components/Settings';
import Quiz from './components/Quiz';
import { INTERVALS, type NoteName } from './core/theory';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [language, setLanguage] = useState<'anglo' | 'italian'>('italian');
  const [selectedIntervals, setSelectedIntervals] = useState<number[]>(
    INTERVALS.map(i => i.semitones) // Default all
  );
  const [pianoMode, setPianoMode] = useState(false);
  const [highlightFirstNote, setHighlightFirstNote] = useState(true);
  const [selectedStartNote, setSelectedStartNote] = useState<NoteName | 'Random'>('Random');

  return (
    <Layout
      showSettings={showSettings}
      onToggleSettings={() => setShowSettings(!showSettings)}
      pianoMode={pianoMode}
    >
      {showSettings ? (
        <div className="w-full max-w-4xl mx-auto">
          <Settings
            language={language}
            setLanguage={setLanguage}
            selectedIntervals={selectedIntervals}
            setSelectedIntervals={setSelectedIntervals}
            pianoMode={pianoMode}
            setPianoMode={setPianoMode}
            highlightFirstNote={highlightFirstNote}
            setHighlightFirstNote={setHighlightFirstNote}
            selectedStartNote={selectedStartNote}
            setSelectedStartNote={setSelectedStartNote}
          />
          <button
            onClick={() => setShowSettings(false)}
            className="mt-8 w-full max-w-3xl mx-auto block py-4 rounded-2xl bg-gradient-to-r from-cool-steel/30 to-bitter-chocolate/30 hover:from-cool-steel/40 hover:to-bitter-chocolate/40 text-soft-blush font-bold text-lg transition-all duration-300 border-2 border-cool-steel/40 hover:border-cool-steel/60 shadow-[0_10px_40px_-10px_rgba(119,160,169,0.3)] hover:shadow-[0_15px_50px_-10px_rgba(119,160,169,0.5)] hover:scale-105 active:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-soft-blush/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Torna al Quiz</span>
          </button>
        </div>
      ) : (
        <Quiz
          language={language}
          selectedIntervals={selectedIntervals}
          pianoMode={pianoMode}
          highlightFirstNote={highlightFirstNote}
          selectedStartNote={selectedStartNote}
        />
      )}
    </Layout>
  );
}

export default App;
