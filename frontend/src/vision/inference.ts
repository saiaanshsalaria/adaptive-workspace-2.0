import type { VisionFeatures } from './features';

export type PostureLabel = 'good_posture' | 'slouching' | 'leaning_left' | 'leaning_right' | 'too_close' | 'not_visible';

export interface ModelPrediction {
  label: PostureLabel;
  confidence: number;
  score: number;
  modelVersion: string;
  synthetic: true;
}

type Prototype = Omit<ModelPrediction, 'confidence' | 'synthetic'> & { vector: number[] };

const MODEL_VERSION = 'synthetic-posture-v1';
const labels: Prototype[] = [
  { label: 'good_posture', score: 94, modelVersion: MODEL_VERSION, vector: [0.02, 0.05, 0.28, 0.02] },
  { label: 'slouching', score: 48, modelVersion: MODEL_VERSION, vector: [0.06, 0.12, 0.18, 0.04] },
  { label: 'leaning_left', score: 58, modelVersion: MODEL_VERSION, vector: [0.16, 0.85, 0.25, 0.20] },
  { label: 'leaning_right', score: 58, modelVersion: MODEL_VERSION, vector: [0.16, 0.85, 0.25, 0.20] },
  { label: 'too_close', score: 42, modelVersion: MODEL_VERSION, vector: [0.04, 0.08, 0.08, 0.05] }
];

function vectorFor(features: VisionFeatures, baseline: number | null): number[] {
  const height = baseline ? features.shoulderHeight / baseline : features.shoulderHeight;
  return [features.shoulderTilt, features.headOffsetRatio, height, features.torsoLean];
}

export function predictPosture(features: VisionFeatures, baseline: number | null): ModelPrediction {
  if (features.visibility < 0.45) {
    return { label: 'not_visible', confidence: Math.round(features.visibility * 100), score: 0, modelVersion: MODEL_VERSION, synthetic: true };
  }
  const vector = vectorFor(features, baseline);
  const ranked = labels
    .map((prototype) => ({
      prototype,
      distance: Math.sqrt(prototype.vector.reduce((sum, value, index) => sum + (value - vector[index]) ** 2, 0))
    }))
    .sort((a, b) => a.distance - b.distance);
  const best = ranked[0];
  const runnerUp = ranked[1];
  const separation = Math.max(0, runnerUp.distance - best.distance);
  const confidence = Math.max(35, Math.min(98, Math.round(45 + separation * 180 + features.visibility * 20)));
  return { ...best.prototype, confidence, synthetic: true };
}
