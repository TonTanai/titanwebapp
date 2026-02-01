# 🎨 วิธีเพิ่ม 3D Model จริงๆ เข้าไปในโปรเจ็กต์

ตอนนี้โปรเจ็กต์ใช้โมเดลที่สร้างด้วย geometry พื้นฐาน แต่ถ้าคุณต้องการโมเดล 3D ที่สมจริง 100% สามารถทำตามขั้นตอนนี้:

---

## 📥 ขั้นตอนที่ 1: หาโมเดล 3D (ฟรี)

### แหล่งดาวน์โหลดโมเดลฟรี:

1. **Mixamo** (แนะนำที่สุด!)
   - เว็บ: https://www.mixamo.com/
   - มีโมเดลมนุษย์ฟรีหลายแบบ พร้อม animation
   - ลงทะเบียนด้วย Adobe ID (ฟรี)
   - ดาวน์โหลดเป็นไฟล์ `.fbx` หรือ `.glb`

2. **Sketchfab**
   - เว็บ: https://sketchfab.com/
   - ค้นหา "human anatomy" หรือ "human body"
   - เลือกโมเดลที่มีไอคอน "Download" และมี License แบบ CC

3. **Poly Pizza**
   - เว็บ: https://poly.pizza/
   - โมเดล Low-poly ฟรี

4. **Free3D**
   - เว็บ: https://free3d.com/
   - มีโมเดลฟรีหลายแบบ

---

## 🛠️ ขั้นตอนที่ 2: แปลงไฟล์เป็น GLB (ถ้าจำเป็น)

ถ้าไฟล์ที่ได้มาเป็น `.fbx`, `.obj`, `.dae` ให้แปลงเป็น `.glb`:

### วิธีแปลง:
1. ใช้เว็บ **glTF Viewer**: https://gltf-viewer.donmccurdy.com/
2. หรือใช้ **Blender** (ฟรี):
   - เปิด Blender → File → Import → เลือกไฟล์
   - File → Export → glTF 2.0 (.glb)

---

## 📂 ขั้นตอนที่ 3: วางไฟล์ในโปรเจ็กต์

1. สร้างโฟลเดอร์ `public/models/`
2. วางไฟล์ `.glb` ลงไป เช่น `human.glb`

```
TitanWebApp/
├── public/
│   └── models/
│       └── human.glb    👈 วางไฟล์ตรงนี้
├── src/
└── ...
```

---

## 💻 ขั้นตอนที่ 4: แก้โค้ดให้โหลดโมเดล

สร้างไฟล์ใหม่: `src/components/GLTFHumanModel.jsx`

```jsx
import { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GLTFHumanModel({ anatomyData, onHover, onClick, selectedPart }) {
  const { scene } = useGLTF('/models/human.glb')
  const modelRef = useRef()
  const [hoveredPart, setHoveredPart] = useState(null)

  // คลิกที่ส่วนต่างๆ ของโมเดล
  const handleClick = (e) => {
    e.stopPropagation()
    const objectName = e.object.name
    
    // แมป object name กับส่วนต่างๆ
    // ชื่อจะขึ้นอยู่กับโมเดลที่คุณใช้
    const partMapping = {
      'Head': 'head',
      'Chest': 'chest',
      'Spine': 'chest',
      'LeftArm': 'leftArm',
      'RightArm': 'rightArm',
      'LeftLeg': 'leftLeg',
      'RightLeg': 'rightLeg',
      // เพิ่มเติมตามชื่อใน object ของโมเดล
    }

    const partId = partMapping[objectName]
    if (partId) {
      onClick(partId)
    }
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    const objectName = e.object.name
    setHoveredPart(objectName)
    onHover(objectName)
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
    setHoveredPart(null)
    onHover(null)
  }

  // ปรับขนาดและตำแหน่งโมเดล
  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, -1, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}

export default GLTFHumanModel

// ต้อง preload โมเดล
useGLTF.preload('/models/human.glb')
```

---

## 🔄 ขั้นตอนที่ 5: เปลี่ยนใน AnatomyViewer.jsx

แก้ไข `src/components/AnatomyViewer.jsx`:

```jsx
import GLTFHumanModel from './GLTFHumanModel'  // เพิ่มบรรทัดนี้

// เปลี่ยนจาก RealisticHumanModel เป็น GLTFHumanModel
<GLTFHumanModel 
  anatomyData={anatomyData}
  onHover={onHover}
  onClick={onClick}
  selectedPart={selectedPart}
/>
```

---

## 🎯 ขั้นตอนที่ 6: ตรวจสอบชื่อ Object ในโมเดล

เพื่อให้คลิกได้ถูกต้อง ต้องรู้ชื่อส่วนต่างๆ ในโมเดล:

```jsx
// เพิ่ม useEffect ใน GLTFHumanModel
import { useEffect } from 'react'

useEffect(() => {
  if (scene) {
    // แสดงชื่อทุก object ใน console
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log('Object name:', child.name)
      }
    })
  }
}, [scene])
```

เปิด DevTools (F12) → Console จะเห็นชื่อทั้งหมด แล้วเอามาใส่ใน `partMapping`

---

## 🎨 โบนัส: เพิ่มเอฟเฟกต์ Highlight

เพิ่ม outline เมื่อ hover:

```jsx
import { useEffect } from 'react'

useEffect(() => {
  if (scene && hoveredPart) {
    scene.traverse((child) => {
      if (child.isMesh && child.name === hoveredPart) {
        child.material.emissive = new THREE.Color(0x4444ff)
        child.material.emissiveIntensity = 0.5
      } else if (child.isMesh) {
        child.material.emissive = new THREE.Color(0x000000)
        child.material.emissiveIntensity = 0
      }
    })
  }
}, [scene, hoveredPart])
```

---

## 📚 ตัวอย่างแหล่งโมเดล Anatomy ที่ดี

### Anatomy-specific models:
1. **Visible Body** - มีโมเดล anatomy ฟรีบางส่วน
2. **BioDigital Human** - มี API สำหรับโมเดล (เสียเงิน)
3. **Open Anatomy** - โมเดลฟรีเพื่อการศึกษา

---

## ⚠️ ข้อควรระวัง

1. **ขนาดไฟล์** - โมเดล 3D สวยๆ มักใหญ่ (5-50 MB)
   - ใช้ gltf-pipeline compress ได้: `npm install -g gltf-pipeline`
   
2. **License** - ตรวจสอบ license ก่อนใช้
   - CC0, CC-BY = ใช้ได้ฟรี
   - Personal Use Only = ห้ามใช้เชิงพาณิชย์

3. **Performance** - โมเดลละเอียดมากจะช้า
   - ใช้โมเดลที่มี polygon ไม่เกิน 50,000 triangles

---

## 🚀 เริ่มต้นง่ายๆ

1. ไป Mixamo → Download โมเดล "Y Bot" (ฟรี)
2. Export เป็น FBX
3. แปลงเป็น GLB ที่ https://gltf-viewer.donmccurdy.com/
4. วางใน `public/models/`
5. ใช้โค้ดด้านบน!

---

**มีปัญหาไหม? ถามได้เลย! 😊**
