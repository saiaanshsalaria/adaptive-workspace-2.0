import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Sparkles, Timer, Music, Volume2, VolumeX, Eye } from 'lucide-react';

export const BottomDock: React.FC = () => {
  const {
    setZenModeActive,
    setTakeBreathModalOpen,
    soundscapeActive,
    toggleSoundscape,
    focusSecondsLeft,
    isFocusActive
  } = useWorkspace();

  const minutesLeft = Math.ceil(focusSecondsLeft / 60);

  return (
    <div className="fixed bottom-5 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(36,36,38,0.06)] border border-[#EAE7DF] flex items-center gap-3 sm:gap-5 transition-all hover:shadow-[0_6px_24px_rgba(36,36,38,0.09)]">
        {/* Zen Focus View */}
        <button
          onClick={() => setZenModeActive(true)}
          className="flex items-center gap-2 text-xs font-semibold text-[#242426] hover:text-[#44664A] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#769A7A]" />
          <span>Zen Focus View</span>
        </button>

        <span className="w-1 h-1 rounded-full bg-[#D8D4C9]" />

        {/* Take a Breath */}
        <button
          onClick={() => setTakeBreathModalOpen(true)}
          className="flex items-center gap-2 text-xs font-medium text-[#73716B] hover:text-[#242426] transition-colors cursor-pointer"
        >
          <Timer className="w-3.5 h-3.5" />
          <span>
            {isFocusActive ? `Take a Breath (${minutesLeft}m left)` : 'Take a Breath (25m cycle)'}
          </span>
        </button>

        <span className="w-1 h-1 rounded-full bg-[#D8D4C9]" />

        {/* Rain Soundscape */}
        <button
          onClick={toggleSoundscape}
          className={`flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer ${
            soundscapeActive
              ? 'text-[#44664A] font-semibold'
              : 'text-[#73716B] hover:text-[#242426]'
          }`}
        >
          {soundscapeActive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#769A7A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#44664A]"></span>
              </span>
              <Volume2 className="w-3.5 h-3.5 text-[#44664A]" />
              <span>Rain Playing</span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5" />
              <span>Rain Soundscape</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
