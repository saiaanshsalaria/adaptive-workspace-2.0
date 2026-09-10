import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Sliders,
  Plus,
  ArrowRight,
  Sun,
  Volume2,
  Wind,
  BookOpen,
  Sparkles,
  Zap,
  Check,
  X,
  Clock
} from 'lucide-react';
import { AutomationRule } from '../types';

export const AutomationsView: React.FC = () => {
  const { automations, toggleAutomation, addAutomation } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrigger, setNewTrigger] = useState('Focus session starts');
  const [newAction, setNewAction] = useState('Dim desk light to 70%, mute speaker to 20%');
  const [newCategory, setNewCategory] = useState<'lighting' | 'audio' | 'health' | 'retrospective'>('lighting');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAutomation({
      title: newTitle.trim(),
      trigger: newTrigger,
      action: newAction,
      enabled: true,
      category: newCategory
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: AutomationRule['category']) => {
    switch (cat) {
      case 'lighting':
        return <Sun className="w-4 h-4 text-[#865221]" />;
      case 'audio':
        return <Volume2 className="w-4 h-4 text-[#44664A]" />;
      case 'health':
        return <Wind className="w-4 h-4 text-[#4B6173]" />;
      case 'retrospective':
        return <BookOpen className="w-4 h-4 text-[#769A7A]" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF]/60">
        <div>
          <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Intelligent Ambient Hardware Rules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
            Adaptive Engine Rules
          </h1>
          <p className="text-sm text-[#73716B]">
            Automated room IoT routines coordinating lighting, audio, acoustics, and reflections.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold rounded-full shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between gap-4 ${
              rule.enabled ? 'border-[#EAE7DF]' : 'border-[#EAE7DF]/60 opacity-60'
            }`}
          >
            <div>
              {/* Card Header with Category and Tactile Toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#EAE7DF] flex items-center justify-center">
                    {getCategoryIcon(rule.category)}
                  </div>
                  <h3 className="font-semibold text-sm text-[#242426]">{rule.title}</h3>
                </div>

                {/* Tactile Switch */}
                <button
                  type="button"
                  aria-pressed={rule.enabled}
                  onClick={() => toggleAutomation(rule.id)}
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
                    rule.enabled ? 'bg-[#44664A]' : 'bg-[#EAE7DF]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* WHEN / THEN Visual Flow */}
              <div className="mt-4 space-y-2">
                {/* Trigger */}
                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE7DF]/70 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#865221] bg-[#FFDCC2] px-2 py-0.5 rounded uppercase tracking-wider">
                    WHEN
                  </span>
                  <span className="text-xs text-[#242426] font-medium">{rule.trigger}</span>
                </div>

                <div className="flex justify-center -my-1 text-[#8F8D86]">
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </div>

                {/* Action */}
                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE7DF]/70 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#00210B] bg-[#C6ECC8] px-2 py-0.5 rounded uppercase tracking-wider">
                    THEN
                  </span>
                  <span className="text-xs text-[#242426] font-medium">{rule.action}</span>
                </div>
              </div>
            </div>

            {/* Footer with status metadata */}
            <div className="flex items-center justify-between text-[11px] text-[#8F8D86] pt-2 border-t border-[#FAF9F5]">
              <span className="capitalize">Domain: {rule.category}</span>
              {rule.lastTriggered && (
                <span className="flex items-center gap-1 text-[#44664A]">
                  <Clock className="w-3 h-3" /> Fired at {rule.lastTriggered} today
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#242426]/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#44664A]" />
                <h3 className="font-semibold text-base text-[#242426]">
                  Build Adaptive Hardware Rule
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#73716B] hover:text-[#242426]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">Rule Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Kyoto Sunset Desk Light Softening"
                  className="w-full text-xs p-2.5 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-1 focus:ring-[#44664A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">WHEN (Trigger Event)</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                >
                  <option value="Focus session starts">Focus session starts</option>
                  <option value="Focus session paused/ended">Focus session paused/ended</option>
                  <option value="Golden hour begins (16:30)">Golden hour begins (16:30)</option>
                  <option value="Air CO₂ exceeds 800 ppm">Air CO₂ exceeds 800 ppm</option>
                  <option value="Deep work milestone completed">Deep work milestone completed</option>
                  <option value="Continuous desk sitting exceeds 50 minutes">
                    Continuous desk sitting exceeds 50 minutes
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">THEN (Hardware Action)</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                >
                  <option value="Dim desk light to 70%, mute speaker to 20%">
                    Dim desk light to 70%, mute speaker to 20%
                  </option>
                  <option value="Shift screen warmth to 3400K TrueTone">
                    Shift screen warmth to 3400K TrueTone
                  </option>
                  <option value="Trigger gentle Rain soundscape & activate air purifier">
                    Trigger gentle Rain soundscape & activate air purifier
                  </option>
                  <option value="Log reflection note to Notebooks Archive automatically">
                    Log reflection note to Notebooks Archive automatically
                  </option>
                  <option value="Play soft chime and prompt 4-7-8 breathing circle">
                    Play soft chime and prompt 4-7-8 breathing circle
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['lighting', 'audio', 'health', 'retrospective'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`text-xs py-2 px-1 rounded-xl border text-center capitalize font-medium transition-colors ${
                        newCategory === cat
                          ? 'bg-[#C8E6C9] border-[#44664A] text-[#1C331F]'
                          : 'bg-white border-[#EAE7DF] text-[#73716B] hover:bg-[#F7F3EB]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE7DF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#EAE7DF] text-xs font-semibold text-[#73716B] hover:bg-[#F2EFE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold shadow-xs"
                >
                  Deploy Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
