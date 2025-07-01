// src/handWorkerClient.js
// Utility to manage the hand tracking worker and send frames

let worker;
let ready = false;
const listeners = [];

export function initHandWorker() {
  if (!worker) {
    worker = new Worker(new URL('./handWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      if (e.data.type === 'worker-loaded') {
        console.log('Worker loaded successfully!');
      }
      if (e.data.type === 'ready') {
        ready = true;
      }
      listeners.forEach((cb) => cb(e.data));
    };
    worker.postMessage({ type: 'init' });
  }
}

export function onHandWorkerMessage(cb) {
  listeners.push(cb);
}

export function sendFrameToWorker(imageBitmap) {
  if (worker && ready) {
    worker.postMessage({ type: 'frame', imageBitmap }, [imageBitmap]);
  }
}
