import { useState } from 'react'
import AnatomyViewer from './components/AnatomyViewer'
import InfoPanel from './components/InfoPanel'
import EditPanel from './components/EditPanel'
import anatomyDataInitial from './data/anatomyData.json'
import './App.css'

function App() {
  const [anatomyData, setAnatomyData] = useState(anatomyDataInitial)
  const [hoveredPart, setHoveredPart] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handlePartClick = (partId) => {
    setSelectedPart(partId)
    setIsEditing(false)
  }

  const handleSaveEdit = (partId, newData) => {
    setAnatomyData(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        ...newData
      }
    }))
    setIsEditing(false)
  }

  const currentPart = selectedPart || hoveredPart
  const currentData = currentPart ? anatomyData[currentPart] : null

  return (
    <div className="app">
      <div className="viewer-container">
        <AnatomyViewer 
          anatomyData={anatomyData}
          onHover={setHoveredPart}
          onClick={handlePartClick}
          selectedPart={selectedPart}
        />
      </div>

      <div className="right-sidebar">
        <header className="header">
          <h1>🧬 Human Anatomy Viewer</h1>
          <p>ชี้ที่ส่วนต่างๆ เพื่อดูคำอธิบาย หรือคลิกเพื่อแก้ไข</p>
        </header>

        <div className="side-panel">
          {currentData && !isEditing && (
            <InfoPanel 
              data={currentData}
              onEdit={() => setIsEditing(true)}
              onClose={() => {
                setSelectedPart(null)
                setHoveredPart(null)
              }}
            />
          )}

          {currentData && isEditing && selectedPart && (
            <EditPanel 
              partId={selectedPart}
              data={currentData}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {!currentData && (
            <div className="placeholder">
              <p>👆 ชี้หรือคลิกที่ส่วนต่างๆ ของร่างกาย</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
