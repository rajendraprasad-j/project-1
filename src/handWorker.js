// src/handWorker.js
// Web Worker for running MediaPipe HandLandmarker (classic worker)


// Load MediaPipe Tasks Vision library
self.importScripts('/vision_bundle.classic.js');

let handLandmarker;

self.onmessage = async (e) => {
  if (e.data.type === 'init') {
      const vision = await self.mp.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
    handLandmarker = await self.mp.HandLandmarker.createFromOptions(vision,{
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });
    self.postMessage({ type: 'ready' });
  } else if (e.data.type === 'frame' && handLandmarker) {
    console.log('frame')
    const { imageBitmap } = e.data;
    const results = await handLandmarker.detectForVideo(imageBitmap, performance.now());
    self.postMessage({ type: 'results', results });
    imageBitmap.close();
  }
};

self.postMessage({ type: 'worker-loaded' });