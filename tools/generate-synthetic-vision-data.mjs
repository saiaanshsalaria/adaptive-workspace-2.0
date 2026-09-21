import { mkdir, writeFile } from 'node:fs/promises';

const labels = ['good_posture', 'slouching', 'leaning_left', 'leaning_right', 'too_close'];
const rows = [];
const random = (min, max) => min + Math.random() * (max - min);

for (const label of labels) {
  for (let sample = 0; sample < 200; sample += 1) {
    const row = {
      label,
      shoulderTilt: random(0.005, 0.035),
      headOffsetRatio: random(0.02, 0.12),
      shoulderHeight: random(0.22, 0.34),
      torsoLean: random(0.01, 0.08),
      movement: random(0.001, 0.02),
      visibility: random(0.82, 1)
    };
    if (label === 'slouching') row.shoulderHeight -= random(0.04, 0.10);
    if (label === 'leaning_left' || label === 'leaning_right') {
      row.shoulderTilt += random(0.08, 0.20);
      row.torsoLean += random(0.10, 0.28);
    }
    if (label === 'too_close') row.shoulderHeight = random(0.06, 0.14);
    rows.push(row);
  }
}

await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/synthetic-vision-dataset.jsonl', rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
console.log(`Generated ${rows.length} synthetic posture samples.`);
