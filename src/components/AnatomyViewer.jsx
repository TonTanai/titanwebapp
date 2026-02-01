import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import GLTFHumanModel from './GLTFHumanModel'

function AnatomyViewer({ anatomyData, onHover, onClick, selectedPart }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={0.3} />
      <Environment preset="sunset" />
      
      <GLTFHumanModel 
        anatomyData={anatomyData}
        onHover={onHover}
        onClick={onClick}
        selectedPart={selectedPart}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={0.1}
        maxDistance={50}
      />
    </Canvas>
  )
}

export default AnatomyViewer
