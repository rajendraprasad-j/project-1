import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { useState } from 'react'
import './App.css'

function Scene({ showAO }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      {showAO && (
        <EffectComposer>
          <N8AO intensity={2} aoRadius={2} />
        </EffectComposer>
      )}
      <OrbitControls />
    </>
  )
}

function App() {
  const [showAO, setShowAO] = useState(true)
  return (
    <div className="fullscreen-canvas">
      <button style={{position:'absolute',zIndex:1,top:20,left:20}} onClick={() => setShowAO(v => !v)}>
        {showAO ? 'Disable AO' : 'Enable AO'}
      </button>
      <Canvas>
        <Scene showAO={showAO} />
      </Canvas>
    </div>
  )
}

export default App
