import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Compass,
  CheckSquare,
  FileText,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  HeartPulse,
  Wind,
  Camera
} from 'lucide-react';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    toggleSidebar,
    tasks,
    documents,
    automations,
    environment,
    isFocusActive
  } = useWorkspace();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const activeAutomationsCount = automations.filter((a) => a.enabled).length;

  const menuItems: {
    id: ViewMode;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    {
      id: 'desk',
      label: 'Desk',
      description: 'Kyoto Studio Sanctuary',
      icon: Compass
    },
    {
      id: 'tasks',
      label: 'Projects & Directives',
      description: 'Phase 3 Mesh & Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount
    },
    {
      id: 'vision',
      label: 'Adaptive Vision',
      description: 'Private on-device signals',
      icon: Camera
    },
    {
      id: 'documents',
      label: 'Context & RAG',
      description: 'Indexed specs & intelligence',
      icon: FileText,
      badge: documents.length
    },
    {
      id: 'analytics',
      label: 'Productivity & Bio-Pacing',
      description: 'Circadian endurance',
      icon: BarChart3
    },
    {
      id: 'automations',
      label: 'Adaptive Engine',
      description: 'IoT & ambient trigger rules',
      icon: Sliders,
      badge: `${activeAutomationsCount} on`
    },
    {
      id: 'notebooks',
      label: 'Notebooks Archive',
      description: 'Daily monologue logs',
      icon: BookOpen
    },
    {
      id: 'reflection',
      label: 'Daily Reflection',
      description: 'Sunset retrospective',
      icon: HeartPulse
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#EAE7DF] bg-[#FAF9F5] transition-all duration-300 select-none z-30 shrink-0 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Sidebar Header */}
      <div className="p-3.5 border-b border-[#EAE7DF]/80 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-[#769A7A] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#73716B]">
              Kyoto Sanctuary
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-[#73716B] hover:text-[#242426] hover:bg-[#F1EDE6] transition-colors ${
            isSidebarCollapsed ? 'mx-auto' : 'ml-auto'
          }`}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 relative group ${
                isActive
                  ? 'bg-white text-[#242426] shadow-sm font-semibold border border-[#EAE7DF]'
                  : 'text-[#73716B] hover:text-[#242426] hover:bg-[#F2EFE8]/70'
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#44664A] bg-[#C8E6C9]/40'
                    : 'text-[#73716B] group-hover:text-[#242426]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <div className="text-xs tracking-tight truncate leading-snug">{item.label}</div>
                    <div className="text-[10px] text-[#8F8D86] truncate leading-none">
                      {item.description}
                    </div>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1.5 shrink-0 ${
                        isActive
                          ? 'bg-[#C8E6C9] text-[#1C331F]'
                          : 'bg-[#EAE7DF] text-[#73716B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Atmosphere Pill (When Expanded) */}
      {!isSidebarCollapsed && (
        <div className="p-3 m-3 bg-white rounded-2xl border border-[#EAE7DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#73716B] flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#769A7A]" /> Air CO₂
            </span>
            <span className="font-semibold text-[#242426]">{environment.airQuality.co2} ppm</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#73716B]">Circadian Mode</span>
            <span className="text-[#865221] bg-[#FFE0B2]/60 px-1.5 py-0.5 rounded text-[10px] font-medium">
              Sunset 3400K
            </span>
          </div>
          {isFocusActive && (
            <div className="pt-1.5 border-t border-[#EAE7DF] flex items-center justify-between text-[11px] text-[#44664A] font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#44664A] animate-ping" />
                Focus Mode Active
              </span>
              <span>-5% glare</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
