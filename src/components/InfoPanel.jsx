import './InfoPanel.css'

function InfoPanel({ data, onEdit, onClose }) {
  return (
    <div className="info-panel">
      <div className="panel-header">
        <h2>{data.name}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="panel-content">
        <div className="color-indicator" style={{ backgroundColor: data.color }}></div>
        <p className="description">{data.description}</p>
      </div>

      <button className="edit-btn" onClick={onEdit}>
        ✏️ แก้ไขคำอธิบาย
      </button>
    </div>
  )
}

export default InfoPanel
