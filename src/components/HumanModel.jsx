import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function BodyPart({ partId, position, size, color, onHover, onClick, isSelected, shape = 'box', rotation = [0, 0, 0] }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      // เอฟเฟกต์เมื่อ hover หรือ select
      const targetScale = (hovered || isSelected) ? 1.1 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  // เลือก geometry ตามรูปร่าง
  const getGeometry = () => {
    switch(shape) {
      case 'sphere':
        return <sphereGeometry args={[size[0], 32, 32]} />
      case 'cylinder':
        return <cylinderGeometry args={[size[0], size[1], size[2], 16]} />
      case 'capsule':
        return <capsuleGeometry args={[size[0], size[1], 16, 16]} />
      default:
        return <boxGeometry args={size} />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(partId)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(partId)
      }}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  )
}

function HumanModel({ anatomyData, onHover, onClick, selectedPart }) {
  // กำหนดตำแหน่งและขนาดของแต่ละส่วน แบบเหมือนคนจริง
  const bodyParts = [
    // ศีรษะ - ใช้ sphere
    { id: 'head', position: [0, 1.5, 0], size: [0.35, 0.35, 0.35], shape: 'sphere' },
    
    // คอ - เชื่อมศีรษะกับลำตัว
    { id: 'neck', position: [0, 1.15, 0], size: [0.15, 0.2, 0.15], shape: 'cylinder' },
    
    // หน้าอก - ใช้ capsule
    { id: 'chest', position: [0, 0.6, 0], size: [0.28, 0.6, 32], shape: 'capsule' },
    
    // ช่องท้อง
    { id: 'abdomen', position: [0, -0.1, 0], size: [0.24, 0.45, 32], shape: 'capsule' },
    
    // ไหล่ซ้าย
    { id: 'leftShoulder', position: [-0.45, 0.75, 0], size: [0.15, 0.15, 0.15], shape: 'sphere' },
    
    // ไหล่ขวา
    { id: 'rightShoulder', position: [0.45, 0.75, 0], size: [0.15, 0.15, 0.15], shape: 'sphere' },
    
    // ต้นแขนซ้าย
    { id: 'leftUpperArm', position: [-0.6, 0.4, 0], size: [0.12, 0.45, 32], shape: 'capsule' },
    
    // ต้นแขนขวา
    { id: 'rightUpperArm', position: [0.6, 0.4, 0], size: [0.12, 0.45, 32], shape: 'capsule' },
    
    // ข้อศอกซ้าย
    { id: 'leftElbow', position: [-0.6, 0.0, 0], size: [0.11, 0.11, 0.11], shape: 'sphere' },
    
    // ข้อศอกขวา
    { id: 'rightElbow', position: [0.6, 0.0, 0], size: [0.11, 0.11, 0.11], shape: 'sphere' },
    
    // ปลายแขนซ้าย
    { id: 'leftForearm', position: [-0.6, -0.35, 0], size: [0.1, 0.4, 32], shape: 'capsule' },
    
    // ปลายแขนขวา
    { id: 'rightForearm', position: [0.6, -0.35, 0], size: [0.1, 0.4, 32], shape: 'capsule' },
    
    // มือซ้าย
    { id: 'leftHand', position: [-0.6, -0.65, 0], size: [0.12, 0.18, 0.08] },
    
    // มือขวา
    { id: 'rightHand', position: [0.6, -0.65, 0], size: [0.12, 0.18, 0.08] },
    
    // สะโพกซ้าย
    { id: 'leftHip', position: [-0.15, -0.5, 0], size: [0.14, 0.14, 0.14], shape: 'sphere' },
    
    // สะโพกขวา
    { id: 'rightHip', position: [0.15, -0.5, 0], size: [0.14, 0.14, 0.14], shape: 'sphere' },
    
    // ต้นขาซ้าย
    { id: 'leftUpperLeg', position: [-0.15, -0.95, 0], size: [0.14, 0.5, 32], shape: 'capsule' },
    
    // ต้นขาขวา
    { id: 'rightUpperLeg', position: [0.15, -0.95, 0], size: [0.14, 0.5, 32], shape: 'capsule' },
    
    // เข่าซ้าย
    { id: 'leftKnee', position: [-0.15, -1.3, 0], size: [0.13, 0.13, 0.13], shape: 'sphere' },
    
    // เข่าขวา
    { id: 'rightKnee', position: [0.15, -1.3, 0], size: [0.13, 0.13, 0.13], shape: 'sphere' },
    
    // น่องซ้าย
    { id: 'leftLowerLeg', position: [-0.15, -1.7, 0], size: [0.11, 0.45, 32], shape: 'capsule' },
    
    // น่องขวา
    { id: 'rightLowerLeg', position: [0.15, -1.7, 0], size: [0.11, 0.45, 32], shape: 'capsule' },
    
    // เท้าซ้าย
    { id: 'leftFoot', position: [-0.15, -2.0, 0.08], size: [0.12, 0.1, 0.22] },
    
    // เท้าขวา
    { id: 'rightFoot', position: [0.15, -2.0, 0.08], size: [0.12, 0.1, 0.22] },
  ]

  // จัดกลุ่มส่วนต่างๆ เพื่อแมปกับข้อมูล
  const partMapping = {
    'head': ['head', 'neck'],
    'chest': ['chest', 'leftShoulder', 'rightShoulder'],
    'abdomen': ['abdomen', 'leftHip', 'rightHip'],
    'leftArm': ['leftUpperArm', 'leftElbow', 'leftForearm', 'leftHand'],
    'rightArm': ['rightUpperArm', 'rightElbow', 'rightForearm', 'rightHand'],
    'leftLeg': ['leftUpperLeg', 'leftKnee', 'leftLowerLeg', 'leftFoot'],
    'rightLeg': ['rightUpperLeg', 'rightKnee', 'rightLowerLeg', 'rightFoot'],
  }

  // หาว่าส่วนนี้อยู่ในกลุ่มไหน
  const getMainPartId = (partId) => {
    for (const [mainId, subParts] of Object.entries(partMapping)) {
      if (subParts.includes(partId)) {
        return mainId
      }
    }
    return partId
  }

  return (
    <group>
      {bodyParts.map((part) => {
        const mainPartId = getMainPartId(part.id)
        const partData = anatomyData[mainPartId]
        
        return (
          <BodyPart
            key={part.id}
            partId={mainPartId}
            position={part.position}
            size={part.size}
            shape={part.shape}
            rotation={part.rotation}
            color={partData?.color || '#cccccc'}
            onHover={onHover}
            onClick={onClick}
            isSelected={selectedPart === mainPartId}
          />
        )
      })}
    </group>
  )
}

export default HumanModel
