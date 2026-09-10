import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ViewMode, TaskItem, IndexedDocument, ChatMessage, AutomationRule, RoomEnvironmentState } from '../types';
import { startAmbientSound, stopAmbientSound, updateAmbientVolume } from '../utils/audio';
import { useAuth } from './AuthContext';
import { api, normalizeDocument, normalizeTask } from '../services/api';

interface WorkspaceContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  isFocusActive: boolean;
  toggleFocusSession: () => void;
  focusSecondsLeft: number;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  zenModeActive: boolean;
  setZenModeActive: (active: boolean) => void;
  takeBreathModalOpen: boolean;
  setTakeBreathModalOpen: (open: boolean) => void;
  environment: RoomEnvironmentState;
  setDeskLamp: (updates: Partial<RoomEnvironmentState['deskLamp']>) => void;
  setFocusAudio: (updates: Partial<RoomEnvironmentState['focusAudio']>) => void;
  setScreenWarmth: (updates: Partial<RoomEnvironmentState['screenWarmth']>) => void;
  soundscapeActive: boolean;
  toggleSoundscape: () => void;
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  documents: IndexedDocument[];
  addDocument: (name: string, type: 'markdown' | 'pdf' | 'text', size: string, content?: string) => void;
  uploadDocument: (file: File) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  documentsLoading: boolean;
  documentsError: string | null;
  documentsStatus: string | null;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;
  isChatLoading: boolean;
  chatError: string | null;
  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;
  addAutomation: (rule: Omit<AutomationRule, 'id'>) => void;
  toastMessage: string | null;
  notifications: string[];
  dismissNotification: (index: number) => void;
  clearNotifications: () => void;
  dismissToast: () => void;
  overallFocusProgress: number;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review latency telemetry logs with hardware team',
    note: 'Completed at 11:20 • 42ms baseline recorded',
    project: 'Edge Mesh Protocol',
    priority: 'High',
    status: 'completed',
    completed: true,
    phase: 'Phase 3',
    estimatedBlocks: 2,
    completedAt: '11:20 AM'
  },
  {
    id: 'task-2',
    title: 'Draft boundary validation specs for mesh relay',
    note: 'Currently active • Revision 2',
    project: 'Edge Mesh Protocol',
    priority: 'High',
    status: 'in_progress',
    completed: false,
    phase: 'Phase 3',
    estimatedBlocks: 3
  },
  {
    id: 'task-3',
    title: 'Prepare async briefing notes for sunset handover',
    note: 'Queued • 17:30 Sync',
    project: 'Kyoto Studio Operations',
    priority: 'Medium',
    status: 'todo',
    completed: false,
    phase: 'Handover',
    estimatedBlocks: 1
  },
  {
    id: 'task-4',
    title: 'Profile circadian lux sensor telemetry on peripheral hub',
    note: 'Awaiting laboratory calibration',
    project: 'Bio-Pacing Engine',
    priority: 'Medium',
    status: 'todo',
    completed: false,
    phase: 'Research',
    estimatedBlocks: 2
  },
  {
    id: 'task-5',
    title: 'Refactor audio attenuation curve for deep flow state',
    note: 'Tested with 40% to 20% logarithmic drop',
    project: 'Bio-Pacing Engine',
    priority: 'Low',
    status: 'completed',
    completed: true,
    phase: 'Optimization',
    estimatedBlocks: 1,
    completedAt: '09:45 AM'
  }
];

const INITIAL_DOCS: IndexedDocument[] = [
  {
    id: 'doc-1',
    title: 'Sprint Context & Direction (Kyoto Studio)',
    filename: 'Sprint_Context.md',
    size: '14.2 KB',
    tokenCount: 3420,
    indexedAt: 'Today, 09:15',
    status: 'Indexed',
    type: 'markdown',
    tags: ['Architecture', 'Sprint', 'Mesh'],
    preview: '# Kyoto Studio Sprint Context\nFocus Objective: Solidify the Edge Mesh protocol across distributed nodes. Maintain quiet concentration intervals between 13:00 and 17:00. Latency threshold must remain < 50ms.'
  },
  {
    id: 'doc-2',
    title: 'Edge Mesh Relay Protocol Architecture V3',
    filename: 'Edge_Mesh_Protocol_V3.pdf',
    size: '2.4 MB',
    tokenCount: 18450,
    indexedAt: 'Yesterday, 16:40',
    status: 'Indexed',
    type: 'pdf',
    tags: ['Specs', 'Telemetry', 'Hardware'],
    preview: 'Boundary validation rules for distributed mesh relay nodes. Includes fallbacks for packet loss, node dropout recovery, and cryptographic timestamp anchoring.'
  },
  {
    id: 'doc-3',
    title: 'Circadian Workplace Lighting & TrueTone Research',
    filename: 'Circadian_Lighting_Rules.md',
    size: '8.7 KB',
    tokenCount: 2150,
    indexedAt: 'Sep 06, 14:00',
    status: 'Indexed',
    type: 'markdown',
    tags: ['Ergonomics', 'Circadian', 'Sensors'],
    preview: 'Biological pacing guidelines: 6500K bright daylight in morning, tapering to 3400K at golden hour (16:30 - 17:45), down to 1800K warm candle warmth for evening wrap-up.'
  }
];

const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'rule-1',
    title: 'Focus Session Ambient Adaptation',
    trigger: 'Focus session starts',
    action: 'Dim desk light to 70%, mute speaker to 20%',
    enabled: true,
    category: 'lighting',
    lastTriggered: '14:20'
  },
  {
    id: 'rule-2',
    title: 'Circadian Color Shifting',
    trigger: 'Golden hour begins (16:30)',
    action: 'Shift screen warmth to 3400K Sunset TrueTone',
    enabled: true,
    category: 'lighting',
    lastTriggered: '16:30'
  },
  {
    id: 'rule-3',
    title: 'Bio-Pacing CO₂ Guardian',
    trigger: 'Air CO₂ level exceeds 800 ppm',
    action: 'Notify to take a 5m walking breath & adjust room airflow',
    enabled: true,
    category: 'health'
  },
  {
    id: 'rule-4',
    title: 'Daily Milestone Retrospective',
    trigger: 'Deep work milestone completed',
    action: 'Log reflection note to Notebooks Archive automatically',
    enabled: true,
    category: 'retrospective',
    lastTriggered: '11:20'
  },
  {
    id: 'rule-5',
    title: 'Gentle Rain Attenuation',
    trigger: 'Deep work interval reaches 25 minutes',
    action: 'Play soft chime and transition to low-tempo binaural tone',
    enabled: false,
    category: 'audio'
  }
];

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('desk');
  const [isFocusActive, setIsFocusActive] = useState<boolean>(false);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState<number>(25 * 60);
  const [focusStartedAt, setFocusStartedAt] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [zenModeActive, setZenModeActive] = useState<boolean>(false);
  const [takeBreathModalOpen, setTakeBreathModalOpen] = useState<boolean>(false);
  const [soundscapeActive, setSoundscapeActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const dismissNotification = (index: number) => setNotifications((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const clearNotifications = () => setNotifications([]);

  const [environment, setEnvironment] = useState<RoomEnvironmentState>({
    deskLamp: {
      enabled: true,
      brightness: 75,
      colorTemp: 2700
    },
    focusAudio: {
      enabled: true,
      volume: 40,
      soundType: 'rain'
    },
    screenWarmth: {
      autoTrueTone: true,
      currentTempK: 3400,
      targetDescription: 'Synchronized with solar cycle (Golden Hour transition in 42m)'
    },
    airQuality: {
      co2: 512,
      humidity: 48,
      status: 'Pristine'
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<IndexedDocument[]>(INITIAL_DOCS);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsStatus, setDocumentsStatus] = useState<string | null>(null);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const preferencesHydrated = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      preferencesHydrated.current = false;
      return;
    }
    api.getPreferences()
      .then((preferences) => {
        if (preferences.environment && typeof preferences.environment === 'object') {
          setEnvironment((current) => ({ ...current, ...(preferences.environment as Partial<RoomEnvironmentState>) }));
        }
        if (Array.isArray(preferences.automations)) {
          setAutomations(preferences.automations as AutomationRule[]);
        }
        preferencesHydrated.current = true;
      })
      .catch(() => {
        preferencesHydrated.current = true;
        showToast('Could not load saved workspace preferences');
      });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !preferencesHydrated.current) return;
    api.updatePreferences({ environment, automations })
      .catch(() => showToast('Could not save workspace preferences'));
  }, [isAuthenticated, environment, automations]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setDocuments([]);
    api.listTasks()
      .then((items) => setTasks(items.map(normalizeTask)))
      .catch(() => showToast('API unavailable • showing local workspace data'));
    setDocumentsLoading(true);
    setDocumentsError(null);
    api.listDocuments()
      .then((items) => setDocuments(items.map(normalizeDocument)))
      .catch((error) => {
        setDocumentsError(error instanceof Error ? error.message : 'Unable to load documents.');
      })
      .finally(() => setDocumentsLoading(false));
  }, [isAuthenticated]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: 'Good afternoon. I have indexed your Sprint Context and Edge Mesh Protocol documents. What context would you like to retrieve or synthesize?',
      timestamp: '16:40',
      sourceCitations: ['Sprint_Context.md']
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Timer effect for active focus session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusActive) {
      interval = setInterval(() => {
        setFocusSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsFocusActive(false);
            if (isAuthenticated) {
              api.createFocusSession({
                durationSeconds: 25 * 60,
                completed: true,
                startedAt: new Date(focusStartedAt || Date.now() - 25 * 60 * 1000).toISOString(),
                endedAt: new Date().toISOString()
              }).then(() => window.dispatchEvent(new Event('focus-session-recorded')))
                .catch(() => showToast('Focus cycle completed, but could not sync analytics'));
            }
            setFocusStartedAt(null);
            setToastMessage('Focus cycle complete. Take a gentle moment to stretch.');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusStartedAt, isAuthenticated]);

  // Sync ambient audio volume if soundscape or focusAudio is active
  useEffect(() => {
    if (soundscapeActive && environment.focusAudio.enabled) {
      updateAmbientVolume(environment.focusAudio.volume / 100);
    }
  }, [environment.focusAudio.volume, environment.focusAudio.enabled, soundscapeActive]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const showToast = (msg: string) => {
    setNotifications((current) => [msg, ...current].slice(0, 8));
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  const dismissToast = () => setToastMessage(null);

  const toggleFocusSession = () => {
    setIsFocusActive((prev) => {
      const next = !prev;
      if (next) {
        setFocusStartedAt(Date.now());
        // Automation check: if rule-1 is enabled, auto-dim lamp to 70% and attenuate audio to 20%
        const isDimRuleOn = automations.find((r) => r.id === 'rule-1')?.enabled ?? true;
        if (isDimRuleOn) {
          setEnvironment((env) => ({
            ...env,
            deskLamp: { ...env.deskLamp, brightness: 70 },
            focusAudio: { ...env.focusAudio, volume: 20 }
          }));
          showToast('Focus session active • Ambient light dimmed to 70%, audio attenuated to 20%');
        } else {
          const durationSeconds = 25 * 60 - focusSecondsLeft;
          if (isAuthenticated && durationSeconds > 0) {
            api.createFocusSession({
              durationSeconds,
              completed: false,
              startedAt: new Date(focusStartedAt || Date.now() - durationSeconds * 1000).toISOString(),
              endedAt: new Date().toISOString()
            }).then(() => window.dispatchEvent(new Event('focus-session-recorded')))
              .catch(() => showToast('Focus session paused, but could not sync analytics'));
          }
          setFocusStartedAt(null);
          showToast('Focus session active • Deep work timer running');
        }
        // Auto-enable rain soundscape quietly if requested
        if (!soundscapeActive && environment.focusAudio.enabled) {
          startAmbientSound(0.2);
          setSoundscapeActive(true);
        }
      } else {
        // Restore comfortable ambient levels
        setEnvironment((env) => ({
          ...env,
          deskLamp: { ...env.deskLamp, brightness: 75 },
          focusAudio: { ...env.focusAudio, volume: 40 }
        }));
        showToast('Focus session paused • Ambient balance restored to default');
      }
      return next;
    });
  };

  const setDeskLamp = (updates: Partial<RoomEnvironmentState['deskLamp']>) => {
    setEnvironment((env) => ({
      ...env,
      deskLamp: { ...env.deskLamp, ...updates }
    }));
  };

  const setFocusAudio = (updates: Partial<RoomEnvironmentState['focusAudio']>) => {
    setEnvironment((env) => {
      const nextAudio = { ...env.focusAudio, ...updates };
      if (soundscapeActive && nextAudio.enabled) {
        updateAmbientVolume(nextAudio.volume / 100);
      }
      return {
        ...env,
        focusAudio: nextAudio
      };
    });
  };

  const setScreenWarmth = (updates: Partial<RoomEnvironmentState['screenWarmth']>) => {
    setEnvironment((env) => ({
      ...env,
      screenWarmth: { ...env.screenWarmth, ...updates }
    }));
  };

  const toggleSoundscape = () => {
    setSoundscapeActive((prev) => {
      const next = !prev;
      if (next) {
        startAmbientSound(environment.focusAudio.volume / 100);
        showToast('Rain soundscape active • Binaural brown noise calibrated');
      } else {
        stopAmbientSound();
        showToast('Soundscape muted');
      }
      return next;
    });
  };

  const toggleTask = (id: string) => {
    if (isAuthenticated && !id.startsWith('task-')) {
      const current = tasks.find((task) => task.id === id);
      if (current) api.updateTask(id, !current.completed).catch(() => showToast('Could not sync task change'));
    }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const nextStatus = nextCompleted ? 'completed' : 'in_progress';
          if (nextCompleted) {
            showToast(`Milestone completed: "${t.title.slice(0, 36)}..."`);
          }
          return {
            ...t,
            completed: nextCompleted,
            status: nextStatus,
            completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return t;
      })
    );
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'completed'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: taskData.status === 'completed'
    };
    setTasks((prev) => [newTask, ...prev]);
    if (isAuthenticated) api.createTask(taskData).catch(() => showToast('Could not save task to the workspace'));
    showToast(`Task added: "${newTask.title}"`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (isAuthenticated && !id.startsWith('task-')) api.deleteTask(id).catch(() => showToast('Could not sync task removal'));
    showToast('Task removed');
  };

  const addDocument = (name: string, type: 'markdown' | 'pdf' | 'text', size: string, previewText?: string) => {
    const newDoc: IndexedDocument = {
      id: `doc-${Date.now()}`,
      title: name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      filename: name,
      size: size || '18 KB',
      tokenCount: Math.floor(Math.random() * 4000) + 1200,
      indexedAt: 'Just now',
      status: 'Indexed',
      type: type,
      tags: ['Workspace', 'Context', 'Directives'],
      preview: previewText || `# ${name}\nContext document indexed into Kyoto Sanctuary RAG engine. Semantic vectors generated for fast retrieval.`
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Indexed document: "${name}"`);
  };

  const uploadDocument = async (file: File) => {
    setDocumentsError(null);
    setDocumentsStatus(`Uploading ${file.name}…`);
    if (isAuthenticated) {
      try {
        const uploaded = await api.uploadDocument(file);
        setDocuments((prev) => [normalizeDocument(uploaded), ...prev]);
        setDocumentsStatus(null);
        showToast(`Indexed document: "${file.name}"`);
      } catch (error) {
        setDocumentsStatus(null);
        setDocumentsError(error instanceof Error ? error.message : 'Unable to upload document.');
      }
      return;
    }
    const isMarkdown = file.name.endsWith('.md') || file.name.endsWith('.markdown');
    const type = isMarkdown ? 'markdown' : file.name.endsWith('.pdf') ? 'pdf' : 'text';
    const size = `${(file.size / 1024).toFixed(1)} KB`;
    if (file.type.startsWith('text/') || isMarkdown) {
      const reader = new FileReader();
      reader.onload = () => {
        addDocument(file.name, type, size, reader.result as string);
        setDocumentsStatus(null);
      };
      reader.onerror = () => setDocumentsStatus(null);
      reader.readAsText(file);
    } else {
      addDocument(file.name, type, size);
      setDocumentsStatus(null);
    }
  };

  const removeDocument = async (id: string) => {
    setDocumentsError(null);
    if (isAuthenticated && !id.startsWith('doc-')) {
      try {
        await api.deleteDocument(id);
      } catch (error) {
        setDocumentsError(error instanceof Error ? error.message : 'Unable to remove document.');
        return;
      }
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Document removed from index');
  };

  const sendChatMessage = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    setChatError(null);

    const addMockReply = () => {
      let reply = '';
      let citations: string[] = [];

      const query = userPrompt.toLowerCase();
      if (query.includes('latency') || query.includes('mesh') || query.includes('relay')) {
        reply = 'According to "Edge_Mesh_Protocol_V3.pdf" and "Sprint_Context.md", Phase 3 boundary validation requires latency to stay below 42ms. The hardware baseline was recorded at 11:20 today with zero frame drops during the peer synchronization pass.';
        citations = ['Edge_Mesh_Protocol_V3.pdf', 'Sprint_Context.md'];
      } else if (query.includes('circadian') || query.includes('light') || query.includes('truetone') || query.includes('sun')) {
        reply = 'Per "Circadian_Lighting_Rules.md", your ambient desk lamp is scheduled to shift from 3400K Sunset warmth down to 2700K at 17:30. During active focus sessions, brightness automatically drops to 70% to eliminate peripheral retinal glare.';
        citations = ['Circadian_Lighting_Rules.md'];
      } else if (query.includes('sprint') || query.includes('milestone') || query.includes('today')) {
        reply = 'The primary directive for Kyoto Studio today is "Synchronize Edge Mesh Protocol" (Phase 3). One milestone was completed at 11:20 (latency telemetry logs), and boundary validation specs are currently active on Revision 2.';
        citations = ['Sprint_Context.md'];
      } else {
        reply = `Synthesizing across ${documents.length} indexed documents: Regarding "${userPrompt}", your Kyoto studio sanctuary notes emphasize maintaining unhurried, single-threaded depth. Boundary specifications and asynchronous briefings are prioritized before the 17:30 handover.`;
        citations = [documents[0]?.filename || 'Sprint_Context.md'];
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceCitations: citations
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsChatLoading(false);
    };

    if (isAuthenticated) {
      try {
        const response = await api.chat(userPrompt.trim());
        const sources = (response.sources || []).map((source) => {
          if (typeof source === 'string') return source;
          return source.title || source.name || source.filename || 'Workspace context';
        });
        const actions = (response.actions || []).map((action) =>
          typeof action === 'string' ? action : action.label || action.title || action.name || 'Suggested action'
        );
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sourceCitations: sources,
            suggestions: response.suggestions || [],
            actions
          }
        ]);
      } catch (error) {
        setChatError(error instanceof Error ? error.message : 'Unable to reach the AI assistant.');
      } finally {
        setIsChatLoading(false);
      }
      return;
    }

    // Keep the local response only until the authenticated API returns.
    setTimeout(addMockReply, 800);
  };

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.enabled;
          showToast(`Automation "${r.title}" ${next ? 'enabled' : 'disabled'}`);
          return { ...r, enabled: next };
        }
        return r;
      })
    );
  };

  const addAutomation = (ruleData: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setAutomations((prev) => [newRule, ...prev]);
    showToast(`Rule created: "${newRule.title}"`);
  };

  // Calculate consolidation progress: default 68% in design, dynamically scaled by completed items
  const primaryTasks = tasks.filter((t) => t.project === 'Edge Mesh Protocol');
  const completedCount = primaryTasks.filter((t) => t.completed).length;
  // If first item is done, start around 68%, scale to 100% when all done
  const overallFocusProgress = primaryTasks.length > 0
    ? Math.min(100, Math.round(35 + (completedCount / primaryTasks.length) * 65))
    : 68;

  return (
    <WorkspaceContext.Provider
      value={{
        currentView,
        setCurrentView,
        isFocusActive,
        toggleFocusSession,
        focusSecondsLeft,
        isSidebarCollapsed,
        toggleSidebar,
        zenModeActive,
        setZenModeActive,
        takeBreathModalOpen,
        setTakeBreathModalOpen,
        environment,
        setDeskLamp,
        setFocusAudio,
        setScreenWarmth,
        soundscapeActive,
        toggleSoundscape,
        tasks,
        toggleTask,
        addTask,
        deleteTask,
        documents,
        addDocument,
        uploadDocument,
        removeDocument,
        documentsLoading,
        documentsError,
        documentsStatus,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        chatError,
        automations,
        toggleAutomation,
        addAutomation,
        toastMessage,
        notifications,
        dismissNotification,
        clearNotifications,
        dismissToast: () => setToastMessage(null),
        overallFocusProgress
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
