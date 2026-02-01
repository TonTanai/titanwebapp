import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GLTFHumanModel({ anatomyData, onHover, onClick, selectedPart }) {
  const { scene } = useGLTF('/models/human1.glb')
  const modelRef = useRef()
  const [hoveredPart, setHoveredPart] = useState(null)

  // แสดงชื่อทุก object ใน console เพื่อดูโครงสร้างโมเดล
  useEffect(() => {
    if (scene) {
      console.log('=== โครงสร้างโมเดล human1.glb ===')
      
      const objectNames = []
      
      // เพิ่ม raycast และ pointer events ให้กับทุก mesh
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name) {
            objectNames.push(child.name)
          }
          
          // เปิดใช้งาน pointer events
          child.userData.selectable = true
          
          // Clone material เพื่อไม่ให้กระทบ mesh อื่น
          if (child.material) {
            child.material = child.material.clone()
          }
        }
      })
      
      // แสดงรายชื่อทั้งหมดในรูปแบบที่อ่านง่าย
      console.log('📋 รายชื่อ Object ทั้งหมดใน human1.glb:')
      console.log('จำนวนทั้งหมด:', objectNames.length, 'objects')
      console.log('─'.repeat(50))
      objectNames.forEach((name, index) => {
        console.log(`${index + 1}. "${name}"`)
      })
      console.log('─'.repeat(50))
      console.log('💡 คัดลอกรายชื่อทั้งหมด:')
      console.log(JSON.stringify(objectNames, null, 2))
    }
  }, [scene])

  // เพิ่มเอฟเฟกต์ highlight เมื่อ hover
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (hoveredPart && child.name === hoveredPart) {
            // Highlight ส่วนที่ hover
            child.material.emissive = new THREE.Color(0x4444ff)
            child.material.emissiveIntensity = 0.5
          } else {
            // Reset ส่วนอื่นๆ
            child.material.emissive = new THREE.Color(0x000000)
            child.material.emissiveIntensity = 0
          }
        }
      })
    }
  }, [scene, hoveredPart])

  // แมป object name กับส่วนต่างๆ ของ anatomy (รองรับ 206 กระดูก)
  const getPartIdFromObjectName = (objectName) => {
    // ลบ suffix _beige_0 ออกก่อน
    const cleanName = objectName.replace(/_beige_\d+$/, '')
    
    const partMapping = {
      // ========== ชื่อจริงจาก human1.glb model ==========
      
      // กะโหลกศีรษะและใบหน้า
      'Cranium': 'skull',
      'cranium': 'skull',
      'Mandible': 'mandible',
      'mandible': 'mandible',
      
      // คอและ Hyoid
      'hyoid': 'hyoid',
      'Hyoid': 'hyoid',
      
      // Vertebrae - Cervical (C1-C7)
      'c1': 'c1',
      'C1': 'c1',
      'c2': 'c2',
      'C2': 'c2',
      'c3': 'c3',
      'C3': 'c3',
      'c4': 'c4',
      'C4': 'c4',
      'c5': 'c5',
      'C5': 'c5',
      'c6': 'c6',
      'C6': 'c6',
      'c7': 'c7',
      'C7': 'c7',
      
      // Vertebrae - Thoracic (T1-T12)
      't1': 't1',
      'T1': 't1',
      't2': 't2',
      'T2': 't2',
      't3': 't3',
      'T3': 't3',
      't4': 't4',
      'T4': 't4',
      't5': 't5',
      'T5': 't5',
      't6': 't6',
      'T6': 't6',
      't7': 't7',
      'T7': 't7',
      't8': 't8',
      'T8': 't8',
      't9': 't9',
      'T9': 't9',
      't10': 't10',
      'T10': 't10',
      't11': 't11',
      'T11': 't11',
      't12': 't12',
      'T12': 't12',
      
      // Vertebrae - Lumbar (L1-L5)
      'l1': 'l1',
      'L1': 'l1',
      'l2': 'l2',
      'L2': 'l2',
      'l3': 'l3',
      'L3': 'l3',
      'l4': 'l4',
      'L4': 'l4',
      'l5': 'l5',
      'L5': 'l5',
      
      // Sacrum & Coccyx
      'Sacrum': 'sacrum',
      'sacrum': 'sacrum',
      'Coccyx': 'coccyx',
      'coccyx': 'coccyx',
      
      // Sternum
      'Sternum': 'sternum',
      'sternum': 'sternum',
      'Xiphoid_process': 'xiphoidProcess',
      'xiphoid_process': 'xiphoidProcess',
      
      // Ribs - Left
      'l_rib1': 'rib1',
      'l_rib2': 'rib2',
      'l_rib3': 'rib3',
      'l_rib4': 'rib4',
      'l_rib5': 'rib5',
      'l_rib6': 'rib6',
      'l_rib7': 'rib7',
      'l_rib8': 'rib8',
      'l_rib9': 'rib9',
      'l_rib10': 'rib10',
      'l_rib11': 'rib11',
      'l_rib12': 'rib12',
      
      // Ribs - Right
      'r_rib1': 'rib1',
      'r_rib2': 'rib2',
      'r_rib3': 'rib3',
      'r_rib4': 'rib4',
      'r_rib5': 'rib5',
      'r_rib6': 'rib6',
      'r_rib7': 'rib7',
      'r_rib8': 'rib8',
      'r_rib9': 'rib9',
      'r_rib10': 'rib10',
      'r_rib11': 'rib11',
      'r_rib12': 'rib12',
      
      // Clavicle
      'l_clavicle': 'clavicleLeft',
      'r_clavicle': 'clavicleRight',
      
      // Scapula
      'l_scapula': 'scapulaLeft',
      'r_scapula': 'scapulaRight',
      
      // Humerus
      'l_humerus': 'humerusLeft',
      'r_humerus': 'humerusRight',
      
      // Radius
      'l_radius': 'radiusLeft',
      'r_radius': 'radiusRight',
      
      // Ulna
      'l_ulna': 'ulnaLeft',
      'r_ulna': 'ulnaRight',
      
      // Carpal bones - Left
      'l_scaphoid': 'scaphoid',
      'l_lunate': 'lunate',
      'l_triquetral': 'triquetrum',
      'l_pisiform': 'pisiform',
      'l_trapezium': 'trapezium',
      'l_trapezoid': 'trapezoid',
      'l_capitate': 'capitate',
      'l_hamate': 'hamate',
      
      // Carpal bones - Right
      'r_scaphoid': 'scaphoid',
      'r_lunate': 'lunate',
      'r_triquetral': 'triquetrum',
      'r_pisiform': 'pisiform',
      'r_trapezium': 'trapezium',
      'r_trapezoid': 'trapezoid',
      'r_capitate': 'capitate',
      'r_hamate': 'hamate',
      
      // Metacarpals - Left
      'l_metacarpal1': 'metacarpal1',
      'l_metacarpal2': 'metacarpal2',
      'l_metacarpal3': 'metacarpal3',
      'l_metacarpal4': 'metacarpal4',
      'l_metacarpal5': 'metacarpal5',
      
      // Metacarpals - Right
      'r_metacarpal1': 'metacarpal1',
      'r_metacarpal2': 'metacarpal2',
      'r_metacarpal3': 'metacarpal3',
      'r_metacarpal4': 'metacarpal4',
      'r_metacarpal5': 'metacarpal5',
      
      // Hand Phalanges - Left & Right (map to general phalanx types)
      'l_proximal_phalange1': 'proximalPhalanx',
      'l_distal_phalange1': 'distalPhalanx',
      'l_proximal_phalange2': 'proximalPhalanx',
      'l_intermediate_phalange2': 'middlePhalanx',
      'l_distal_phalange2': 'distalPhalanx',
      'l_proximal_phalange3': 'proximalPhalanx',
      'l_intermediate_phalange3': 'middlePhalanx',
      'l_distal_phalange3': 'distalPhalanx',
      'l_proximal_phalange4': 'proximalPhalanx',
      'l_intermediate_phalange4': 'middlePhalanx',
      'l_distal_phalange4': 'distalPhalanx',
      'l_proximal_phalange5': 'proximalPhalanx',
      'l_intermediate_phalange5': 'middlePhalanx',
      'l_distal_phalange5': 'distalPhalanx',
      
      'r_proximal_phalange1': 'proximalPhalanx',
      'r_distal_phalange1': 'distalPhalanx',
      'r_proximal_phalange2': 'proximalPhalanx',
      'r_intermediate_phalange2': 'middlePhalanx',
      'r_distal_phalange2': 'distalPhalanx',
      'r_proximal_phalange3': 'proximalPhalanx',
      'r_intermediate_phalange3': 'middlePhalanx',
      'r_distal_phalange3': 'distalPhalanx',
      'r_proximal_phalange4': 'proximalPhalanx',
      'r_intermediate_phalange4': 'middlePhalanx',
      'r_distal_phalange4': 'distalPhalanx',
      'r_proximal_phalange5': 'proximalPhalanx',
      'r_intermediate_phalange5': 'middlePhalanx',
      'r_distal_phalange5': 'distalPhalanx',
      
      // Pelvis (Os Coxa)
      'l_oscoxa': 'pelvis',
      'r_oscoxa': 'pelvis',
      
      // Femur
      'l_femur': 'femurLeft',
      'r_femur': 'femurRight',
      
      // Patella
      'l_patella': 'patellaLeft',
      'r_patella': 'patellaRight',
      
      // Tibia
      'l_tibia': 'tibiaLeft',
      'r_tibia': 'tibiaRight',
      
      // Fibula
      'l_fibula': 'fibulaLeft',
      'r_fibula': 'fibulaRight',
      
      // Tarsal bones - Left
      'l_talus': 'talus',
      'l_calcaneus': 'calcaneus',
      'l_navicular': 'navicular',
      'l_cuboid': 'cuboid',
      'l_medial_cuneiform': 'cuneiform1',
      'l_intermediate_cuneiform': 'cuneiform2',
      'l_lateral_cuneiform': 'cuneiform3',
      
      // Tarsal bones - Right
      'r_talus': 'talus',
      'r_calcaneus': 'calcaneus',
      'r_navicular': 'navicular',
      'r_cuboid': 'cuboid',
      'r_medial_cuneiform': 'cuneiform1',
      'r_intermediate_cuneiform': 'cuneiform2',
      'r_lateral_cuneiform': 'cuneiform3',
      
      // Metatarsals - Left (มี underscore ก่อนตัวเลข)
      'l_metatarsal_1': 'metatarsal1',
      'l_metatarsal_2': 'metatarsal2',
      'l_metatarsal_3': 'metatarsal3',
      'l_metatarsal_4': 'metatarsal4',
      'l_metatarsal_5': 'metatarsal5',
      
      // Metatarsals - Right (มี underscore ก่อนตัวเลข)
      'r_metatarsal_1': 'metatarsal1',
      'r_metatarsal_2': 'metatarsal2',
      'r_metatarsal_3': 'metatarsal3',
      'r_metatarsal_4': 'metatarsal4',
      'r_metatarsal_5': 'metatarsal5',
      
      // Foot Phalanges - Left & Right (map to general foot phalanx types)
      'l_proximal_phalange_1': 'proximalPhalanxFoot',
      'l_distal_phalange_1': 'distalPhalanxFoot',
      'l_proximal_phalange_2': 'proximalPhalanxFoot',
      'l_intermediate_phalange_2': 'middlePhalanxFoot',
      'l_distal_phalange_2': 'distalPhalanxFoot',
      'l_proximal_phalange_3': 'proximalPhalanxFoot',
      'l_intermediate_phalange_3': 'middlePhalanxFoot',
      'l_distal_phalange_3': 'distalPhalanxFoot',
      'l_proximal_phalange_4': 'proximalPhalanxFoot',
      'l_intermediate_phalange_4': 'middlePhalanxFoot',
      'l_distal_phalange_4': 'distalPhalanxFoot',
      'l_proximal_phalange_5': 'proximalPhalanxFoot',
      'l_interemediate_phalange_5': 'middlePhalanxFoot', // typo ใน model
      'l_distal_phalange_5': 'distalPhalanxFoot',
      
      'r_proximal_phalange_1': 'proximalPhalanxFoot',
      'r_distal_phalange_1': 'distalPhalanxFoot',
      'r_proximal_phalange_2': 'proximalPhalanxFoot',
      'r_intermediate_phalange_2': 'middlePhalanxFoot',
      'r_distal_phalange_2': 'distalPhalanxFoot',
      'r_proximal_phalange_3': 'proximalPhalanxFoot',
      'r_intermediate_phalange_3': 'middlePhalanxFoot',
      'r_distal_phalange_3': 'distalPhalanxFoot',
      'r_proximal_phalange_4': 'proximalPhalanxFoot',
      'r_intermediate_phalange_4': 'middlePhalanxFoot',
      'r_distal_phalange_4': 'distalPhalanxFoot',
      'r_proximal_phalange_5': 'proximalPhalanxFoot',
      'r_intermediate_phalange_5': 'middlePhalanxFoot',
      'r_distal_phalange_5': 'distalPhalanxFoot',
      
      // Sesamoids
      'sesamoids': 'sesamoids',
      'sesamoids001': 'sesamoids',
      
      'Parietal': 'parietal',
      'parietal': 'parietal',
      'ParietalBone': 'parietal',
      'parietalbone': 'parietal',
      'Parietal_L': 'parietal',
      'Parietal_R': 'parietal',
      'ParietalLeft': 'parietal',
      'ParietalRight': 'parietal',
      'Os_Parietale': 'parietal',
      
      'Temporal': 'temporal',
      'temporal': 'temporal',
      'TemporalBone': 'temporal',
      'temporalbone': 'temporal',
      'Temporal_L': 'temporal',
      'Temporal_R': 'temporal',
      'TemporalLeft': 'temporal',
      'TemporalRight': 'temporal',
      'Os_Temporale': 'temporal',
      
      'Occipital': 'occipital',
      'occipital': 'occipital',
      'OccipitalBone': 'occipital',
      'occipitalbone': 'occipital',
      'Os_Occipitale': 'occipital',
      
      'Sphenoid': 'sphenoid',
      'sphenoid': 'sphenoid',
      'SphenoidBone': 'sphenoid',
      'sphenoidbone': 'sphenoid',
      'Os_Sphenoidale': 'sphenoid',
      
      'Ethmoid': 'ethmoid',
      'ethmoid': 'ethmoid',
      'EthmoidBone': 'ethmoid',
      'ethmoidbone': 'ethmoid',
      'Os_Ethmoidale': 'ethmoid',
      
      'Head': 'skull',
      'head': 'skull',
      'Skull': 'skull',
      'skull': 'skull',
      'Cranium': 'skull',
      'cranium': 'skull',
      
      // ========== กระดูกใบหน้า (Facial Bones) - 14 ชิ้น ==========
      'Nasal': 'nasal',
      'nasal': 'nasal',
      'NasalBone': 'nasal',
      'nasalbone': 'nasal',
      'Nasal_L': 'nasal',
      'Nasal_R': 'nasal',
      'NasalLeft': 'nasal',
      'NasalRight': 'nasal',
      'Os_Nasale': 'nasal',
      
      'Maxilla': 'maxilla',
      'maxilla': 'maxilla',
      'MaxillaBone': 'maxilla',
      'maxillabone': 'maxilla',
      'Maxilla_L': 'maxilla',
      'Maxilla_R': 'maxilla',
      'MaxillaLeft': 'maxilla',
      'MaxillaRight': 'maxilla',
      'UpperJaw': 'maxilla',
      
      'Zygomatic': 'zygomatic',
      'zygomatic': 'zygomatic',
      'ZygomaticBone': 'zygomatic',
      'zygomaticbone': 'zygomatic',
      'Zygomatic_L': 'zygomatic',
      'Zygomatic_R': 'zygomatic',
      'ZygomaticLeft': 'zygomatic',
      'ZygomaticRight': 'zygomatic',
      'Cheekbone': 'zygomatic',
      'cheekbone': 'zygomatic',
      
      'Mandible': 'mandible',
      'mandible': 'mandible',
      'MandibleBone': 'mandible',
      'mandiblebone': 'mandible',
      'Jaw': 'mandible',
      'jaw': 'mandible',
      'LowerJaw': 'mandible',
      'lowerjaw': 'mandible',
      
      'Lacrimal': 'lacrimal',
      'lacrimal': 'lacrimal',
      'LacrimalBone': 'lacrimal',
      'lacrimalbone': 'lacrimal',
      'Lacrimal_L': 'lacrimal',
      'Lacrimal_R': 'lacrimal',
      'LacrimalLeft': 'lacrimal',
      'LacrimalRight': 'lacrimal',
      
      'Palatine': 'palatine',
      'palatine': 'palatine',
      'PalatineBone': 'palatine',
      'palatinebone': 'palatine',
      'Palatine_L': 'palatine',
      'Palatine_R': 'palatine',
      'PalatineLeft': 'palatine',
      'PalatineRight': 'palatine',
      
      'Vomer': 'vomer',
      'vomer': 'vomer',
      'VomerBone': 'vomer',
      'vomerbone': 'vomer',
      
      'InferiorNasalConcha': 'inferiorNasalConcha',
      'inferiorNasalConcha': 'inferiorNasalConcha',
      'inferiornasal': 'inferiorNasalConcha',
      'InferiorConcha': 'inferiorNasalConcha',
      'InferiorNasalConcha_L': 'inferiorNasalConcha',
      'InferiorNasalConcha_R': 'inferiorNasalConcha',
      
      // ========== กระดูกหู (Auditory Ossicles) - 6 ชิ้น ==========
      'Malleus': 'malleus',
      'malleus': 'malleus',
      'MalleusBone': 'malleus',
      'malleusbone': 'malleus',
      'Malleus_L': 'malleus',
      'Malleus_R': 'malleus',
      'Hammer': 'malleus',
      
      'Incus': 'incus',
      'incus': 'incus',
      'IncusBone': 'incus',
      'incusbone': 'incus',
      'Incus_L': 'incus',
      'Incus_R': 'incus',
      'Anvil': 'incus',
      
      'Stapes': 'stapes',
      'stapes': 'stapes',
      'StapesBone': 'stapes',
      'stapesbone': 'stapes',
      'Stapes_L': 'stapes',
      'Stapes_R': 'stapes',
      'Stirrup': 'stapes',
      
      // ========== กระดูกลิ้น (Hyoid Bone) - 1 ชิ้น ==========
      'Hyoid': 'hyoid',
      'hyoid': 'hyoid',
      'HyoidBone': 'hyoid',
      'hyoidbone': 'hyoid',
      'Os_Hyoideum': 'hyoid',
      
      // ========== กระดูกสันหลัง (Vertebral Column) - 26 ชิ้น ==========
      // กระดูกคอ (Cervical) - 7 ชิ้น
      'C1': 'c1',
      'c1': 'c1',
      'C-1': 'c1',
      'C_1': 'c1',
      'Atlas': 'c1',
      'atlas': 'c1',
      'Cervical1': 'c1',
      'cervical1': 'c1',
      'CervicalVertebra1': 'c1',
      
      'C2': 'c2',
      'c2': 'c2',
      'C-2': 'c2',
      'C_2': 'c2',
      'Axis': 'c2',
      'axis': 'c2',
      'Cervical2': 'c2',
      'cervical2': 'c2',
      'CervicalVertebra2': 'c2',
      
      'C3': 'c3',
      'c3': 'c3',
      'C-3': 'c3',
      'C_3': 'c3',
      'Cervical3': 'c3',
      'cervical3': 'c3',
      'CervicalVertebra3': 'c3',
      
      'C4': 'c4',
      'c4': 'c4',
      'C-4': 'c4',
      'C_4': 'c4',
      'Cervical4': 'c4',
      'cervical4': 'c4',
      'CervicalVertebra4': 'c4',
      
      'C5': 'c5',
      'c5': 'c5',
      'C-5': 'c5',
      'C_5': 'c5',
      'Cervical5': 'c5',
      'cervical5': 'c5',
      'CervicalVertebra5': 'c5',
      
      'C6': 'c6',
      'c6': 'c6',
      'C-6': 'c6',
      'C_6': 'c6',
      'Cervical6': 'c6',
      'cervical6': 'c6',
      'CervicalVertebra6': 'c6',
      
      'C7': 'c7',
      'c7': 'c7',
      'C-7': 'c7',
      'C_7': 'c7',
      'Cervical7': 'c7',
      'cervical7': 'c7',
      'CervicalVertebra7': 'c7',
      
      'Cervical': 'cervical',
      'cervical': 'cervical',
      'CervicalVertebrae': 'cervical',
      'CervicalSpine': 'cervical',
      
      // กระดูกหลัง (Thoracic) - 12 ชิ้น
      'T1': 't1',
      't1': 't1',
      'T-1': 't1',
      'T_1': 't1',
      'Thoracic1': 't1',
      'thoracic1': 't1',
      'ThoracicVertebra1': 't1',
      
      'T2': 't2',
      't2': 't2',
      'T-2': 't2',
      'T_2': 't2',
      'Thoracic2': 't2',
      'thoracic2': 't2',
      'ThoracicVertebra2': 't2',
      
      'T3': 't3',
      't3': 't3',
      'T-3': 't3',
      'T_3': 't3',
      'Thoracic3': 't3',
      'thoracic3': 't3',
      'ThoracicVertebra3': 't3',
      
      'T4': 't4',
      't4': 't4',
      'T-4': 't4',
      'T_4': 't4',
      'Thoracic4': 't4',
      'thoracic4': 't4',
      'ThoracicVertebra4': 't4',
      
      'T5': 't5',
      't5': 't5',
      'T-5': 't5',
      'T_5': 't5',
      'Thoracic5': 't5',
      'thoracic5': 't5',
      'ThoracicVertebra5': 't5',
      
      'T6': 't6',
      't6': 't6',
      'T-6': 't6',
      'T_6': 't6',
      'Thoracic6': 't6',
      'thoracic6': 't6',
      'ThoracicVertebra6': 't6',
      
      'T7': 't7',
      't7': 't7',
      'T-7': 't7',
      'T_7': 't7',
      'Thoracic7': 't7',
      'thoracic7': 't7',
      'ThoracicVertebra7': 't7',
      
      'T8': 't8',
      't8': 't8',
      'T-8': 't8',
      'T_8': 't8',
      'Thoracic8': 't8',
      'thoracic8': 't8',
      'ThoracicVertebra8': 't8',
      
      'T9': 't9',
      't9': 't9',
      'T-9': 't9',
      'T_9': 't9',
      'Thoracic9': 't9',
      'thoracic9': 't9',
      'ThoracicVertebra9': 't9',
      
      'T10': 't10',
      't10': 't10',
      'T-10': 't10',
      'T_10': 't10',
      'Thoracic10': 't10',
      'thoracic10': 't10',
      'ThoracicVertebra10': 't10',
      
      'T11': 't11',
      't11': 't11',
      'T-11': 't11',
      'T_11': 't11',
      'Thoracic11': 't11',
      'thoracic11': 't11',
      'ThoracicVertebra11': 't11',
      
      'T12': 't12',
      't12': 't12',
      'T-12': 't12',
      'T_12': 't12',
      'Thoracic12': 't12',
      'thoracic12': 't12',
      'ThoracicVertebra12': 't12',
      
      'Thoracic': 'thoracic',
      'thoracic': 'thoracic',
      'ThoracicVertebrae': 'thoracic',
      'ThoracicSpine': 'thoracic',
      
      // กระดูกเอว (Lumbar) - 5 ชิ้น
      'L1': 'l1',
      'l1': 'l1',
      'L-1': 'l1',
      'L_1': 'l1',
      'Lumbar1': 'l1',
      'lumbar1': 'l1',
      'LumbarVertebra1': 'l1',
      
      'L2': 'l2',
      'l2': 'l2',
      'L-2': 'l2',
      'L_2': 'l2',
      'Lumbar2': 'l2',
      'lumbar2': 'l2',
      'LumbarVertebra2': 'l2',
      
      'L3': 'l3',
      'l3': 'l3',
      'L-3': 'l3',
      'L_3': 'l3',
      'Lumbar3': 'l3',
      'lumbar3': 'l3',
      'LumbarVertebra3': 'l3',
      
      'L4': 'l4',
      'l4': 'l4',
      'L-4': 'l4',
      'L_4': 'l4',
      'Lumbar4': 'l4',
      'lumbar4': 'l4',
      'LumbarVertebra4': 'l4',
      
      'L5': 'l5',
      'l5': 'l5',
      'L-5': 'l5',
      'L_5': 'l5',
      'Lumbar5': 'l5',
      'lumbar5': 'l5',
      'LumbarVertebra5': 'l5',
      
      'Lumbar': 'lumbar',
      'lumbar': 'lumbar',
      'LumbarVertebrae': 'lumbar',
      'LumbarSpine': 'lumbar',
      
      // กระดูกกระเบนเหน็บ (Sacrum) - 1 ชิ้น
      'Sacrum': 'sacrum',
      'sacrum': 'sacrum',
      'SacrumBone': 'sacrum',
      'sacrumbone': 'sacrum',
      'SacralVertebrae': 'sacrum',
      'Os_Sacrum': 'sacrum',
      
      // กระดูกก้นกบ (Coccyx) - 1 ชิ้น
      'Coccyx': 'coccyx',
      'coccyx': 'coccyx',
      'CoccyxBone': 'coccyx',
      'coccyxbone': 'coccyx',
      'Tailbone': 'coccyx',
      'tailbone': 'coccyx',
      'Os_Coccygis': 'coccyx',
      
      'Spine': 'spine',
      'spine': 'spine',
      'Vertebra': 'spine',
      'vertebra': 'spine',
      'Vertebrae': 'spine',
      'vertebrae': 'spine',
      'VertebralColumn': 'spine',
      
      // ========== กระดูกซี่โครง (Ribs) - 24 ชิ้น ==========
      'Rib1': 'rib1',
      'rib1': 'rib1',
      'Rib_1': 'rib1',
      'Rib1_L': 'rib1',
      'Rib1_R': 'rib1',
      'FirstRib': 'rib1',
      
      'Rib2': 'rib2',
      'rib2': 'rib2',
      'Rib_2': 'rib2',
      'Rib2_L': 'rib2',
      'Rib2_R': 'rib2',
      'SecondRib': 'rib2',
      
      'Rib3': 'rib3',
      'rib3': 'rib3',
      'Rib_3': 'rib3',
      'Rib3_L': 'rib3',
      'Rib3_R': 'rib3',
      'ThirdRib': 'rib3',
      
      'Rib4': 'rib4',
      'rib4': 'rib4',
      'Rib_4': 'rib4',
      'Rib4_L': 'rib4',
      'Rib4_R': 'rib4',
      'FourthRib': 'rib4',
      
      'Rib5': 'rib5',
      'rib5': 'rib5',
      'Rib_5': 'rib5',
      'Rib5_L': 'rib5',
      'Rib5_R': 'rib5',
      'FifthRib': 'rib5',
      
      'Rib6': 'rib6',
      'rib6': 'rib6',
      'Rib_6': 'rib6',
      'Rib6_L': 'rib6',
      'Rib6_R': 'rib6',
      'SixthRib': 'rib6',
      
      'Rib7': 'rib7',
      'rib7': 'rib7',
      'Rib_7': 'rib7',
      'Rib7_L': 'rib7',
      'Rib7_R': 'rib7',
      'SeventhRib': 'rib7',
      
      'Rib8': 'rib8',
      'rib8': 'rib8',
      'Rib_8': 'rib8',
      'Rib8_L': 'rib8',
      'Rib8_R': 'rib8',
      'EighthRib': 'rib8',
      
      'Rib9': 'rib9',
      'rib9': 'rib9',
      'Rib_9': 'rib9',
      'Rib9_L': 'rib9',
      'Rib9_R': 'rib9',
      'NinthRib': 'rib9',
      
      'Rib10': 'rib10',
      'rib10': 'rib10',
      'Rib_10': 'rib10',
      'Rib10_L': 'rib10',
      'Rib10_R': 'rib10',
      'TenthRib': 'rib10',
      
      'Rib11': 'rib11',
      'rib11': 'rib11',
      'Rib_11': 'rib11',
      'Rib11_L': 'rib11',
      'Rib11_R': 'rib11',
      'EleventhRib': 'rib11',
      
      'Rib12': 'rib12',
      'rib12': 'rib12',
      'Rib_12': 'rib12',
      'Rib12_L': 'rib12',
      'Rib12_R': 'rib12',
      'TwelfthRib': 'rib12',
      
      'Rib_L': 'ribs',
      'Rib_R': 'ribs',
      'RibLeft': 'ribs',
      'RibRight': 'ribs',
      'Rib': 'ribs',
      'rib': 'ribs',
      'Ribs': 'ribs',
      'ribs': 'ribs',
      'Costa': 'ribs',
      
      // ========== กระดูกหน้าอก (Sternum) - 1 ชิ้น ==========
      'Sternum': 'sternum',
      'sternum': 'sternum',
      'SternumBone': 'sternum',
      'sternumbone': 'sternum',
      'Breastbone': 'sternum',
      'breastbone': 'sternum',
      'Manubrium': 'sternum',
      'manubrium': 'sternum',
      'SternalBody': 'sternum',
      'Body': 'sternum',
      'Gladiolus': 'sternum',
      'XiphoidProcess': 'sternum',
      'Xiphoid': 'sternum',
      'xiphoid': 'sternum',
      
      // ========== กระดูกไหปลาร้า (Clavicle) - 2 ชิ้น ==========
      'Clavicle': 'clavicle',
      'clavicle': 'clavicle',
      'ClavicleBone': 'clavicle',
      'claviclebone': 'clavicle',
      'Collarbone': 'clavicle',
      'collarbone': 'clavicle',
      'Clavicle_L': 'clavicleLeft',
      'Clavicle_R': 'clavicleRight',
      'ClavicleLeft': 'clavicleLeft',
      'ClavicleRight': 'clavicleRight',
      'LeftClavicle': 'clavicleLeft',
      'RightClavicle': 'clavicleRight',
      'Clavicula': 'clavicle',
      
      // ========== กระดูกสะบัก (Scapula) - 2 ชิ้น ==========
      'Scapula': 'scapula',
      'scapula': 'scapula',
      'ScapulaBone': 'scapula',
      'scapulabone': 'scapula',
      'ShoulderBlade': 'scapula',
      'shoulderblade': 'scapula',
      'Scapula_L': 'scapulaLeft',
      'Scapula_R': 'scapulaRight',
      'ScapulaLeft': 'scapulaLeft',
      'ScapulaRight': 'scapulaRight',
      'LeftScapula': 'scapulaLeft',
      'RightScapula': 'scapulaRight',
      
      // ========== กระดูกต้นแขน (Humerus) - 2 ชิ้น ==========
      'Humerus': 'humerus',
      'humerus': 'humerus',
      'HumerusBone': 'humerus',
      'humerusbone': 'humerus',
      'UpperArm': 'humerus',
      'upperarm': 'humerus',
      'Humerus_L': 'humerusLeft',
      'Humerus_R': 'humerusRight',
      'HumerusLeft': 'humerusLeft',
      'HumerusRight': 'humerusRight',
      'LeftHumerus': 'humerusLeft',
      'RightHumerus': 'humerusRight',
      
      // ========== กระดูกปลายแขน (Radius & Ulna) - 4 ชิ้น ==========
      'Radius': 'radius',
      'radius': 'radius',
      'RadiusBone': 'radius',
      'radiusbone': 'radius',
      'Radius_L': 'radiusLeft',
      'Radius_R': 'radiusRight',
      'RadiusLeft': 'radiusLeft',
      'RadiusRight': 'radiusRight',
      'LeftRadius': 'radiusLeft',
      'RightRadius': 'radiusRight',
      
      'Ulna': 'ulna',
      'ulna': 'ulna',
      'UlnaBone': 'ulna',
      'ulnabone': 'ulna',
      'Ulna_L': 'ulnaLeft',
      'Ulna_R': 'ulnaRight',
      'UlnaLeft': 'ulnaLeft',
      'UlnaRight': 'ulnaRight',
      'LeftUlna': 'ulnaLeft',
      'RightUlna': 'ulnaRight',
      
      // ========== กระดูกข้อมือ (Carpal Bones) - 16 ชิ้น ==========
      // แต่ละข้าง 8 ชิ้น
      'Scaphoid': 'scaphoid',
      'scaphoid': 'scaphoid',
      'ScaphoidBone': 'scaphoid',
      'scaphoidbone': 'scaphoid',
      'Scaphoid_L': 'scaphoid',
      'Scaphoid_R': 'scaphoid',
      'Navicular': 'scaphoid',
      
      'Lunate': 'lunate',
      'lunate': 'lunate',
      'LunateBone': 'lunate',
      'lunatebone': 'lunate',
      'Lunate_L': 'lunate',
      'Lunate_R': 'lunate',
      'Semilunar': 'lunate',
      
      'Triquetrum': 'triquetrum',
      'triquetrum': 'triquetrum',
      'TriquetrumBone': 'triquetrum',
      'triquetrumbone': 'triquetrum',
      'Triquetrum_L': 'triquetrum',
      'Triquetrum_R': 'triquetrum',
      'Triquetral': 'triquetrum',
      'Cuneiform': 'triquetrum',
      
      'Pisiform': 'pisiform',
      'pisiform': 'pisiform',
      'PisiformBone': 'pisiform',
      'pisiformbone': 'pisiform',
      'Pisiform_L': 'pisiform',
      'Pisiform_R': 'pisiform',
      
      'Trapezium': 'trapezium',
      'trapezium': 'trapezium',
      'TrapeziumBone': 'trapezium',
      'trapeziumbone': 'trapezium',
      'Trapezium_L': 'trapezium',
      'Trapezium_R': 'trapezium',
      'GreaterMultangular': 'trapezium',
      
      'Trapezoid': 'trapezoid',
      'trapezoid': 'trapezoid',
      'TrapezoidBone': 'trapezoid',
      'trapezoidbone': 'trapezoid',
      'Trapezoid_L': 'trapezoid',
      'Trapezoid_R': 'trapezoid',
      'LesserMultangular': 'trapezoid',
      
      'Capitate': 'capitate',
      'capitate': 'capitate',
      'CapitateBone': 'capitate',
      'capitatebone': 'capitate',
      'Capitate_L': 'capitate',
      'Capitate_R': 'capitate',
      'Os_Magnum': 'capitate',
      
      'Hamate': 'hamate',
      'hamate': 'hamate',
      'HamateBone': 'hamate',
      'hamatebone': 'hamate',
      'Hamate_L': 'hamate',
      'Hamate_R': 'hamate',
      'Unciform': 'hamate',
      
      'Carpal': 'carpal',
      'carpal': 'carpal',
      'CarpalBone': 'carpal',
      'carpalbone': 'carpal',
      'Carpus': 'carpal',
      
      // ========== กระดูกฝ่ามือ (Metacarpals) - 10 ชิ้น ==========
      'Metacarpal1': 'metacarpal1',
      'metacarpal1': 'metacarpal1',
      'Metacarpal_1': 'metacarpal1',
      'FirstMetacarpal': 'metacarpal1',
      'Metacarpal1_L': 'metacarpal1',
      'Metacarpal1_R': 'metacarpal1',
      
      'Metacarpal2': 'metacarpal2',
      'metacarpal2': 'metacarpal2',
      'Metacarpal_2': 'metacarpal2',
      'SecondMetacarpal': 'metacarpal2',
      'Metacarpal2_L': 'metacarpal2',
      'Metacarpal2_R': 'metacarpal2',
      
      'Metacarpal3': 'metacarpal3',
      'metacarpal3': 'metacarpal3',
      'Metacarpal_3': 'metacarpal3',
      'ThirdMetacarpal': 'metacarpal3',
      'Metacarpal3_L': 'metacarpal3',
      'Metacarpal3_R': 'metacarpal3',
      
      'Metacarpal4': 'metacarpal4',
      'metacarpal4': 'metacarpal4',
      'Metacarpal_4': 'metacarpal4',
      'FourthMetacarpal': 'metacarpal4',
      'Metacarpal4_L': 'metacarpal4',
      'Metacarpal4_R': 'metacarpal4',
      
      'Metacarpal5': 'metacarpal5',
      'metacarpal5': 'metacarpal5',
      'Metacarpal_5': 'metacarpal5',
      'FifthMetacarpal': 'metacarpal5',
      'Metacarpal5_L': 'metacarpal5',
      'Metacarpal5_R': 'metacarpal5',
      
      'Metacarpal': 'metacarpal',
      'metacarpal': 'metacarpal',
      'MetacarpalBone': 'metacarpal',
      'metacarpalbone': 'metacarpal',
      
      // ========== กระดูกนิ้วมือ (Phalanges - Hand) - 28 ชิ้น ==========
      'ProximalPhalanx': 'proximalPhalanx',
      'proximalPhalanx': 'proximalPhalanx',
      'ProximalPhalanxHand': 'proximalPhalanx',
      'proximalphalanxhand': 'proximalPhalanx',
      'ProximalPhalanges': 'proximalPhalanx',
      'PP': 'proximalPhalanx',
      
      'MiddlePhalanx': 'middlePhalanx',
      'middlePhalanx': 'middlePhalanx',
      'MiddlePhalanxHand': 'middlePhalanx',
      'middlephalanxhand': 'middlePhalanx',
      'MiddlePhalanges': 'middlePhalanx',
      'MP': 'middlePhalanx',
      
      'DistalPhalanx': 'distalPhalanx',
      'distalPhalanx': 'distalPhalanx',
      'DistalPhalanxHand': 'distalPhalanx',
      'distalphalanxhand': 'distalPhalanx',
      'DistalPhalanges': 'distalPhalanx',
      'DP': 'distalPhalanx',
      
      'Phalanx': 'phalanx',
      'phalanx': 'phalanx',
      'PhalanxHand': 'phalanx',
      'phalanxhand': 'phalanx',
      'Phalange': 'phalanx',
      'phalange': 'phalanx',
      'Phalanges': 'phalanx',
      'phalanges': 'phalanx',
      'Finger': 'phalanx',
      'finger': 'phalanx',
      'FingerBone': 'phalanx',
      
      // กระดูกมือรวม
      'Hand': 'hand',
      'hand': 'hand',
      'HandBone': 'hand',
      'handbone': 'hand',
      'Hand_L': 'handLeft',
      'Hand_R': 'handRight',
      'HandLeft': 'handLeft',
      'HandRight': 'handRight',
      'LeftHand': 'handLeft',
      'RightHand': 'handRight',
      
      // ========== กระดูกเชิงกราน (Pelvis) - 2 ชิ้น (แต่ละชิ้นเกิดจากกระดูก 3 ชิ้นหลอมรวม) ==========
      'Pelvis': 'pelvis',
      'pelvis': 'pelvis',
      'PelvicBone': 'pelvis',
      'pelvicbone': 'pelvis',
      'PelvicGirdle': 'pelvis',
      'HipBone': 'pelvis',
      'hipbone': 'pelvis',
      'Hip': 'pelvis',
      'hip': 'pelvis',
      'Os_Coxae': 'pelvis',
      
      'Ilium': 'ilium',
      'ilium': 'ilium',
      'Os_Ilium': 'ilium',
      'OsIlium': 'ilium',
      'Iliac': 'ilium',
      'iliac': 'ilium',
      'IliacBone': 'ilium',
      'Ilium_L': 'iliumLeft',
      'Ilium_R': 'iliumRight',
      'IliumLeft': 'iliumLeft',
      'IliumRight': 'iliumRight',
      'LeftIlium': 'iliumLeft',
      'RightIlium': 'iliumRight',
      'ilium_left': 'iliumLeft',
      'ilium_right': 'iliumRight',
      'L_Ilium': 'iliumLeft',
      'R_Ilium': 'iliumRight',
      
      'Ischium': 'ischium',
      'ischium': 'ischium',
      'Os_Ischium': 'ischium',
      'OsIschium': 'ischium',
      'Ischial': 'ischium',
      'ischial': 'ischium',
      'IschialBone': 'ischium',
      'Ischium_L': 'ischiumLeft',
      'Ischium_R': 'ischiumRight',
      'IschiumLeft': 'ischiumLeft',
      'IschiumRight': 'ischiumRight',
      'LeftIschium': 'ischiumLeft',
      'RightIschium': 'ischiumRight',
      'ischium_left': 'ischiumLeft',
      'ischium_right': 'ischiumRight',
      'L_Ischium': 'ischiumLeft',
      'R_Ischium': 'ischiumRight',
      
      'Pubis': 'pubis',
      'pubis': 'pubis',
      'Os_Pubis': 'pubis',
      'OsPubis': 'pubis',
      'Pubic': 'pubis',
      'pubic': 'pubis',
      'PubicBone': 'pubis',
      'PubisBone': 'pubis',
      'Pubis_L': 'pubisLeft',
      'Pubis_R': 'pubisRight',
      'PubisLeft': 'pubisLeft',
      'PubisRight': 'pubisRight',
      'LeftPubis': 'pubisLeft',
      'RightPubis': 'pubisRight',
      'pubis_left': 'pubisLeft',
      'pubis_right': 'pubisRight',
      'L_Pubis': 'pubisLeft',
      'R_Pubis': 'pubisRight',
      
      // ========== กระดูกต้นขา (Femur) - 2 ชิ้น ==========
      'Femur': 'femur',
      'femur': 'femur',
      'Os_Femoris': 'femur',
      'OsFemoris': 'femur',
      'Femoral': 'femur',
      'femoral': 'femur',
      'FemoralBone': 'femur',
      'ThighBone': 'femur',
      'thighbone': 'femur',
      'Thigh': 'femur',
      'thigh': 'femur',
      'Femur_L': 'femurLeft',
      'Femur_R': 'femurRight',
      'FemurLeft': 'femurLeft',
      'FemurRight': 'femurRight',
      'LeftFemur': 'femurLeft',
      'RightFemur': 'femurRight',
      'femur_left': 'femurLeft',
      'femur_right': 'femurRight',
      'L_Femur': 'femurLeft',
      'R_Femur': 'femurRight',
      
      // ========== กระดูกสะบ้าหัวเข่า (Patella) - 2 ชิ้น ==========
      'Patella': 'patella',
      'patella': 'patella',
      'Os_Patella': 'patella',
      'OsPatella': 'patella',
      'Patellar': 'patella',
      'patellar': 'patella',
      'KneeCap': 'patella',
      'kneecap': 'patella',
      'Kneecap': 'patella',
      'Knee_Cap': 'patella',
      'Patella_L': 'patellaLeft',
      'Patella_R': 'patellaRight',
      'PatellaLeft': 'patellaLeft',
      'PatellaRight': 'patellaRight',
      'LeftPatella': 'patellaLeft',
      'RightPatella': 'patellaRight',
      'patella_left': 'patellaLeft',
      'patella_right': 'patellaRight',
      'L_Patella': 'patellaLeft',
      'R_Patella': 'patellaRight',
      
      // ========== กระดูกหน้าแข้ง (Tibia) - 2 ชิ้น ==========
      'Tibia': 'tibia',
      'tibia': 'tibia',
      'Os_Tibia': 'tibia',
      'OsTibia': 'tibia',
      'Tibial': 'tibia',
      'tibial': 'tibia',
      'TibialBone': 'tibia',
      'Shinbone': 'tibia',
      'shinbone': 'tibia',
      'ShinBone': 'tibia',
      'Shin': 'tibia',
      'shin': 'tibia',
      'Tibia_L': 'tibiaLeft',
      'Tibia_R': 'tibiaRight',
      'TibiaLeft': 'tibiaLeft',
      'TibiaRight': 'tibiaRight',
      'LeftTibia': 'tibiaLeft',
      'RightTibia': 'tibiaRight',
      'tibia_left': 'tibiaLeft',
      'tibia_right': 'tibiaRight',
      'L_Tibia': 'tibiaLeft',
      'R_Tibia': 'tibiaRight',
      
      // ========== กระดูกน่อง (Fibula) - 2 ชิ้น ==========
      'Fibula': 'fibula',
      'fibula': 'fibula',
      'Os_Fibula': 'fibula',
      'OsFibula': 'fibula',
      'Fibular': 'fibula',
      'fibular': 'fibula',
      'FibularBone': 'fibula',
      'CalfBone': 'fibula',
      'calfbone': 'fibula',
      'Calf': 'fibula',
      'calf': 'fibula',
      'Fibula_L': 'fibulaLeft',
      'Fibula_R': 'fibulaRight',
      'FibulaLeft': 'fibulaLeft',
      'FibulaRight': 'fibulaRight',
      'LeftFibula': 'fibulaLeft',
      'RightFibula': 'fibulaRight',
      'fibula_left': 'fibulaLeft',
      'fibula_right': 'fibulaRight',
      'L_Fibula': 'fibulaLeft',
      'R_Fibula': 'fibulaRight',
      
      // ========== กระดูกข้อเท้า (Tarsal Bones) - 14 ชิ้น ==========
      // แต่ละข้าง 7 ชิ้น
      'Talus': 'talus',
      'talus': 'talus',
      'Os_Talus': 'talus',
      'OsTalus': 'talus',
      'Talus_L': 'talusLeft',
      'Talus_R': 'talusRight',
      'TalusLeft': 'talusLeft',
      'TalusRight': 'talusRight',
      'LeftTalus': 'talusLeft',
      'RightTalus': 'talusRight',
      'talus_left': 'talusLeft',
      'talus_right': 'talusRight',
      'L_Talus': 'talusLeft',
      'R_Talus': 'talusRight',
      'Astragalus': 'talus',
      'astragalus': 'talus',
      'Anklebone': 'talus',
      'anklebone': 'talus',
      'AnkleBone': 'talus',
      
      'Calcaneus': 'calcaneus',
      'calcaneus': 'calcaneus',
      'Os_Calcaneus': 'calcaneus',
      'OsCalcaneus': 'calcaneus',
      'Calcaneus_L': 'calcaneusLeft',
      'Calcaneus_R': 'calcaneusRight',
      'CalcaneusLeft': 'calcaneusLeft',
      'CalcaneusRight': 'calcaneusRight',
      'LeftCalcaneus': 'calcaneusLeft',
      'RightCalcaneus': 'calcaneusRight',
      'calcaneus_left': 'calcaneusLeft',
      'calcaneus_right': 'calcaneusRight',
      'L_Calcaneus': 'calcaneusLeft',
      'R_Calcaneus': 'calcaneusRight',
      'Calcaneal': 'calcaneus',
      'calcaneal': 'calcaneus',
      'Heelbone': 'calcaneus',
      'heelbone': 'calcaneus',
      'HeelBone': 'calcaneus',
      'Heel': 'calcaneus',
      'heel': 'calcaneus',
      
      'Navicular': 'navicular',
      'navicular': 'navicular',
      'Os_Navicular': 'navicular',
      'OsNavicular': 'navicular',
      'NavicularFoot': 'navicular',
      'navicularfoot': 'navicular',
      'Navicular_L': 'navicularLeft',
      'Navicular_R': 'navicularRight',
      'NavicularLeft': 'navicularLeft',
      'NavicularRight': 'navicularRight',
      'LeftNavicular': 'navicularLeft',
      'RightNavicular': 'navicularRight',
      'navicular_left': 'navicularLeft',
      'navicular_right': 'navicularRight',
      'L_Navicular': 'navicularLeft',
      'R_Navicular': 'navicularRight',
      'TarsalNavicular': 'navicular',
      'tarsalnavicular': 'navicular',
      
      'Cuboid': 'cuboid',
      'cuboid': 'cuboid',
      'Os_Cuboid': 'cuboid',
      'OsCuboid': 'cuboid',
      'CuboidBone': 'cuboid',
      'cuboidbone': 'cuboid',
      'Cuboid_L': 'cuboidLeft',
      'Cuboid_R': 'cuboidRight',
      'CuboidLeft': 'cuboidLeft',
      'CuboidRight': 'cuboidRight',
      'LeftCuboid': 'cuboidLeft',
      'RightCuboid': 'cuboidRight',
      'cuboid_left': 'cuboidLeft',
      'cuboid_right': 'cuboidRight',
      'L_Cuboid': 'cuboidLeft',
      'R_Cuboid': 'cuboidRight',
      
      'Cuneiform1': 'cuneiform1',
      'cuneiform1': 'cuneiform1',
      'MedialCuneiform': 'cuneiform1',
      'medialcuneiform': 'cuneiform1',
      'Medial_Cuneiform': 'cuneiform1',
      'Cuneiform_Medial': 'cuneiform1',
      'FirstCuneiform': 'cuneiform1',
      'firstcuneiform': 'cuneiform1',
      'Cuneiform1_L': 'cuneiform1Left',
      'Cuneiform1_R': 'cuneiform1Right',
      'MedialCuneiform_L': 'cuneiform1Left',
      'MedialCuneiform_R': 'cuneiform1Right',
      'L_Cuneiform1': 'cuneiform1Left',
      'R_Cuneiform1': 'cuneiform1Right',
      
      'Cuneiform2': 'cuneiform2',
      'cuneiform2': 'cuneiform2',
      'IntermediateCuneiform': 'cuneiform2',
      'intermediatecuneiform': 'cuneiform2',
      'Intermediate_Cuneiform': 'cuneiform2',
      'Cuneiform_Intermediate': 'cuneiform2',
      'MiddleCuneiform': 'cuneiform2',
      'middlecuneiform': 'cuneiform2',
      'SecondCuneiform': 'cuneiform2',
      'secondcuneiform': 'cuneiform2',
      'Cuneiform2_L': 'cuneiform2Left',
      'Cuneiform2_R': 'cuneiform2Right',
      'IntermediateCuneiform_L': 'cuneiform2Left',
      'IntermediateCuneiform_R': 'cuneiform2Right',
      'L_Cuneiform2': 'cuneiform2Left',
      'R_Cuneiform2': 'cuneiform2Right',
      
      'Cuneiform3': 'cuneiform3',
      'cuneiform3': 'cuneiform3',
      'LateralCuneiform': 'cuneiform3',
      'lateralcuneiform': 'cuneiform3',
      'Lateral_Cuneiform': 'cuneiform3',
      'Cuneiform_Lateral': 'cuneiform3',
      'ThirdCuneiform': 'cuneiform3',
      'thirdcuneiform': 'cuneiform3',
      'Cuneiform3_L': 'cuneiform3Left',
      'Cuneiform3_R': 'cuneiform3Right',
      'LateralCuneiform_L': 'cuneiform3Left',
      'LateralCuneiform_R': 'cuneiform3Right',
      'L_Cuneiform3': 'cuneiform3Left',
      'R_Cuneiform3': 'cuneiform3Right',
      
      'Cuneiform': 'cuneiform',
      'cuneiform': 'cuneiform',
      'CuneiformBone': 'cuneiform',
      'cuneiformbone': 'cuneiform',
      
      'Tarsal': 'tarsal',
      'tarsal': 'tarsal',
      'TarsalBone': 'tarsal',
      'tarsalbone': 'tarsal',
      'Tarsus': 'tarsal',
      'tarsus': 'tarsal',
      'Ankle': 'tarsal',
      'ankle': 'tarsal',
      'AnkleBone': 'tarsal',
      'anklebone': 'tarsal',
      
      // ========== กระดูกฝ่าเท้า (Metatarsals) - 10 ชิ้น ==========
      'Metatarsal1': 'metatarsal1',
      'metatarsal1': 'metatarsal1',
      'FirstMetatarsal': 'metatarsal1',
      'firstmetatarsal': 'metatarsal1',
      'Metatarsal_1': 'metatarsal1',
      'Metatarsal1_L': 'metatarsal1Left',
      'Metatarsal1_R': 'metatarsal1Right',
      'Metatarsal1Left': 'metatarsal1Left',
      'Metatarsal1Right': 'metatarsal1Right',
      'LeftMetatarsal1': 'metatarsal1Left',
      'RightMetatarsal1': 'metatarsal1Right',
      'L_Metatarsal1': 'metatarsal1Left',
      'R_Metatarsal1': 'metatarsal1Right',
      
      'Metatarsal2': 'metatarsal2',
      'metatarsal2': 'metatarsal2',
      'SecondMetatarsal': 'metatarsal2',
      'secondmetatarsal': 'metatarsal2',
      'Metatarsal_2': 'metatarsal2',
      'Metatarsal2_L': 'metatarsal2Left',
      'Metatarsal2_R': 'metatarsal2Right',
      'Metatarsal2Left': 'metatarsal2Left',
      'Metatarsal2Right': 'metatarsal2Right',
      'LeftMetatarsal2': 'metatarsal2Left',
      'RightMetatarsal2': 'metatarsal2Right',
      'L_Metatarsal2': 'metatarsal2Left',
      'R_Metatarsal2': 'metatarsal2Right',
      
      'Metatarsal3': 'metatarsal3',
      'metatarsal3': 'metatarsal3',
      'ThirdMetatarsal': 'metatarsal3',
      'thirdmetatarsal': 'metatarsal3',
      'Metatarsal_3': 'metatarsal3',
      'Metatarsal3_L': 'metatarsal3Left',
      'Metatarsal3_R': 'metatarsal3Right',
      'Metatarsal3Left': 'metatarsal3Left',
      'Metatarsal3Right': 'metatarsal3Right',
      'LeftMetatarsal3': 'metatarsal3Left',
      'RightMetatarsal3': 'metatarsal3Right',
      'L_Metatarsal3': 'metatarsal3Left',
      'R_Metatarsal3': 'metatarsal3Right',
      
      'Metatarsal4': 'metatarsal4',
      'metatarsal4': 'metatarsal4',
      'FourthMetatarsal': 'metatarsal4',
      'fourthmetatarsal': 'metatarsal4',
      'Metatarsal_4': 'metatarsal4',
      'Metatarsal4_L': 'metatarsal4Left',
      'Metatarsal4_R': 'metatarsal4Right',
      'Metatarsal4Left': 'metatarsal4Left',
      'Metatarsal4Right': 'metatarsal4Right',
      'LeftMetatarsal4': 'metatarsal4Left',
      'RightMetatarsal4': 'metatarsal4Right',
      'L_Metatarsal4': 'metatarsal4Left',
      'R_Metatarsal4': 'metatarsal4Right',
      
      'Metatarsal5': 'metatarsal5',
      'metatarsal5': 'metatarsal5',
      'FifthMetatarsal': 'metatarsal5',
      'fifthmetatarsal': 'metatarsal5',
      'Metatarsal_5': 'metatarsal5',
      'Metatarsal5_L': 'metatarsal5Left',
      'Metatarsal5_R': 'metatarsal5Right',
      'Metatarsal5Left': 'metatarsal5Left',
      'Metatarsal5Right': 'metatarsal5Right',
      'LeftMetatarsal5': 'metatarsal5Left',
      'RightMetatarsal5': 'metatarsal5Right',
      'L_Metatarsal5': 'metatarsal5Left',
      'R_Metatarsal5': 'metatarsal5Right',
      
      'Metatarsal': 'metatarsal',
      'metatarsal': 'metatarsal',
      'MetatarsalBone': 'metatarsal',
      'metatarsalbone': 'metatarsal',
      
      // ========== กระดูกนิ้วเท้า (Phalanges - Foot) - 28 ชิ้น ==========
      'ProximalPhalanxFoot': 'proximalPhalanxFoot',
      'proximalphalanxfoot': 'proximalPhalanxFoot',
      'Proximal_Phalanx_Foot': 'proximalPhalanxFoot',
      'ProximalPhalanxToe': 'proximalPhalanxFoot',
      'proximalphalanxtoe': 'proximalPhalanxFoot',
      'PP_Foot': 'proximalPhalanxFoot',
      
      'MiddlePhalanxFoot': 'middlePhalanxFoot',
      'middlephalanxfoot': 'middlePhalanxFoot',
      'Middle_Phalanx_Foot': 'middlePhalanxFoot',
      'MiddlePhalanxToe': 'middlePhalanxFoot',
      'middlephalanxtoe': 'middlePhalanxFoot',
      'MP_Foot': 'middlePhalanxFoot',
      
      'DistalPhalanxFoot': 'distalPhalanxFoot',
      'distalphalanxfoot': 'distalPhalanxFoot',
      'Distal_Phalanx_Foot': 'distalPhalanxFoot',
      'DistalPhalanxToe': 'distalPhalanxFoot',
      'distalphalanxtoe': 'distalPhalanxFoot',
      'DP_Foot': 'distalPhalanxFoot',
      
      'ToePhalanx': 'toePhalanx',
      'toephalanx': 'toePhalanx',
      'Toe_Phalanx': 'toePhalanx',
      'PhalanxFoot': 'toePhalanx',
      'phalanxfoot': 'toePhalanx',
      'FootPhalanx': 'toePhalanx',
      'footphalanx': 'toePhalanx',
      
      'Toe': 'toe',
      'toe': 'toe',
      'ToeBone': 'toe',
      'toebone': 'toe',
      'Toes': 'toe',
      'toes': 'toe',
      
      // กระดูกเท้ารวม
      'Foot': 'foot',
      'foot': 'foot',
      'FootBone': 'foot',
      'footbone': 'foot',
      'Foot_L': 'footLeft',
      'Foot_R': 'footRight',
      'FootLeft': 'footLeft',
      'FootRight': 'footRight',
      'LeftFoot': 'footLeft',
      'RightFoot': 'footRight',
    }

    // ตรวจสอบแบบ exact match กับชื่อที่ clean แล้ว
    if (partMapping[cleanName]) {
      return partMapping[cleanName]
    }

    // ตรวจสอบแบบ case-insensitive
    const lowerCleanName = cleanName.toLowerCase()
    for (const [key, value] of Object.entries(partMapping)) {
      if (key.toLowerCase() === lowerCleanName) {
        return value
      }
    }

    // ตรวจสอบแบบ partial match
    for (const [key, value] of Object.entries(partMapping)) {
      if (lowerCleanName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCleanName)) {
        return value
      }
    }

    // ไม่พบ mapping
    console.warn('⚠️ ไม่พบ mapping สำหรับ:', objectName, '| cleaned:', cleanName)
    return null
  }

  // Handle click บนโมเดล
  const handleClick = (e) => {
    e.stopPropagation()
    
    // ลอง object ที่ถูก intersect
    if (!e.object || !e.object.name) {
      console.log('ไม่สามารถระบุ object ที่คลิก')
      return
    }
    
    const objectName = e.object.name
    console.log('คลิก:', objectName)
    
    const partId = getPartIdFromObjectName(objectName)
    if (partId) {
      console.log('แสดงคำอธิบายของ:', partId)
      onClick(partId)
    } else {
      console.log('ไม่พบ mapping สำหรับ:', objectName, '- ลองคลิกที่ส่วนอื่น')
    }
  }

  // Handle hover
  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    
    if (!e.object || !e.object.name) return
    
    const objectName = e.object.name
    setHoveredPart(objectName)
    
    const partId = getPartIdFromObjectName(objectName)
    if (partId) {
      console.log('Hover:', partId)
      onHover(partId)
    }
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
    setHoveredPart(null)
    onHover(null)
  }

  // ปรับ scale และ position ให้เหมาะสม
  // เพิ่ม scale เพื่อให้โมเดลแสดงใหญ่ขึ้นและพอดีกับหน้าจอ
  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={3.0}
      position={[0, -1.2, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}

export default GLTFHumanModel

// Preload โมเดลเพื่อประสิทธิภาพที่ดีขึ้น
useGLTF.preload('/models/human1.glb')
