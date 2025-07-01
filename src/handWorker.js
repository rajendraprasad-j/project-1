// src/handWorker.js
// Web Worker for running MediaPipe HandLandmarker (Vite-compatible, ES module)

import { createTasksVision } from '@mediapipe/tasks-vision';

let handLandmarker;

self.postMessage({ type: 'worker-loaded' });

self.onmessage = async (e) => {
  if (e.data.type === 'init') {
    // Initialize MediaPipe HandLandmarker using local package
    const vision = await createTasksVision();
    handLandmarker = await vision.HandLandmarker.create();
    self.postMessage({ type: 'ready' });
  } else if (e.data.type === 'frame' && handLandmarker) {
    const { imageBitmap } = e.data;
    // Run inference
    const results = await handLandmarker.detect(imageBitmap);
    self.postMessage({ type: 'results', results });
    imageBitmap.close();
  }
};
