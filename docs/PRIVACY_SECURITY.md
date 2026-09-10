# Adaptive Vision privacy and security

Adaptive Vision is browser-only by design. `getUserMedia` is requested only after
the user presses **Start camera**, with audio disabled. Frames are rendered to a
local video element and a tiny in-memory canvas for a brightness heuristic; no
frame, image, biometric template, or recording is sent to the backend or saved.
Stopping the camera stops every media track.

Posture and fatigue are local heuristic estimates, not medical, biometric, or
diagnostic measurements. Permission denial or unsupported browsers leave lighting
and workspace controls available. Any future summarized-signal API must be
opt-in, minimized, user-scoped, and must prohibit image/frame uploads.
## Adaptive Vision processing

Adaptive Vision requests webcam access only after the user starts the camera.
Frames are analyzed in the browser with MediaPipe Pose Landmarker and are never
sent to the backend, uploaded, recorded, or persisted. The pose model is loaded
from Google's official MediaPipe model hosting (with the package runtime's
browser assets); only transient landmarks are used to draw the local overlay
and calculate heuristic signals.

Posture alignment uses shoulder tilt, head/shoulder alignment, and torso
geometry. The fatigue signal uses observable, non-medical proxies (head
movement, prolonged stillness, and session elapsed time). These estimates are
not diagnoses or measurements of health, attention, or ergonomics. If camera
permission is denied, the browser lacks camera support, or model loading fails,
the UI degrades gracefully and lighting analysis remains available.
