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
        <div className="min-h-screen bg-gradient-to-br from-ink-black via-charcoal-blue to-ink-black text-soft-blush font-sans selection:bg-cool-steel/30 overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-bitter-chocolate/25 rounded-full blur-[150px] animate-pulse will-change-transform" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cool-steel/20 rounded-full blur-[150px] animate-pulse will-change-transform" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[30%] right-[15%] w-[40%] h-[40%] bg-celadon/10 rounded-full blur-[120px] animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[20%] left-[20%] w-[35%] h-[35%] bg-slate-grey/15 rounded-full blur-[130px] will-change-transform" />
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-b from-charcoal-blue/50 to-transparent backdrop-blur-xl border-b border-cool-steel/20 shadow-lg transition-all duration-300 ${pianoMode ? 'px-4 py-2' : 'px-4 py-3'}`}>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-bitter-chocolate to-cool-steel rounded-2xl blur-md opacity-70" />
                        <div className={`relative rounded-2xl bg-gradient-to-br from-bitter-chocolate via-cool-steel to-charcoal-blue flex items-center justify-center shadow-lg border border-soft-blush/20 overflow-hidden transition-all duration-300 ${pianoMode ? 'w-10 h-10' : 'w-10 h-10'}`}>
                            <img src="/images/logo.png" alt="AFM Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl tracking-tight leading-none text-soft-blush drop-shadow-md hidden md:block">AFM Ear Trainer</h1>
                        <h1 className={`font-bold tracking-tight leading-none text-soft-blush drop-shadow-md md:hidden transition-all duration-300 ${pianoMode ? 'text-lg' : 'text-xl'}`}>AFM Ear Trainer</h1>
                    </div>
                </div>

                {/* Center Content (Play Button Portal) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    {headerCenter}
                </div>

                <button
                    onClick={onToggleSettings}
                    className={`relative rounded-xl transition-all duration-300 group overflow-hidden will-change-transform ${showSettings
                        ? 'bg-gradient-to-br from-soft-blush to-dust-grey text-charcoal-blue shadow-lg scale-110'
                        : 'bg-cool-steel/20 text-soft-blush hover:bg-cool-steel/30 border border-cool-steel/30 hover:border-cool-steel/50 hover:scale-105'
                        } ${pianoMode ? 'p-2' : 'p-3.5'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-soft-blush/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`transition-transform duration-300 ${showSettings ? 'rotate-0' : 'rotate-0'}`}>
                        {showSettings ? <ArrowLeft className="w-6 h-6 relative z-10" /> : <SettingsIcon className="w-6 h-6 relative z-10" />}
                    </div>
                </button>
            </header>

            {/* Main Content */}
            <main className={`px-4 min-h-screen flex flex-col justify-center relative z-10 transition-all duration-300 ${pianoMode ? 'pt-20 pb-4' : 'pt-20 pb-8'}`}>
                {showRotationWarning ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                        <div className="w-20 h-20 mb-6 border-2 border-cool-steel/30 rounded-2xl flex items-center justify-center animate-spin-slow bg-charcoal-blue/50 backdrop-blur-md">
                            <RotateIcon />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-soft-blush">Ruota il Dispositivo</h2>
                        <p className="text-slate-grey max-w-xs leading-relaxed">
                            La modalità pianoforte funziona meglio in orizzontale. Per favore ruota il tuo dispositivo.
                        </p>
                    </div>
                ) : (
                    children
                )}
            </main>
            {/* Footer */}
            <footer className="fixed bottom-2 right-4 z-40 pointer-events-none opacity-40 hover:opacity-80 transition-opacity duration-300">
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

