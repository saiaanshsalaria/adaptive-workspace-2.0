# Synthetic vision model demo

The expo build uses `synthetic-posture-v1` in the browser. It is a deterministic,
prototype-based classifier over normalized MediaPipe landmark features:

`shoulder tilt`, `head offset ratio`, `relative shoulder height`, and `torso lean`.

Run `node tools/generate-synthetic-vision-data.mjs` to generate 1,000 labeled
feature rows for demonstrations and future model training. These samples are
simulated; they are not a substitute for a representative human dataset.

The UI must identify predictions as synthetic demo estimates. The model is not
medical software and its confidence must not be presented as real-world
validation accuracy. The existing heuristic remains the fallback when
visibility is low or a prediction is uncertain.
