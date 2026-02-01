import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Realistic Human Model Component
// ส่วนนี้จะถูก highlight เมื่อ hover หรือ click
function BodyPart({ 
  partId, 
  position, 
  scale = 1,
  color, 
  onHover, 
  onClick, 
  isSelected,
  children 
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = (hovered || isSelected) ? 1.05 : 1
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
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
      {children}
      {(hovered || isSelected) && (
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}

// สร้าง Realistic Human Model ด้วย detailed geometry
function RealisticHumanModel({ anatomyData, onHover, onClick, selectedPart }) {
  
  // ฟังก์ชันสร้างส่วนของร่างกายที่สมจริงขึ้น
  const createHead = (color) => (
    <group>
      {/* หัว */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* ใบหน้า - ยื่นออกมาเล็กน้อย */}
      <mesh position={[0, -0.05, 0.3]}>
        <boxGeometry args={[0.25, 0.3, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )

  const createNeck = (color) => (
    <mesh>
      <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )

  const createTorso = (color) => (
    <group>
      {/* หน้าอก */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.25, 0.5, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* ช่วงเอว */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.3, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )

  const createAbdomen = (color) => (
    <mesh>
      <capsuleGeometry args={[0.23, 0.4, 16, 32]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )

  const createArm = (color, isLeft) => {
    const side = isLeft ? -1 : 1
    return (
      <group>
        {/* ไหล่ */}
        <mesh position={[side * 0.45, 0.75, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* ต้นแขน */}
        <mesh position={[side * 0.58, 0.4, 0]} rotation={[0, 0, side * 0.1]}>
          <capsuleGeometry args={[0.1, 0.4, 12, 24]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* ข้อศอก */}
        <mesh position={[side * 0.65, 0.05, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* ปลายแขน */}
        <mesh position={[side * 0.68, -0.3, 0]} rotation={[0, 0, side * -0.05]}>
          <capsuleGeometry args={[0.09, 0.35, 12, 24]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* มือ */}
        <mesh position={[side * 0.68, -0.62, 0]}>
          <boxGeometry args={[0.12, 0.18, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>
    )
  }

  const createLeg = (color, isLeft) => {
    const side = isLeft ? -1 : 1
    return (
      <group>
        {/* สะโพก */}
        <mesh position={[side * 0.15, -0.5, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* ต้นขา */}
        <mesh position={[side * 0.15, -0.95, 0]}>
          <capsuleGeometry args={[0.13, 0.5, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* เข่า */}
        <mesh position={[side * 0.15, -1.3, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* น่อง */}
        <mesh position={[side * 0.15, -1.7, 0]}>
          <capsuleGeometry args={[0.1, 0.45, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* เท้า */}
        <mesh position={[side * 0.15, -2.0, 0.08]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.24]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* ศีรษะและคอ */}
      <BodyPart
        partId="head"
        position={[0, 1.5, 0]}
        color={anatomyData.head?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'head'}
      >
        {createHead(anatomyData.head?.color || '#ff6b6b')}
        <group position={[0, -0.5, 0]}>
          {createNeck(anatomyData.head?.color || '#ff6b6b')}
        </group>
      </BodyPart>

      {/* หน้าอก */}
      <BodyPart
        partId="chest"
        position={[0, 0.6, 0]}
        color={anatomyData.chest?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'chest'}
      >
        {createTorso(anatomyData.chest?.color || '#4ecdc4')}
      </BodyPart>

      {/* ช่องท้อง */}
      <BodyPart
        partId="abdomen"
        position={[0, -0.1, 0]}
        color={anatomyData.abdomen?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'abdomen'}
      >
        {createAbdomen(anatomyData.abdomen?.color || '#ffe66d')}
      </BodyPart>

      {/* แขนซ้าย */}
      <BodyPart
        partId="leftArm"
        position={[0, 0, 0]}
        color={anatomyData.leftArm?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'leftArm'}
      >
        {createArm(anatomyData.leftArm?.color || '#a8dadc', true)}
      </BodyPart>

      {/* แขนขวา */}
      <BodyPart
        partId="rightArm"
        position={[0, 0, 0]}
        color={anatomyData.rightArm?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'rightArm'}
      >
        {createArm(anatomyData.rightArm?.color || '#a8dadc', false)}
      </BodyPart>

      {/* ขาซ้าย */}
      <BodyPart
        partId="leftLeg"
        position={[0, 0, 0]}
        color={anatomyData.leftLeg?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'leftLeg'}
      >
        {createLeg(anatomyData.leftLeg?.color || '#95e1d3', true)}
      </BodyPart>

      {/* ขาขวา */}
      <BodyPart
        partId="rightLeg"
        position={[0, 0, 0]}
        color={anatomyData.rightLeg?.color}
        onHover={onHover}
        onClick={onClick}
        isSelected={selectedPart === 'rightLeg'}
      >
        {createLeg(anatomyData.rightLeg?.color || '#95e1d3', false)}
      </BodyPart>
    </group>
  )
}

export default RealisticHumanModel
