/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomDock } from './components/BottomDock';
import { ZenOverlay } from './components/ZenOverlay';
import { DeskView } from './views/DeskView';
import { TasksView } from './views/TasksView';
import { DocumentsView } from './views/DocumentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AutomationsView } from './views/AutomationsView';
import { NotebooksView } from './views/NotebooksView';
import { ReflectionView } from './views/ReflectionView';
import { VisionView } from './views/VisionView';
import { Sparkles, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';

const WorkspaceContent: React.FC = () => {
  const { currentView, toastMessage, dismissToast } = useWorkspace();

  const renderActiveView = () => {
    switch (currentView) {
      case 'desk':
        return <DeskView />;
      case 'tasks':
        return <TasksView />;
      case 'vision':
        return <VisionView />;
      case 'documents':
        return <DocumentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'automations':
        return <AutomationsView />;
      case 'notebooks':
        return <NotebooksView />;
      case 'reflection':
        return <ReflectionView />;
      default:
        return <DeskView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#242426] flex flex-col selection:bg-[#C8E6C9] selection:text-[#1c331f] relative">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md border border-[#EAE7DF] px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(36,36,38,0.08)] flex items-center gap-2.5 text-xs text-[#242426]">
            <Sparkles className="w-3.5 h-3.5 text-[#44664A] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={dismissToast}
              className="p-1 hover:bg-[#F2EFE8] rounded-full text-[#73716B]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header />

      {/* Main Workspace Body with Collapsible Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-y-auto pb-24 transition-all">
          {renderActiveView()}

          {/* Footer matching Kyoto Sanctuary theme */}
          <footer className="w-full border-t border-[#EAE7DF] py-8 mt-12 bg-[#FAF9F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#73716B] text-xs">
              <span>Designed for deep, unhurried thought.</span>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#44664A]" />
                  <span>Serene Mode Active</span>
                </span>
                <span>© Adaptive Workspace</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Zen Mode Dock */}
      <BottomDock />

      {/* Full-Screen Zen Overlay and Guided Breathing Modal */}
      <ZenOverlay />
    </div>
  );
};

export default function App() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthGate />;
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}
