import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Focus,
  Sun,
  Moon,
  Sparkles,
  Check,
  BookOpen,
  Sliders,
  Wind,
  Clock,
  Volume2,
  VolumeX,
  Laptop,
  Flame,
  Leaf
} from 'lucide-react';

export const DeskView: React.FC = () => {
  const {
    environment,
    setDeskLamp,
    setFocusAudio,
    setScreenWarmth,
    tasks,
    toggleTask,
    overallFocusProgress,
    isFocusActive
  } = useWorkspace();

  const primaryTasks = tasks.filter((t) => t.project === 'Edge Mesh Protocol' || t.id === 'task-1' || t.id === 'task-2' || t.id === 'task-3');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Editorial Atmosphere Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAE7DF]/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#865221]" />
            <span>Workspace Sanctuary • Kyoto Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight">
            Today’s Direction
          </h1>
          <p className="text-sm text-[#73716B]">
            Clear, unhurried progress anchored to your circadian rhythm.
          </p>
        </div>

        {/* Quick Atmosphere Readout Card / Tactile Badge */}
        <div className="flex items-center gap-3 bg-[#F7F3EB] px-4 py-2.5 rounded-2xl border border-[#EAE7DF] shadow-xs">
          <div className="flex flex-col text-left">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#73716B]">
              Natural Cycle
            </span>
            <span className="text-sm font-semibold text-[#242426]">Late Afternoon • 16:42</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFDCC2] flex items-center justify-center text-[#2E1500] shadow-xs">
            <Sun className="w-4 h-4 text-[#865221]" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Focus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1: Today's Focus & Depth Work (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Primary Paper Canvas */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE7DF] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Card Top Bar */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Focus className="w-4 h-4 text-[#44664A]" />
                  <span className="font-semibold text-sm sm:text-base text-[#242426]">
                    Today's Focus
                  </span>
                </div>
                <span className="text-xs px-3 py-1 bg-[#FFDCC2] text-[#6A3B0B] font-medium rounded-full">
                  Deep Work
                </span>
              </div>

              {/* Primary Task Details */}
              <div className="pt-4 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#242426] tracking-tight">
                      Synchronize Edge Mesh Protocol
                    </h2>
                    <p className="text-xs sm:text-sm text-[#73716B]">
                      Phase 3 • Architectural consolidation & benchmark tests
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#F1EDE6] text-[#424841] font-medium shrink-0">
                    Priority 01
                  </span>
                </div>

                {/* Tactile Animated Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#73716B] font-medium">Consolidation Progress</span>
                    <span className="text-[#44664A] font-semibold">
                      {overallFocusProgress}% completed
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F1EDE6] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#44664A] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${overallFocusProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Daily Stationery Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#73716B]">
                  Key Milestones
                </span>
                <div className="space-y-2 mt-2">
                  {primaryTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        task.completed
                          ? 'bg-[#F7F3EB]/60 border-[#EAE7DF]'
                          : 'bg-white hover:bg-[#F7F3EB]/40 border-[#EAE7DF]'
                      }`}
                    >
                      {/* Custom Checkbox Button */}
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-[#44664A] text-white shadow-xs'
                            : 'border border-[#C2C8BF] bg-white group-hover:border-[#769A7A]'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug transition-all ${
                            task.completed
                              ? 'line-through text-[#73716B]'
                              : 'text-[#242426] font-medium'
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`text-xs ${
                            task.id === 'task-2' && !task.completed
                              ? 'text-[#865221] font-medium'
                              : 'text-[#8F8D86]'
                          }`}
                        >
                          {task.note}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Ambient Insight Strip */}
            <div className="mt-6 p-3.5 bg-[#F7F3EB] rounded-2xl border border-[#EAE7DF]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C6ECC8] flex items-center justify-center text-[#00210B] shrink-0">
                <Leaf className="w-4 h-4 text-[#44664A]" />
              </div>
              <p className="text-xs text-[#73716B] leading-relaxed">
                Ambient lighting and acoustics are calibrated for high concentration. No incoming
                notifications are scheduled until 17:00.
              </p>
            </div>
          </div>

          {/* Secondary Visual Companion / Physical Journal Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-[#F1EDE6] shrink-0 border border-[#EAE7DF]">
              <img
                src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
                alt="Minimalist Japanese desktop workspace"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <div className="flex items-center gap-1.5 text-[#44664A] text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Daily Monologue</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-[#242426] leading-snug">
                “Simplicity is about subtracting the obvious and adding the meaningful.”
              </h3>
              <p className="text-xs text-[#73716B] leading-relaxed">
                Session notes automatically logged to Notebooks Archive • Today: 3h 14m deep work
                recorded.
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Room Ambience & Circadian Sync (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Environment Surface Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#EAE7DF] shadow-xs flex flex-col gap-5">
            {/* Environment Header with Soft Status Indicator */}
            <div className="flex items-center justify-between pb-1 border-b border-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#865221]" />
                <h2 className="font-semibold text-base text-[#242426]">Room Environment</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F7F3EB] px-2.5 py-1 rounded-full border border-[#EAE7DF]">
                <span className="w-2 h-2 rounded-full bg-[#44664A] animate-pulse" />
                <span className="text-xs text-[#424841] font-medium">Optimized</span>
              </div>
            </div>

            {/* Device 1: Desk Lamp */}
            <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#EAE7DF]/80 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFDCC2] flex items-center justify-center text-[#2E1500]">
                    <Sun className="w-4 h-4 text-[#865221]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#242426] leading-tight">Desk Lamp</h3>
                    <span className="text-xs text-[#73716B]">
                      {environment.deskLamp.colorTemp}K Warmth • {environment.deskLamp.brightness}%
                      Brightness
                    </span>
                  </div>
                </div>

                {/* Tactile Toggle Switch */}
                <button
                  type="button"
                  aria-pressed={environment.deskLamp.enabled}
                  onClick={() =>
                    setDeskLamp({ enabled: !environment.deskLamp.enabled })
                  }
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                    environment.deskLamp.enabled ? 'bg-[#44664A]' : 'bg-[#EAE7DF]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      environment.deskLamp.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Precision Tactile Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-[#73716B]">
                  <span>Warm Circadian Glow</span>
                  <span className="font-semibold text-[#242426]">
                    {environment.deskLamp.brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={environment.deskLamp.brightness}
                  disabled={!environment.deskLamp.enabled}
                  onChange={(e) =>
                    setDeskLamp({ brightness: Number(e.target.value) })
                  }
                  className="w-full accent-[#44664A] h-2 bg-[#EAE7DF] rounded-full cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>

            {/* Device 2: Focus Audio */}
            <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#EAE7DF]/80 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C6ECC8] flex items-center justify-center text-[#00210B]">
                    <Volume2 className="w-4 h-4 text-[#44664A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#242426] leading-tight">Focus Audio</h3>
                    <span className="text-xs text-[#73716B]">
                      Binaural Brown Noise & Gentle Rain • {environment.focusAudio.volume}% Volume
                    </span>
                  </div>
                </div>

                {/* Tactile Toggle Switch */}
                <button
                  type="button"
                  aria-pressed={environment.focusAudio.enabled}
                  onClick={() =>
                    setFocusAudio({ enabled: !environment.focusAudio.enabled })
                  }
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                    environment.focusAudio.enabled ? 'bg-[#44664A]' : 'bg-[#EAE7DF]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      environment.focusAudio.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Precision Audio Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-[#73716B]">
                  <span>Soft Rain Stream</span>
                  <span className="font-semibold text-[#242426]">
                    {environment.focusAudio.volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={environment.focusAudio.volume}
                  disabled={!environment.focusAudio.enabled}
                  onChange={(e) =>
                    setFocusAudio({ volume: Number(e.target.value) })
                  }
                  className="w-full accent-[#44664A] h-2 bg-[#EAE7DF] rounded-full cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>

            {/* Device 3: Screen Warmth */}
            <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#EAE7DF]/80 space-y-3 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFDCC2] flex items-center justify-center text-[#2E1500]">
                    <Laptop className="w-4 h-4 text-[#865221]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#242426] leading-tight">
                      Screen Warmth
                    </h3>
                    <span className="text-xs text-[#73716B]">Circadian Color Shifting</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setScreenWarmth({
                      autoTrueTone: !environment.screenWarmth.autoTrueTone
                    })
                  }
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all ${
                    environment.screenWarmth.autoTrueTone
                      ? 'bg-[#FFDCC2] text-[#865221]'
                      : 'bg-[#EAE7DF] text-[#73716B]'
                  }`}
                >
                  {environment.screenWarmth.autoTrueTone
                    ? 'Auto TrueTone Active'
                    : 'Manual Mode'}
                </button>
              </div>

              {/* Synchronized Info Indicator */}
              <div className="pt-1 flex items-center gap-1.5 text-xs text-[#424841]">
                <Clock className="w-3.5 h-3.5 text-[#865221]" />
                <span>{environment.screenWarmth.targetDescription}</span>
              </div>

              {/* Natural Spectral Temperature Meter */}
              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-[11px] text-[#73716B]">
                  <span>6500K Daylight</span>
                  <span className="text-[#865221] font-semibold">Current: 3400K Sunset</span>
                  <span>1800K Candle</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#CFE5FB] via-[#FFDCC2] to-[#FDB87E] relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-[#242426] rounded-full shadow-xs"
                    style={{ left: '56%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Room Air & Humidity Metric Pill Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1EDE6] flex items-center justify-center text-[#424841]">
                <Wind className="w-5 h-5 text-[#769A7A]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#73716B]">
                  Workspace Air Quality
                </span>
                <p className="font-semibold text-sm sm:text-base text-[#242426]">
                  {environment.airQuality.co2} ppm CO₂ • {environment.airQuality.humidity}% Humidity
                </p>
              </div>
            </div>

            <span className="text-xs text-[#00210B] px-3 py-1 bg-[#C6ECC8] rounded-full font-medium">
              {environment.airQuality.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
