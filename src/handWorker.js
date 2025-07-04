// src/handWorker.js
// Web Worker for running MediaPipe HandLandmarker (classic worker)

// Load MediaPipe Tasks Vision library
self.importScripts('/vision_bundle.classic.js');

const { HandLandmarker, FilesetResolver } = self.mp;
let handLandmarker = null;

self.onmessage = async (e) => {
  try {
    if (e.data.type === 'init') {
      console.log('Worker: Initializing...');
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });
      console.log('Worker: Initialization complete.');
      self.postMessage({ type: 'ready' });
    } else if (e.data.type === 'frame' && handLandmarker) {
      const { imageBitmap } = e.data;
      const results = handLandmarker.detectForVideo(imageBitmap, performance.now());
      // Log landmarks immediately
      if (results.landmarks && results.landmarks.length > 0) {
        console.log('Worker: Detected landmarks:', results.landmarks);
      }
      // Send results and imageBitmap immediately for every frame
      self.postMessage({ type: 'results', results, imageBitmap }, [imageBitmap]);
    }
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ type: 'error', error: error.message });
  }
};

self.postMessage({ type: 'worker-loaded' });