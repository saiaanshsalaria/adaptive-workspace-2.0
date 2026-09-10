import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Check,
  Clock,
  Tag,
  Trash2,
  AlertCircle,
  FolderKanban,
  X
} from 'lucide-react';
import { TaskItem } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask } = useWorkspace();
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newProject, setNewProject] = useState('Edge Mesh Protocol');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newPhase, setNewPhase] = useState('Phase 3');
  const [newBlocks, setNewBlocks] = useState(2);

  const projects = Array.from(new Set(tasks.map((t) => t.project || 'General Directives')));

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? task.completed
        : task.status === filterStatus;
    const matchesProject = selectedProject === 'all' || task.project === selectedProject;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProject && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      note: newNote.trim() || 'Custom directive queued',
      project: newProject,
      priority: newPriority,
      status: 'todo',
      phase: newPhase,
      estimatedBlocks: newBlocks
    });

    setNewTitle('');
    setNewNote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header with Title and Add Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF]/60">
        <div>
          <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Directives & Focus Backlog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
            Projects & Directives
          </h1>
          <p className="text-sm text-[#73716B]">
            Structured focus blocks organized by priority, project, and circadian rhythm.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold rounded-full shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Directive</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EAE7DF] shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-[#C8E6C9] text-[#1C331F] font-semibold'
                  : 'text-[#73716B] hover:text-[#242426] hover:bg-[#F7F3EB]'
              }`}
            >
              {status === 'in_progress' ? 'In Progress' : status}
            </button>
          ))}
        </div>

        {/* Project Selector & Search */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl px-2.5 py-1.5 text-[#242426] focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#73716B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directives or notes..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#F7F3EB] border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-1 focus:ring-[#44664A]"
            />
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE7DF] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#73716B] mx-auto">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-[#242426]">No directives match filters</h3>
            <p className="text-xs text-[#73716B] max-w-sm mx-auto">
              All tasks in this category have either been settled or no items match your search.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                task.completed ? 'border-[#EAE7DF] opacity-80' : 'border-[#EAE7DF] hover:border-[#C2C8BF]'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    task.completed
                      ? 'bg-[#44664A] text-white'
                      : 'border border-[#C2C8BF] bg-white hover:border-[#769A7A]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      onClick={() => toggleTask(task.id)}
                      className={`text-sm font-semibold cursor-pointer transition-colors ${
                        task.completed ? 'line-through text-[#73716B]' : 'text-[#242426]'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        task.priority === 'High'
                          ? 'bg-[#FFDAD6] text-[#93000A]'
                          : task.priority === 'Medium'
                          ? 'bg-[#FFDCC2] text-[#6A3B0B]'
                          : 'bg-[#F1EDE6] text-[#424841]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-[#73716B]">{task.note}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#8F8D86]">
                    <span className="flex items-center gap-1">
                      <FolderKanban className="w-3 h-3 text-[#769A7A]" /> {task.project}
                    </span>
                    {task.phase && <span>• {task.phase}</span>}
                    {task.estimatedBlocks && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.estimatedBlocks} focus blocks
                      </span>
                    )}
                    {task.completedAt && (
                      <span className="text-[#44664A] font-medium">
                        Completed {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${
                    task.status === 'completed'
                      ? 'bg-[#C6ECC8] text-[#00210B]'
                      : task.status === 'in_progress'
                      ? 'bg-[#FFDCC2] text-[#6A3B0B]'
                      : 'bg-[#F1EDE6] text-[#424841]'
                  }`}
                >
                  {task.status === 'in_progress' ? 'Active' : task.status}
                </span>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-[#8F8D86] hover:text-[#93000A] hover:bg-[#FFDAD6]/40 rounded-lg transition-colors"
                  title="Remove Directive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#242426]/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE7DF] pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#44664A]" />
                <h3 className="font-semibold text-base text-[#242426]">Add New Directive</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#73716B] hover:text-[#242426]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">Directive Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Profile mesh packet loss over cellular fallback"
                  className="w-full text-xs p-2.5 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-1 focus:ring-[#44664A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#73716B]">Context & Notes</label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Target latency baseline under 45ms with 0.1% loss"
                  className="w-full text-xs p-2.5 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none focus:ring-1 focus:ring-[#44664A] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#73716B]">Project Domain</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                  >
                    <option value="Edge Mesh Protocol">Edge Mesh Protocol</option>
                    <option value="Kyoto Studio Operations">Kyoto Studio Operations</option>
                    <option value="Bio-Pacing Engine">Bio-Pacing Engine</option>
                    <option value="Circadian Firmware">Circadian Firmware</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#73716B]">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')
                    }
                    className="w-full text-xs p-2 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                  >
                    <option value="High">High (Deep Work)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Low">Low (Administrative)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#73716B]">Phase Tag</label>
                  <input
                    type="text"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                    placeholder="e.g. Phase 3"
                    className="w-full text-xs p-2 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#73716B]">
                    Estimated Focus Blocks (25m)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newBlocks}
                    onChange={(e) => setNewBlocks(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-white border border-[#EAE7DF] rounded-xl text-[#242426] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE7DF]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#EAE7DF] text-xs font-semibold text-[#73716B] hover:bg-[#F2EFE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#44664A] hover:bg-[#38553D] text-white text-xs font-semibold shadow-xs"
                >
                  Queue Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
