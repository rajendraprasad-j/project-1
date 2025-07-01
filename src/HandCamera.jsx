// src/HandCamera.js
// React component to capture webcam frames and send to worker
import { useEffect, useRef } from 'react'
import { initHandWorker, sendFrameToWorker, onHandWorkerMessage } from './handWorkerClient'

export default function HandCamera({ onResults }) {
  const videoRef = useRef()
  useEffect(() => {
    let running = true
    initHandWorker()
    const handleMsg = (data) => {
      if (data.type === 'results' && onResults) onResults(data.results)
    }
    onHandWorkerMessage(handleMsg)
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
        const sendFrame = async () => {
          if (!running) return
          if (videoRef.current.readyState === 4) {
            const bitmap = await createImageBitmap(videoRef.current)
            sendFrameToWorker(bitmap)
          }
          requestAnimationFrame(sendFrame)
        }
        sendFrame()
      }
    })
    return () => { running = false }
  }, [onResults])
  return (
    <video ref={videoRef} style={{ display: 'none' }} playsInline muted></video>
  );
}
