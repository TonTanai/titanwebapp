import { useState } from 'react'
import './EditPanel.css'

function EditPanel({ partId, data, onSave, onCancel }) {
  const [name, setName] = useState(data.name)
  const [description, setDescription] = useState(data.description)
  const [color, setColor] = useState(data.color)

  const handleSave = () => {
    onSave(partId, { name, description, color })
  }

  return (
    <div className="edit-panel">
      <div className="panel-header">
        <h2>✏️ แก้ไขข้อมูล</h2>
      </div>

      <div className="form-group">
        <label>ชื่อส่วน</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น ศีรษะ (Head)"
        />
      </div>

      <div className="form-group">
        <label>คำอธิบาย</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="อธิบายเกี่ยวกับส่วนนี้ของร่างกาย..."
        />
      </div>

      <div className="form-group">
        <label>สี</label>
        <div className="color-picker">
          <input 
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span className="color-code">{color}</span>
        </div>
      </div>

      <div className="button-group">
        <button className="save-btn" onClick={handleSave}>
          💾 บันทึก
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          ยกเลิก
        </button>
      </div>
    </div>
  )
}

export default EditPanel
