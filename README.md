# 🧬 Human Anatomy Viewer

Web application สำหรับแสดงและเรียนรู้ anatomy ของมนุษย์แบบ interactive

## ✨ คุณสมบัติ

- 🎨 **3D Model แบบ Interactive** - หมุน ซูม และเคลื่อนย้ายได้
- 👆 **Hover เพื่อดูข้อมูล** - เลื่อนเมาส์ไปที่ส่วนต่างๆ เพื่อดูคำอธิบาย
- ✏️ **แก้ไขคำอธิบายได้** - คลิกที่ส่วนใดๆ แล้วกดปุ่ม "แก้ไข" เพื่อเปลี่ยนคำอธิบาย
- 🎨 **ปรับแต่งสีได้** - เปลี่ยนสีของแต่ละส่วนตามความชอบ
- 📱 **Responsive Design** - ใช้งานได้ทั้งบนคอมพิวเตอร์และมือถือ

## 🚀 วิธีเริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. รันโปรเจ็กต์

```bash
npm run dev
```

### 3. เปิดบราวเซอร์

ไปที่ `http://localhost:5173` (หรือพอร์ตที่แสดงใน terminal)

## 📁 โครงสร้างโปรเจ็กต์

```
TitanWebApp/
├── src/
│   ├── components/          # Components ทั้งหมด
│   │   ├── AnatomyViewer.jsx    # Component หลักสำหรับแสดง 3D
│   │   ├── HumanModel.jsx       # โมเดล 3D ของมนุษย์
│   │   ├── InfoPanel.jsx        # Panel แสดงข้อมูล
│   │   ├── EditPanel.jsx        # Panel แก้ไขข้อมูล
│   │   └── *.css               # Styles
│   ├── data/
│   │   └── anatomyData.json    # ข้อมูลคำอธิบาย (แก้ไขได้ง่าย!)
│   ├── App.jsx             # Main App Component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 วิธีแก้ไขข้อมูล

### วิธีที่ 1: ผ่าน UI (แนะนำ)
1. คลิกที่ส่วนใดๆ ของโมเดล
2. กดปุ่ม "✏️ แก้ไขคำอธิบาย"
3. แก้ไขชื่อ, คำอธิบาย, หรือสี
4. กด "💾 บันทึก"

### วิธีที่ 2: แก้ไข JSON โดยตรง
แก้ไขไฟล์ `src/data/anatomyData.json`:

```json
{
  "head": {
    "name": "ศีรษะ (Head)",
    "description": "คำอธิบายของคุณ...",
    "color": "#ff6b6b"
  }
}
```

## 🛠️ เทคโนโลยีที่ใช้

- **React** - UI Framework (เข้าใจง่าย แก้ไขง่าย)
- **Vite** - Build Tool (รวดเร็ว)
- **React Three Fiber** - 3D Rendering
- **Three.js** - 3D Graphics Library

## 💡 การ Customize เพิ่มเติม

### เพิ่มส่วนใหม่ของร่างกาย

1. เพิ่มข้อมูลใน `anatomyData.json`:
```json
"newPart": {
  "name": "ส่วนใหม่",
  "description": "คำอธิบาย",
  "color": "#hexcolor"
}
```

2. เพิ่ม body part ใน `HumanModel.jsx`:
```javascript
{ id: 'newPart', position: [x, y, z], size: [w, h, d] }
```

### เปลี่ยนสี Background

แก้ไขใน `AnatomyViewer.jsx`:
```javascript
style={{ background: 'linear-gradient(...)' }}
```

### ปรับขนาดโมเดล

แก้ไขใน `HumanModel.jsx` ใน array `bodyParts` เปลี่ยนค่า `size`

## 📝 Tips

- กด **คลิกซ้าย + ลาก** เพื่อหมุนมุมมอง
- กด **คลิกขวา + ลาก** เพื่อเลื่อนตำแหน่ง  
- กด **Scroll** เพื่อซูมเข้า/ออก
- กด **คลิก** ที่ส่วนใดๆ เพื่อเลือกและแก้ไข

## 🎓 เหมาะสำหรับ

- โครงงานนักเรียน/นักศึกษา
- เครื่องมือสอน Anatomy
- Portfolio Project
- Learning React และ 3D Web Development

## 📄 License

ใช้งานได้อย่างอิสระ - แก้ไขและพัฒนาต่อได้ตามต้องการ!
