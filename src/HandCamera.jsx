// src/HandCamera.js
import { useEffect, useRef } from 'react'
import { initHandWorker, sendFrameToWorker, onHandWorkerMessage } from './handWorkerClient'
import { useHandStore } from './handStore'

export default function HandCamera() {
  const videoRef = useRef()
  const setLandmarks = useHandStore(state => state.setLandmarks)

  useEffect(() => {
    let running = true
    initHandWorker()

    const handleMsg = (data) => {
      if (data.type === 'results') {
        console.log('Received landmarks:', data.results)
        setLandmarks(data.results)
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
            const bitmap = await createImageBitmap(videoRef.current)
            sendFrameToWorker(bitmap)
          }
          requestAnimationFrame(sendFrame)
        }
        sendFrame()
      }
    })

    return () => { running = false }
  }, [setLandmarks])

  return (
    <video ref={videoRef} style={{ display: 'none' }} playsInline muted></video>
  );
}