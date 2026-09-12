import type { VisionFeatures } from './features';

export interface VisionEstimate {
  score: number;
  confidence: number;
  reason: string;
  modelVersion: string;
}

const score = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function estimatePosture(features: VisionFeatures, baseline: number | null): VisionEstimate {
  const alignmentPenalty = Math.min(45, features.shoulderTilt * 260 + features.headOffsetRatio * 30);
  const slouchPenalty = baseline === null
    ? 0
    : Math.min(35, Math.max(0, baseline - features.shoulderHeight) * 180);
  const posture = score(100 - alignmentPenalty - slouchPenalty - Math.min(15, features.torsoLean * 12));
  const confidence = score(features.visibility * 100);
  return {
    score: posture,
    confidence,
    reason: posture < 70 ? 'Shoulder, head, or torso alignment changed from baseline.' : 'Alignment is within the calibrated range.',
    modelVersion: 'heuristic-v1'
  };
}

export function estimateFatigue(elapsedMinutes: number, features: VisionFeatures): VisionEstimate {
  const stillness = features.movement < 0.008 ? 18 : 0;
  const fatigue = score(Math.min(100, elapsedMinutes * 1.2 + stillness));
  return {
    score: fatigue,
    confidence: score(features.visibility * 100),
    reason: fatigue > 65 ? 'Session duration and low movement suggest a break may help.' : 'No strong fatigue indicator detected.',
    modelVersion: 'proxy-v1'
  };
}
