import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { api, FocusAnalytics } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Clock,
  CheckCircle2,
  Sun,
  Activity,
  Sparkles,
  Zap,
  Flame,
  Calendar,
  Compass,
  ArrowUpRight
} from 'lucide-react';

const EMPTY_WEEKLY_DATA = [
  { day: 'Mon', deepFocus: 3.8, ambientWork: 2.2, circadianAlignment: 94 },
  { day: 'Tue', deepFocus: 4.2, ambientWork: 1.8, circadianAlignment: 92 },
  { day: 'Wed', deepFocus: 3.5, ambientWork: 2.5, circadianAlignment: 88 },
  { day: 'Thu', deepFocus: 5.1, ambientWork: 1.4, circadianAlignment: 96 },
  { day: 'Fri', deepFocus: 4.4, ambientWork: 2.0, circadianAlignment: 91 },
  { day: 'Sat', deepFocus: 2.5, ambientWork: 1.0, circadianAlignment: 85 },
  { day: 'Sun', deepFocus: 3.75, ambientWork: 1.2, circadianAlignment: 95 }
];

export const AnalyticsView: React.FC = () => {
  const { environment, overallFocusProgress } = useWorkspace();
  const [analytics, setAnalytics] = useState<FocusAnalytics | null>(null);

  useEffect(() => {
    const loadAnalytics = () => {
      api.getFocusAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
    };
    loadAnalytics();
    window.addEventListener('focus-session-recorded', loadAnalytics);
    return () => window.removeEventListener('focus-session-recorded', loadAnalytics);
  }, []);

  const weeklyData = analytics
    ? Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const entry = analytics.daily.find((item) => item.date === key);
      return {
        day: date.toLocaleDateString([], { weekday: 'short' }),
        deepFocus: Number(((entry?.seconds || 0) / 3600).toFixed(2)),
        ambientWork: 0,
        circadianAlignment: 0
      };
    })
    : EMPTY_WEEKLY_DATA;
  const totalHours = analytics ? Math.floor(analytics.totalSeconds / 3600) : 0;
  const totalMinutes = analytics ? Math.floor((analytics.totalSeconds % 3600) / 60) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE7DF]/60">
        <div className="flex items-center gap-2 text-[#865221] text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          <span>Biometric & Flow Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#242426] tracking-tight mt-1">
          Productivity & Bio-Pacing
        </h1>
        <p className="text-sm text-[#73716B]">
          Quantifying sustained cognitive endurance aligned to natural solar cycles.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Deep Focus Hours */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73716B]">
              Deep Focus Hours
            </span>
            <div className="w-7 h-7 rounded-full bg-[#C6ECC8] flex items-center justify-center text-[#00210B]">
              <Clock className="w-3.5 h-3.5 text-[#44664A]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#242426]">{totalHours}h {totalMinutes}m</div>
            <div className="flex items-center gap-1 text-[11px] text-[#44664A] mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{analytics ? `${analytics.completedSessions} completed sessions` : 'No sessions recorded yet'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Directive Completion */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73716B]">
              Directive Completion
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFDCC2] flex items-center justify-center text-[#2E1500]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#865221]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#242426]">84%</div>
            <div className="text-[11px] text-[#73716B] mt-1">
              {overallFocusProgress}% Phase 3 Edge Mesh completed
            </div>
          </div>
        </div>

        {/* Metric 3: Circadian Lux Alignment */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73716B]">
              Circadian Lux Alignment
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFE0B2] flex items-center justify-center text-[#865221]">
              <Sun className="w-3.5 h-3.5 text-[#865221]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#242426]">4500K</div>
            <div className="text-[11px] text-[#865221] mt-1 font-medium">
              Optimal • Transitioning to Sunset TrueTone
            </div>
          </div>
        </div>

        {/* Metric 4: Flow State Quality */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73716B]">
              Bio-Pacing Flow Score
            </span>
            <div className="w-7 h-7 rounded-full bg-[#CFE5FB] flex items-center justify-center text-[#051D2D]">
              <Sparkles className="w-3.5 h-3.5 text-[#4B6173]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#242426]">94 / 100</div>
            <div className="text-[11px] text-[#44664A] mt-1 font-medium">
              Serene Heart Rate Variability
            </div>
          </div>
        </div>
      </div>

      {/* Main Focus Endurance Recharts Visualization */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE7DF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base text-[#242426]">Weekly Focus Endurance</h3>
            <p className="text-xs text-[#73716B]">
              Hours of Deep Focus (Sage Green) vs. Ambient Collaboration (Peach Clay)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#44664A]" />
              <span className="text-[#424841]">Deep Focus (Hours)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FDB87E]" />
              <span className="text-[#424841]">Ambient Work (Hours)</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE6" vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: '#EAE7DF' }}
                tick={{ fill: '#73716B', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#EAE7DF' }}
                tick={{ fill: '#73716B', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                unit="h"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #EAE7DF',
                  boxShadow: '0 2px 10px rgba(36,36,38,0.05)',
                  fontSize: '12px',
                  fontFamily: 'Plus Jakarta Sans'
                }}
              />
              <Bar dataKey="deepFocus" name="Deep Focus" fill="#44664A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ambientWork" name="Ambient Work" fill="#FDB87E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Circadian Phase Timeline breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#865221]">
            08:00 – 12:00 • Morning Dawn
          </span>
          <h4 className="font-semibold text-sm text-[#242426]">High Cognitive Velocity</h4>
          <p className="text-xs text-[#73716B]">
            6500K daylight simulation. Baseline mesh architecture latency logging completed with zero context switching.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#44664A]">
            13:00 – 17:00 • Afternoon Sanctuary
          </span>
          <h4 className="font-semibold text-sm text-[#242426]">Deep Consolidation</h4>
          <p className="text-xs text-[#73716B]">
            4500K down to 3400K Sunset TrueTone. Desk lamp auto-attenuated to 70%, binaural audio at 20%.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EAE7DF] shadow-xs space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73716B]">
            17:30 – 19:00 • Sunset Retrospective
          </span>
          <h4 className="font-semibold text-sm text-[#242426]">Async Handover & Reflection</h4>
          <p className="text-xs text-[#73716B]">
            2700K warm candle glow. Session notes automatically logged to Notebooks Archive.
          </p>
        </div>
      </div>
    </div>
  );
};
