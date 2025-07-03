import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import './App.css'
import HandCamera from './HandCamera'
import { useHandStore } from './handStore'

function Scene() {
  const showAO = useHandStore(state => state.showAO)
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
  const { showAO, toggleAO } = useHandStore()
  return (
    <div className="fullscreen-canvas">
      <button style={{position:'absolute',zIndex:1,top:20,left:20}} onClick={toggleAO}>
        {showAO ? 'Disable AO' : 'Enable AO'}
      </button>
      <HandCamera />
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}

export default App