import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { BookOpen, Plus, Calendar, Clock, Sparkles, Feather, Bookmark } from 'lucide-react';

export const NotebooksView: React.FC = () => {
  const [entries, setEntries] = useState([
    {
      id: 'entry-1',
      date: 'Today, 16:40',
      title: 'Simplicity is about subtracting the obvious and adding the meaningful.',
      content:
        'Reflecting on Edge Mesh Phase 3. Removing unnecessary handshake hops reduced peer-to-peer latency from 78ms down to 42ms. The tactile calm of Kyoto Studio keeps the peripheral noise down.',
      tag: 'Architecture'
    },
    {
      id: 'entry-2',
      date: 'Yesterday, 17:15',
      title: 'Circadian sync and screen temperature during golden hour',
      content:
        'Shifting to 3400K TrueTone at 16:30 created an immediate relaxation in ocular strain. Sustained deep work block extended by 45 minutes without fatigue.',
      tag: 'Bio-Pacing'
    },
    {
      id: 'entry-3',
      date: 'Sep 06, 11:20',
      title: 'Muji minimalism in software architecture',
      content:
        'Interfaces should feel like heavyweight washi paper resting on a clean wooden table. No artificial neon glowing, no aggressive alert banners.',
      tag: 'Philosophy'
    }
  ]);

  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryTitle.trim()) return;
    setEntries([
      {
        id: `entry-${Date.now()}`,
        date: 'Just now',
        title: newEntryTitle.trim(),
        content: newEntryContent.trim() || 'Reflection recorded.',
        tag: 'Sanctuary'
      },
      ...entries
    ]);
    setNewEntryTitle('');
    setNewEntryContent('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF]/60">
        <div>
          <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Stationery & Daily Monologues</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
            Notebooks Archive
          </h1>
          <p className="text-sm text-[#73716B]">
            Automated session logs and contemplative journal entries recorded during deep work.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold rounded-full shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3"
        >
          <input
            type="text"
            required
            value={newEntryTitle}
            onChange={(e) => setNewEntryTitle(e.target.value)}
            placeholder="Monologue title or thought..."
            className="w-full text-sm font-semibold p-2.5 bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
          />
          <textarea
            rows={3}
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            placeholder="Write your contemplative notes..."
            className="w-full text-xs p-2.5 bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#73716B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#44664A] text-white text-xs font-semibold rounded-full shadow-xs"
            >
              Save to Notebooks
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl p-6 border border-[#EAE7DF] shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#73716B]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#865221]" /> {entry.date}
                </span>
                <span className="bg-[#FFDCC2] text-[#6A3B0B] px-2 py-0.5 rounded-full font-medium">
                  {entry.tag}
                </span>
              </div>
              <h3 className="font-semibold text-base text-[#242426] leading-snug">
                “{entry.title}”
              </h3>
              <p className="text-xs text-[#73716B] leading-relaxed">{entry.content}</p>
            </div>
            <div className="pt-3 border-t border-[#FAF9F5] flex items-center justify-between text-[10px] text-[#8F8D86]">
              <span>Kyoto Monologue Engine</span>
              <span>Washi #04</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
