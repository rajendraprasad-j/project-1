// src/HandCamera.js
import { useEffect, useRef } from 'react'
import { initHandWorker, sendFrameToWorker, onHandWorkerMessage } from './handWorkerClient'
import { useHandStore } from './handStore'

export default function HandCamera() {
  const videoRef = useRef()
  const videoCanvasRef = useRef()

  const setLandmarks = useHandStore(state => state.setLandmarks)

  useEffect(() => {
    initHandWorker()
  }, [])

  useEffect(() => {
    let running = true

    const handleMsg = (data) => {
      if (data.type === 'results') {
        if(data.results.landmarks && data.results.landmarks.length > 0) {
          console.log('Received landmarks:', data.results)
          setLandmarks(data.results)
        }
        // Draw imageBitmap if present
        if (data.imageBitmap && videoCanvasRef.current) {
          const canvas = videoCanvasRef.current;
          if (canvas.width !== data.imageBitmap.width || canvas.height !== data.imageBitmap.height) {
            canvas.width = data.imageBitmap.width;
            canvas.height = data.imageBitmap.height;
          }
          const ctx = canvas.getContext('2d');
          try {
            if(data.imageBitmap.width !== 0 || data.imageBitmap.height !== 0) {
              ctx.drawImage(data.imageBitmap, 0, 0);
            }
          } catch (e) {
            console.error('Error drawing imageBitmap:', e);
          }
          data.imageBitmap.close();
        }
      }
    }

    onHandWorkerMessage(handleMsg)

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
        const sendFrame = async () => {
          if (!running) return
          if (videoRef.current.readyState === 4) {
            const canvas = document.getElementById('hand-canvas');
            // Crop to square
            const minDim = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight);
            const sx = (videoRef.current.videoWidth - minDim) / 2;
            const sy = (videoRef.current.videoHeight - minDim) / 2;
            canvas.width = minDim;
            canvas.height = minDim;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              videoRef.current,
              sx, sy, minDim, minDim, // source crop
              0, 0, minDim, minDim     // destination
            );
            const bitmap = await createImageBitmap(canvas);
            sendFrameToWorker(bitmap);
          }
          requestAnimationFrame(sendFrame)
        }
        sendFrame()
      }
    })

    return () => { running = false }
  }, [setLandmarks])

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted></video>
      <canvas style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
      }} ref={videoCanvasRef} id="hand-canvas"></canvas>
    </>
  );
}