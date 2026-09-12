import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, Lightbulb, LockKeyhole, MonitorUp, Pause, Play, ShieldCheck, Sparkles, Sun, UserRound } from 'lucide-react';
import { FilesetResolver, PoseLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision';
import { useWorkspace } from '../context/WorkspaceContext';
import { extractVisionFeatures, lightingScore } from '../vision/features';
import { estimateFatigue, estimatePosture } from '../vision/heuristic';
import { predictPosture, type PostureLabel } from '../vision/inference';

type CameraStatus = 'idle' | 'starting' | 'live' | 'denied' | 'unsupported';
type ModelStatus = 'loading' | 'ready' | 'unavailable';
const POSE_MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';

const drawPose = (canvas: HTMLCanvasElement, landmarks: NormalizedLandmark[][], width: number, height: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = width; canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  if (!landmarks[0]) return;
  ctx.fillStyle = '#C8E6C9';
  landmarks[0].forEach(({ x, y, visibility }) => {
    if ((visibility ?? 1) > 0.45) { ctx.beginPath(); ctx.arc(x * width, y * height, 3, 0, Math.PI * 2); ctx.fill(); }
  });
};

export const VisionView: React.FC = () => {
  const { environment, setDeskLamp, setScreenWarmth, setCurrentView } = useWorkspace();
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const landmarker = useRef<PoseLandmarker | null>(null);
  const lastNose = useRef<NormalizedLandmark | undefined>();
  const sessionStarted = useRef<number | null>(null);
  const postureBaseline = useRef<number | null>(null);
  const calibrationSamples = useRef<number[]>([]);
  const smoothedLighting = useRef(72);
  const smoothedPosture = useRef<number | null>(null);
  const smoothedFatigue = useRef<number | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [lighting, setLighting] = useState(72);
  const [postureScore, setPostureScore] = useState<number | null>(null);
  const [postureLabel, setPostureLabel] = useState<PostureLabel | null>(null);
  const [postureConfidence, setPostureConfidence] = useState<number | null>(null);
  const [fatigueScore, setFatigueScore] = useState<number | null>(null);

  const stop = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    landmarker.current?.close();
    landmarker.current = null;
    if (video.current) video.current.srcObject = null;
    if (canvas.current) canvas.current.getContext('2d')?.clearRect(0, 0, canvas.current.width, canvas.current.height);
    sessionStarted.current = null;
    lastNose.current = undefined;
    postureBaseline.current = null;
    calibrationSamples.current = [];
    smoothedLighting.current = 72;
    smoothedPosture.current = null;
    smoothedFatigue.current = null;
    setPostureScore(null); setPostureLabel(null); setPostureConfidence(null);
    setFatigueScore(null); setStatus('idle'); setModelStatus('loading');
  };

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('unsupported'); return; }
    setStatus('starting');
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (video.current) { video.current.srcObject = stream.current; await video.current.play(); }
      sessionStarted.current = Date.now();
      setStatus('live');
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        landmarker.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: POSE_MODEL, delegate: 'GPU' },
          runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: 0.55,
          minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5,
        });
        setModelStatus('ready');
      } catch {
        setModelStatus('unavailable');
      }
    } catch { setStatus('denied'); }
  };

  useEffect(() => () => stop(), []);
  useEffect(() => {
    if (status !== 'live') return;
    const id = window.setInterval(() => {
      if (!video.current || !canvas.current || video.current.readyState < 2) return;
      canvas.current.width = video.current.videoWidth || 640; canvas.current.height = video.current.videoHeight || 360;
      const ctx = canvas.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video.current, 0, 0, 24, 18);
        const data = ctx.getImageData(0, 0, 24, 18).data;
        let total = 0; for (let i = 0; i < data.length; i += 4) total += (data[i] + data[i + 1] + data[i + 2]) / 3;
        const lightingReading = lightingScore(total / (data.length / 4));
        smoothedLighting.current = smoothedLighting.current * 0.75 + lightingReading * 0.25;
        setLighting(Math.max(0, Math.min(100, Math.round(smoothedLighting.current))));
      }
      if (!landmarker.current) return;
      const result = landmarker.current.detectForVideo(video.current, performance.now());
      const pose = result.landmarks[0];
      if (!pose) { setPostureScore(null); return; }
      const features = extractVisionFeatures(pose, lastNose.current);
      if (!features || features.visibility < 0.45) {
        setPostureScore(null);
        setPostureLabel('not_visible');
        setPostureConfidence(Math.round((features?.visibility ?? 0) * 100));
        return;
      }
      if (calibrationSamples.current.length < 15) {
        calibrationSamples.current.push(features.shoulderHeight);
        postureBaseline.current = calibrationSamples.current.reduce((sum, value) => sum + value, 0) / calibrationSamples.current.length;
      }
      const postureReading = estimatePosture(features, postureBaseline.current);
      const modelPrediction = predictPosture(features, postureBaseline.current);
      const useFallback = modelPrediction.confidence < 55 || modelPrediction.label === 'not_visible';
      const postureEstimate = useFallback ? postureReading.score : modelPrediction.score;
      smoothedPosture.current = smoothedPosture.current === null
        ? postureEstimate
        : smoothedPosture.current * 0.7 + postureEstimate * 0.3;
      setPostureScore(Math.round(smoothedPosture.current));
      setPostureLabel(useFallback ? 'good_posture' : modelPrediction.label);
      setPostureConfidence(useFallback ? postureReading.confidence : modelPrediction.confidence);
      const now = Date.now();
      lastNose.current = pose[0];
      const elapsedMinutes = sessionStarted.current ? (now - sessionStarted.current) / 60000 : 0;
      const fatigueReading = estimateFatigue(elapsedMinutes, features).score;
      smoothedFatigue.current = smoothedFatigue.current === null
        ? fatigueReading
        : smoothedFatigue.current * 0.8 + fatigueReading * 0.2;
      setFatigueScore(Math.round(smoothedFatigue.current));
      drawPose(canvas.current, result.landmarks, video.current.videoWidth || 640, video.current.videoHeight || 360);
    }, 700);
    return () => window.clearInterval(id);
  }, [status]);

  const running = status === 'live' || status === 'starting';
  const postureValue = postureScore ?? 0;
  const fatigueValue = fatigueScore ?? 0;
  const suggestions = [
    ...(lighting < 55 ? ['Add a little front light to reduce eye strain.'] : []),
    ...(postureLabel === 'slouching' ? ['Try raising your monitor and relaxing your shoulders.'] : []),
    ...(postureLabel === 'leaning_left' || postureLabel === 'leaning_right' ? ['Center your chair and relax into a supported position.'] : []),
    ...(fatigueScore !== null && fatigueScore > 65 ? ['This estimate suggests a short movement break may help.'] : []),
  ];
  return <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE7DF]/60 pb-5">
      <div><div className="flex items-center gap-2 text-[#44664A] text-xs font-semibold uppercase tracking-wider"><Sparkles className="w-3.5 h-3.5" /> Adaptive Vision</div><h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">A gentler read of your workspace</h1><p className="text-sm text-[#73716B] mt-1 max-w-2xl">Optional, non-medical signals to help shape your environment. Estimates are not a health, posture, or attention assessment.</p></div>
      <div className="flex items-center gap-2 text-xs text-[#44664A] bg-[#C8E6C9]/40 border border-[#C8E6C9] rounded-full px-3 py-2"><LockKeyhole className="w-3.5 h-3.5" /> Camera stays in this browser</div>
    </header>
    <div className="rounded-xl border border-[#E7D7B5] bg-[#FFF8E8] px-4 py-3 text-xs text-[#6D572B]">
      <b>Expo demo model:</b> posture labels are generated by a synthetic-data prototype (`synthetic-posture-v1`), not a clinically validated system. Confidence is an on-device estimate.
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE7DF] shadow-xs overflow-hidden">
        <div className="aspect-video bg-[#242426] relative"><video ref={video} muted playsInline className={`w-full h-full object-cover ${status === 'live' ? 'block' : 'hidden'}`} /><canvas ref={canvas} className="absolute inset-0 w-full h-full pointer-events-none" />{status !== 'live' && <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/80 p-6"><Camera className="w-10 h-10 mb-3 text-[#C8E6C9]" /><p className="text-sm font-medium">{status === 'denied' ? 'Camera permission was not granted' : status === 'unsupported' ? 'This browser does not support camera access' : 'Camera is off by default'}</p><p className="text-xs text-white/55 mt-1">No frames are uploaded or recorded.</p></div>}{status === 'live' && <span className="absolute top-3 left-3 bg-black/55 text-white text-[11px] rounded-full px-2.5 py-1">● Live, on-device</span>}</div>
        <div className="p-5 flex flex-wrap items-center justify-between gap-3"><div className="text-xs text-[#73716B]"><b className="text-[#242426]">Status:</b> {status === 'live' ? modelStatus === 'ready' ? 'Analyzing locally' : 'Camera live · pose model unavailable' : status === 'starting' ? 'Requesting permission…' : status === 'denied' ? 'Permission denied · lighting still available' : status === 'unsupported' ? 'Unavailable · lighting still available' : 'Ready when you are'}</div><button onClick={running ? stop : start} disabled={status === 'starting'} className="inline-flex items-center gap-2 rounded-full bg-[#44664A] text-white px-4 py-2 text-xs font-semibold disabled:opacity-60">{running ? <><Pause className="w-3.5 h-3.5" /> Stop camera</> : <><Play className="w-3.5 h-3.5 fill-current" /> Start camera</>}</button></div>
      </section>
      <section className="lg:col-span-5 space-y-4"><div className="bg-white rounded-2xl border border-[#EAE7DF] p-5"><div className="flex justify-between mb-4"><h2 className="font-semibold">Workspace signals</h2><span className="text-[10px] uppercase text-[#73716B]">On-device estimates</span></div><Signal icon={<Sun className="w-4 h-4" />} label="Lighting" value={lighting} /><Signal icon={<UserRound className="w-4 h-4" />} label="Posture alignment" value={postureValue} muted={postureScore === null} /><div className="flex justify-between text-[11px] text-[#73716B] -mt-2 mb-4"><span>Model label: {postureLabel?.replace('_', ' ') || '—'}</span><span>{postureConfidence === null ? '—' : `${postureConfidence}% confidence`}</span></div><Signal icon={<Eye className="w-4 h-4" />} label="Fatigue estimate" value={fatigueValue} muted={fatigueScore === null} /><p className="text-[11px] text-[#8F8D86] mt-4">Pose landmarks are processed locally and immediately discarded. Fatigue uses stillness, head movement, and session elapsed time as non-medical proxies.</p></div><div className="bg-[#F7F3EB] rounded-2xl border border-[#EAE7DF] p-5 space-y-3"><h2 className="font-semibold text-sm">How it works</h2><div className="flex items-start gap-3 text-xs text-[#424841]"><MonitorUp className="w-4 h-4 text-[#44664A] mt-0.5" />Synthetic posture prototypes classify normalized shoulder, head, and torso features.</div><div className="flex items-start gap-3 text-xs text-[#424841]"><Eye className="w-4 h-4 text-[#44664A] mt-0.5" />Movement patterns and session duration inform the fatigue signal. It is not medical advice.</div></div></section>
    </div>
    <section className="bg-white rounded-2xl border border-[#EAE7DF] p-5 sm:p-6"><div className="flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4 text-[#865221]" /><h2 className="font-semibold">Adaptive suggestions</h2></div><div className="grid md:grid-cols-3 gap-3">{suggestions.length ? suggestions.map((s) => <div key={s} className="rounded-xl bg-[#F7F3EB] p-3 text-xs text-[#424841]">{s}</div>) : <div className="rounded-xl bg-[#C8E6C9]/40 p-3 text-xs text-[#1C331F]">Your workspace looks ready. Keep the rhythm gentle and take breaks.</div>}</div><div className="flex flex-wrap gap-2 mt-5"><button onClick={() => setDeskLamp({ enabled: true, brightness: Math.max(environment.deskLamp.brightness, 70) })} className="text-xs rounded-full border border-[#EAE7DF] px-3 py-2">Apply brighter lamp</button><button onClick={() => setScreenWarmth({ autoTrueTone: true })} className="text-xs rounded-full border border-[#EAE7DF] px-3 py-2">Use gentle screen warmth</button><button onClick={() => setCurrentView('desk')} className="text-xs rounded-full border border-[#EAE7DF] px-3 py-2">Return to desk</button></div><div className="flex items-center gap-2 text-[11px] text-[#8F8D86] mt-5"><ShieldCheck className="w-3.5 h-3.5 text-[#44664A]" /> No image, video, biometric template, or frame-derived data leaves your browser.</div></section>
  </div>;
};
const Signal = ({ icon, label, value, muted = false }: { icon: React.ReactNode; label: string; value: number; muted?: boolean }) => <div className="mb-4"><div className="flex justify-between text-xs mb-1.5"><span className="flex items-center gap-2">{icon}{label}</span><b>{muted ? '—' : `${value}/100`}</b></div><div className="h-2 rounded-full bg-[#EAE7DF] overflow-hidden"><div className="h-full rounded-full bg-[#769A7A] transition-all" style={{ width: `${muted ? 0 : value}%` }} /></div></div>;
