# AQA A-level Measurements & Errors Learning Lab v7

Interactive AQA A-level Physics 7408 Measurements & Errors platform.

## v7 platform

v7 keeps the existing guided lessons, textbook, simulations, formula coach, practical benches, mastery system, timed assessment, dashboard and 3D lab, then adds a complete practical-learning platform.

### Advanced Virtual Laboratory
- draggable apparatus lab bench and experiment-design missions
- local glTF apparatus library for micrometer, vernier and analogue meter
- camera/AR-style alignment mode with browser camera permission
- CSV/real-data import with regression and anomaly flagging
- Web Serial sensor hook for compatible microcontrollers/sensors
- blind-practical relationship discovery
- graph linearisation trainer
- live uncertainty optimiser
- comparison of experimental methods

### Personal Learning Hub
- local student profile
- spaced retrieval scheduling
- confidence tracking
- skills passport and mastery map
- digital practical notebook
- practical portfolio export
- adaptive difficulty/challenge mode
- accessibility controls: larger text, high contrast, dyslexia-friendly spacing, reduced motion
- EAL physics glossary support
- cross-topic links to Electricity, Mechanics, Materials, Waves, Nuclear and Fields
- browser voice-viva mode where speech recognition is supported

### Assessment Laboratory
- exam-paper builder
- extended Paper 3-style practice
- examiner commentary
- targeted question generation from weakest tracked skills
- measurement escape room
- interactive practical decision scenarios

### Teacher and classroom tools
- custom teacher questions/activities stored locally
- local classroom skill heatmap
- BroadcastChannel classroom challenge support between open browser tabs
- adaptive class-focus suggestions

### Offline support
- service-worker caching for the static learning app

## Important browser notes
Camera, speech recognition, Web Serial, service workers and WebGL depend on browser/device support and user permission. The app provides fallbacks rather than bypassing those permissions.


## v8
- Expanded all 8 guided lessons into deeper mini-textbook lessons with worked examples, guided practice, misconceptions, exam technique and practical context.
- Converted the six core Measurements & Errors simulations to interactive Three.js 3D scenes with orbit, zoom, auto-rotation and 3D snapshots.
- Corrected graph-gradient uncertainty to AQA best-line versus worst-acceptable-line guidance.
- Added v8 resources to the offline service-worker cache.
