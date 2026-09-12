import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface VisionFeatures {
  shoulderTilt: number;
  headOffsetRatio: number;
  shoulderHeight: number;
  torsoLean: number;
  movement: number;
  visibility: number;
}

const distance = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);

export function extractVisionFeatures(
  landmarks: NormalizedLandmark[],
  previousNose?: NormalizedLandmark
): VisionFeatures | null {
  const nose = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  if (!nose || !leftShoulder || !rightShoulder) return null;

  const shoulderSpan = Math.max(0.08, distance(leftShoulder, rightShoulder));
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const visibilityPoints = [nose, leftShoulder, rightShoulder, leftHip, rightHip].filter(Boolean);
  const visibility = visibilityPoints.reduce((sum, point) => sum + (point.visibility ?? 1), 0) / visibilityPoints.length;
  const torsoLean = leftHip && rightHip
    ? Math.abs(((leftHip.x + rightHip.x) / 2) - shoulderMidX) / Math.max(0.08, distance(leftHip, rightHip))
    : 0;

  return {
    shoulderTilt: Math.abs(leftShoulder.y - rightShoulder.y),
    headOffsetRatio: Math.abs(nose.x - shoulderMidX) / shoulderSpan,
    shoulderHeight: Math.max(0.08, Math.abs(shoulderMidY - nose.y)),
    torsoLean,
    movement: previousNose ? distance(nose, previousNose) : 0,
    visibility
  };
}

export function lightingScore(rgbAverage: number): number {
  return Math.max(0, Math.min(100, Math.round((rgbAverage / 255) * 130)));
}
