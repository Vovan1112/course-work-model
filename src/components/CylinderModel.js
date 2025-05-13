import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CylinderModel({ radius, length, temperature }) {
  const meshRef = useRef();

  // Создаем геометрию цилиндра с большим количеством сегментов для лучшей визуализации
  const geometry = useMemo(() => {
    const radialSegments = 32;
    const heightSegments = 16;
    return new THREE.CylinderGeometry(
      radius, 
      radius, 
      length, 
      radialSegments, 
      heightSegments, 
      false
    );
  }, [radius, length]);

  // Создаем материал с градиентом температуры
  const material = useMemo(() => {
    const normalizedTemp = (temperature - 0) / (100 - 0);
    
    // Создаем градиент от центра к краям
    const baseColor = new THREE.Color().setHSL(
      (1 - normalizedTemp) * 0.6, // оттенок
      0.8, // насыщенность
      0.5 + normalizedTemp * 0.2 // яркость
    );

    return new THREE.MeshPhongMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      shininess: 50,
      emissive: baseColor,
      emissiveIntensity: 0.2,
      flatShading: false,
    });
  }, [temperature]);

  // Анимация вращения
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Основной цилиндр */}
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Добавляем подсветку для лучшей визуализации температуры */}
      <pointLight
        position={[0, 0, 0]}
        intensity={temperature / 100}
        color={material.color}
        distance={radius * 2}
      />
    </group>
  );
}

export default CylinderModel; 