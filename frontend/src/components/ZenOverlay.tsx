import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wind, Check } from 'lucide-react';

export const ZenOverlay: React.FC = () => {
  const {
    zenModeActive,
    setZenModeActive,
    takeBreathModalOpen,
    setTakeBreathModalOpen,
    isFocusActive,
    toggleFocusSession,
    focusSecondsLeft,
    soundscapeActive,
    toggleSoundscape,
    tasks,
    toggleTask
  } = useWorkspace();

  // Breathing state: 'inhale' | 'hold' | 'exhale'
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [zenNotes, setZenNotes] = useState<string>(
    'Kyoto Monologue: Eliminate friction. Boundary validation specs must be confirmed before sunset handover.'
  );

  // Guided breathing loop (4-7-8 rhythm or simple 4-4-4 box breathing)
  useEffect(() => {
    if (!takeBreathModalOpen && !zenModeActive) return;

    let timer: NodeJS.Timeout;
    if (breathPhase === 'inhale') {
      timer = setTimeout(() => {
        setBreathPhase('hold');
      }, 4000);
    } else if (breathPhase === 'hold') {
      timer = setTimeout(() => {
        setBreathPhase('exhale');
      }, 4000);
    } else if (breathPhase === 'exhale') {
      timer = setTimeout(() => {
        setBreathPhase('inhale');
        setBreathCount((c) => c + 1);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [breathPhase, takeBreathModalOpen, zenModeActive]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const primaryTasks = tasks.filter((t) => t.project === 'Edge Mesh Protocol');

  return (
    <>
      {/* Full-Screen Zen Focus Mode */}
      {zenModeActive && (
        <div className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col justify-between p-6 md:p-12 animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#769A7A] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#73716B]">
                Zen Sanctuary • Deep Work Flow
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSoundscape}
                className={`p-2 rounded-full border transition-colors ${
                  soundscapeActive
                    ? 'bg-[#C8E6C9] border-[#769A7A] text-[#1C331F]'
                    : 'bg-white border-[#EAE7DF] text-[#73716B] hover:text-[#242426]'
                }`}
                title="Rain Soundscape"
              >
                {soundscapeActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setZenModeActive(false)}
                className="p-2 rounded-full bg-white border border-[#EAE7DF] text-[#73716B] hover:text-[#242426] hover:bg-[#F2EFE8] transition-colors"
                title="Exit Zen View (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage */}
          <div className="max-w-2xl mx-auto w-full flex flex-col items-center text-center my-auto space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#865221] bg-[#FFE0B2]/70 px-3 py-1 rounded-full uppercase tracking-wider">
                Active Directive
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#242426]">
                Synchronize Edge Mesh Protocol
              </h2>
              <p className="text-sm text-[#73716B]">
                Eliminate external stimuli. Let your thoughts settle like clear water.
              </p>
            </div>

            {/* Big Zen Timer */}
            <div className="p-8 rounded-3xl bg-white border border-[#EAE7DF] shadow-sm flex flex-col items-center gap-4 w-72">
              <div className="text-5xl font-mono tracking-tight font-light text-[#242426]">
                {formatTimer(focusSecondsLeft)}
              </div>
              <button
                onClick={toggleFocusSession}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                  isFocusActive
                    ? 'bg-[#FFE0B2] text-[#865221] hover:bg-[#FDB87E]'
                    : 'bg-[#C8E6C9] text-[#1C331F] hover:bg-[#A8DAB0]'
                }`}
              >
                {isFocusActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> Pause Focus
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Begin Cycle
                  </>
                )}
              </button>
            </div>

            {/* Checklist items in Zen Mode */}
            <div className="w-full bg-white/80 p-4 rounded-2xl border border-[#EAE7DF] space-y-2 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#73716B]">
                Immediate Milestones
              </span>
              {primaryTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF9F5] transition-colors cursor-pointer select-none"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-white text-xs transition-colors ${
                      task.completed ? 'bg-[#769A7A]' : 'border border-[#D8D4C9]'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-sm ${
                      task.completed ? 'line-through text-[#73716B]' : 'text-[#242426]'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Monologue Scratchpad */}
            <div className="w-full text-left space-y-1">
              <label className="text-xs text-[#73716B] font-medium">Uninterrupted Scratchpad</label>
              <textarea
                value={zenNotes}
                onChange={(e) => setZenNotes(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-2 focus:ring-[#769A7A]/30 resize-none"
                placeholder="Capture passing thoughts without breaking flow..."
              />
            </div>
          </div>

          {/* Bottom Footer in Zen */}
          <div className="max-w-4xl mx-auto w-full text-center text-xs text-[#73716B]">
            Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">Esc</kbd> or click top right to return to workspace
          </div>
        </div>
      )}

      {/* Guided Take a Breath Modal */}
      {takeBreathModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#242426]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-3xl max-w-sm w-full p-6 shadow-xl flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#769A7A]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#73716B]">
                  Circadian Bio-Pacing
                </span>
              </div>
              <button
                onClick={() => setTakeBreathModalOpen(false)}
                className="p-1 rounded-full text-[#73716B] hover:text-[#242426] hover:bg-[#F2EFE8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expanding/Contracting Breathing Visual Orb */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div
                className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out ${
                  breathPhase === 'inhale'
                    ? 'w-36 h-36 bg-[#C8E6C9]/60 scale-100'
                    : breathPhase === 'hold'
                    ? 'w-36 h-36 bg-[#FFE0B2]/60 scale-105'
                    : 'w-24 h-24 bg-[#EAE7DF]/80 scale-75'
                }`}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-base font-semibold capitalize text-[#242426]">
                  {breathPhase}
                </span>
                <span className="text-xs text-[#73716B] mt-1">4 seconds</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[#242426]">Mindful Transition</h3>
              <p className="text-xs text-[#73716B]">
                Slow breaths reduce vagal tension and anchor deep cerebral focus.
              </p>
            </div>

            <button
              onClick={() => setTakeBreathModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#769A7A] hover:bg-[#66876A] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Return to Focused State
            </button>
          </div>
        </div>
      )}
    </>
  );
};
