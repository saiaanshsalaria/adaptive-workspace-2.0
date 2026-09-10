/**
 * Web Audio API synthesized gentle ambient rain and brown noise generator.
 * Zero external network dependencies, smooth volume ramp and safe browser unlocking.
 */

let audioCtx: AudioContext | null = null;
let brownNoiseNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let isAudioActive = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function startAmbientSound(volumeFraction: number = 0.4): void {
  try {
    const ctx = getAudioContext();
    if (isAudioActive && gainNode) {
      // Smoothly adjust volume
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(Math.max(0.01, Math.min(volumeFraction * 0.15, 0.15)), ctx.currentTime + 0.5);
      return;
    }

    // Create a 2-second pink/brown noise buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise filter (integrator with decay)
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.5; // Gain compensation
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter to sound like soft rain outside a Kyoto window
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);

    // Gain node for smooth fade-in
    gainNode = ctx.createGain();
    const targetGain = Math.max(0.01, Math.min(volumeFraction * 0.15, 0.15));
    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(targetGain, ctx.currentTime + 1.2);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(0);
    brownNoiseNode = whiteNoise;
    isAudioActive = true;
  } catch (err) {
    console.warn('AudioContext initialization note:', err);
  }
}

export function updateAmbientVolume(volumeFraction: number): void {
  if (gainNode && audioCtx && isAudioActive) {
    try {
      const targetGain = Math.max(0.001, Math.min(volumeFraction * 0.15, 0.15));
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }
}

export function stopAmbientSound(): void {
  if (audioCtx && gainNode && isAudioActive) {
    try {
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (brownNoiseNode) {
          try {
            (brownNoiseNode as AudioBufferSourceNode).stop();
            brownNoiseNode.disconnect();
          } catch {
            // ignore
          }
          brownNoiseNode = null;
        }
        isAudioActive = false;
      }, 550);
    } catch {
      isAudioActive = false;
    }
  }
}

export function isAmbientAudioRunning(): boolean {
  return isAudioActive;
}
