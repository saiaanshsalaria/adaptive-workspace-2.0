export type ViewMode = 'desk' | 'vision' | 'tasks' | 'documents' | 'analytics' | 'automations' | 'notebooks' | 'reflection';

export interface TaskItem {
  id: string;
  title: string;
  note: string;
  project?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'in_progress' | 'completed';
  completed: boolean;
  phase?: string;
  estimatedBlocks?: number;
  completedAt?: string;
}

export interface IndexedDocument {
  id: string;
  title: string;
  filename: string;
  size: string;
  tokenCount: number;
  indexedAt: string;
  status: 'Indexed' | 'Processing';
  type: 'markdown' | 'pdf' | 'text';
  preview: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceCitations?: string[];
  suggestions?: string[];
  actions?: string[];
}

export interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  enabled: boolean;
  category: 'lighting' | 'audio' | 'health' | 'retrospective';
  lastTriggered?: string;
}

export interface RoomEnvironmentState {
  deskLamp: {
    enabled: boolean;
    brightness: number; // 0 - 100
    colorTemp: number; // 2700K
  };
  focusAudio: {
    enabled: boolean;
    volume: number; // 0 - 100
    soundType: 'rain' | 'binaural' | 'waves';
  };
  screenWarmth: {
    autoTrueTone: boolean;
    currentTempK: number;
    targetDescription: string;
  };
  airQuality: {
    co2: number;
    humidity: number;
    status: 'Pristine' | 'Optimal' | 'Caution';
  };
}
