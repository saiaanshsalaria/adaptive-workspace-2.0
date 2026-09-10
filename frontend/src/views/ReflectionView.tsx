import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { HeartPulse, Check, Sparkles, Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { tasks, environment } = useWorkspace();
  const completedTasks = tasks.filter((t) => t.completed);

  const [calmLevel, setCalmLevel] = useState<number>(4);
  const [reflectionNotes, setReflectionNotes] = useState<string>(
    'Phase 3 benchmark logs are consistent. Ambient TrueTone temperature kept concentration level steady.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="pb-4 border-b border-[#EAE7DF]/60">
        <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
          <Moon className="w-3.5 h-3.5" />
          <span>Evening Transition • Sunset Retrospective</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
          Daily Reflection
        </h1>
        <p className="text-sm text-[#73716B]">
          Close open cognitive loops and settle your state before transitioning away from the desk.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#EAE7DF] shadow-xs space-y-6">
        {/* Completed milestones today */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-[#242426] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#44664A]" />
            <span>Completed Milestones Today ({completedTasks.length})</span>
          </h3>
          <div className="space-y-2">
            {completedTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F3EB]/60 border border-[#EAE7DF]"
              >
                <div className="w-4 h-4 rounded bg-[#44664A] text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs font-medium text-[#242426]">{t.title}</span>
                {t.completedAt && (
                  <span className="text-[10px] text-[#73716B] ml-auto">Done at {t.completedAt}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive & Bodily Ease scale */}
        <div className="space-y-2 pt-2 border-t border-[#FAF9F5]">
          <label className="text-xs font-semibold text-[#73716B]">
            Cognitive Flow & Serenity Rating (1 = Strained, 5 = Deeply Settled)
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCalmLevel(lvl)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  calmLevel === lvl
                    ? 'bg-[#C8E6C9] text-[#1C331F] shadow-xs border border-[#44664A]'
                    : 'bg-[#F7F3EB] text-[#73716B] border border-[#EAE7DF] hover:bg-[#EAE7DF]'
                }`}
              >
                {lvl}
              </button>
            ))}
            <span className="text-xs text-[#865221] font-medium ml-2">
              {calmLevel === 5 ? 'Pristine Equilibrium' : calmLevel >= 4 ? 'Serene Focus' : 'Moderate Friction'}
            </span>
          </div>
        </div>

        {/* Evening Monologue Notes */}
        <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-[#FAF9F5]">
          <label className="text-xs font-semibold text-[#73716B]">Sunset Handover Thought</label>
          <textarea
            rows={4}
            value={reflectionNotes}
            onChange={(e) => setReflectionNotes(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#73716B]">
              Logged to Kyoto Monologue Archive with timestamp 16:42
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
            >
              {saved ? 'Saved to Archive ✓' : 'Record Reflection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
