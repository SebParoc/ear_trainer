import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    showSettings: boolean;
    onToggleSettings: () => void;
    pianoMode: boolean;
    headerCenter?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    showSettings,
    onToggleSettings,
    pianoMode,
    headerCenter
}) => {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    const showRotationWarning = pianoMode && !isLandscape && !showSettings;

    return (
        <div className="min-h-screen bg-gradient-to-br from-ink-black via-charcoal-blue/80 to-ink-black text-soft-blush font-sans selection:bg-cool-steel/30 overflow-x-hidden">
            {/* Dynamic Background - subtler, more elegant */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-bitter-chocolate/15 rounded-full blur-[180px] will-change-transform" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cool-steel/12 rounded-full blur-[180px] will-change-transform" />
                <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-celadon/5 rounded-full blur-[150px] will-change-transform" />
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-2xl border-b border-cool-steel/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ${pianoMode ? 'px-4 py-2 bg-ink-black/70' : 'px-5 py-3 bg-ink-black/60'}`}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`relative rounded-xl bg-gradient-to-br from-bitter-chocolate via-cool-steel to-charcoal-blue flex items-center justify-center shadow-lg border border-soft-blush/15 overflow-hidden transition-all duration-300 ${pianoMode ? 'w-9 h-9' : 'w-10 h-10'}`}>
                            <img src="/images/logo.png" alt="AFM Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <h1 className={`font-bold tracking-tight leading-none text-soft-blush transition-all duration-300 ${pianoMode ? 'text-lg' : 'text-xl md:text-2xl'}`}>
                            AFM Ear Trainer
                        </h1>
                    </div>
                </div>

                {/* Center Content (Play Button Portal) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    {headerCenter}
                </div>

                <button
                    onClick={onToggleSettings}
                    className={`relative rounded-xl transition-all duration-300 group overflow-hidden will-change-transform ${showSettings
                        ? 'bg-gradient-to-br from-soft-blush to-dust-grey text-charcoal-blue shadow-lg scale-105'
                        : 'bg-cool-steel/15 text-soft-blush hover:bg-cool-steel/25 border border-cool-steel/20 hover:border-cool-steel/40 hover:scale-105'
                        } ${pianoMode ? 'p-2' : 'p-3'}`}
                >
                    <div className={`transition-transform duration-500 ease-out ${showSettings ? 'rotate-180' : 'rotate-0'}`}>
                        {showSettings ? <ArrowLeft className="w-5 h-5 relative z-10" /> : <SettingsIcon className="w-5 h-5 relative z-10" />}
                    </div>
                </button>
            </header>

            {/* Main Content */}
            <main className={`px-4 min-h-screen flex flex-col justify-center relative z-10 transition-all duration-300 ${pianoMode ? 'pt-16 pb-4' : 'pt-20 pb-8'}`}>
                {showRotationWarning ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                        <div className="w-20 h-20 mb-6 border-2 border-cool-steel/30 rounded-2xl flex items-center justify-center animate-spin-slow bg-charcoal-blue/50 backdrop-blur-md">
                            <RotateIcon />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-soft-blush">Ruota il Dispositivo</h2>
                        <p className="text-slate-grey max-w-xs leading-relaxed">
                            La modalit&agrave; pianoforte funziona meglio in orizzontale. Per favore ruota il tuo dispositivo.
                        </p>
                    </div>
                ) : (
                    children
                )}
            </main>

            {/* Footer */}
            <footer className="fixed bottom-2 right-4 z-40 pointer-events-none opacity-30 hover:opacity-70 transition-opacity duration-500">
                <p className="text-[10px] font-medium text-slate-grey tracking-widest uppercase">by Seb</p>
            </footer>
        </div>
    );
};

const RotateIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

export default Layout;
