
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const ArtworkModel = ({ artwork, position = [0, 0, -2] }) => {
  const modelRef = useRef();
  
  // Apply animations if specified in the artwork
  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    if (artwork.animation === 'rotate') {
      modelRef.current.rotation.y += delta * 0.5;
    } else if (artwork.animation === 'flow') {
      modelRef.current.rotation.y += delta * 0.2;
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Render different 3D models based on artwork type
  const renderModel = () => {
    const { modelType, modelScale, modelColor } = artwork;
    
    switch (modelType) {
      case 'cube':
        return (
          <mesh ref={modelRef} castShadow>
            <boxGeometry args={modelScale} />
            <meshStandardMaterial color={modelColor} />
          </mesh>
        );
      
      case 'sphere':
        return (
          <mesh ref={modelRef} castShadow>
            <sphereGeometry args={[modelScale[0], 32, 32]} />
            <meshStandardMaterial color={modelColor} />
          </mesh>
        );
      
      case 'plane':
        return (
          <mesh ref={modelRef} castShadow>
            <planeGeometry args={[modelScale[0], modelScale[1]]} />
            <meshStandardMaterial 
              color={modelColor} 
              side={2} // Double-sided
            />
          </mesh>
        );
      
      case 'particles':
        return (
          <group ref={modelRef}>
            {Array.from({ length: 50 }).map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  (Math.random() - 0.5) * modelScale[0],
                  (Math.random() - 0.5) * modelScale[1],
                  (Math.random() - 0.5) * modelScale[2]
                ]}
              >
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial 
                  color={modelColor} 
                  emissive={modelColor}
                  emissiveIntensity={2}
                />
              </mesh>
            ))}
          </group>
        );
      
      case 'custom':
        // For custom models, we'd normally load a 3D model file
        // For this example, we'll use a simple geometry
        return (
          <group ref={modelRef}>
            <mesh castShadow position={[0, 0, 0]}>
              <torusKnotGeometry args={[0.3, 0.1, 64, 16]} />
              <meshStandardMaterial color={modelColor} />
            </mesh>
          </group>
        );
      
      default:
        return (
          <mesh ref={modelRef} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={modelColor || "#ffffff"} />
          </mesh>
        );
    }
  };

  return (
    <group position={position}>
      {renderModel()}
      
      {/* Artwork label */}
      <Text
        position={[0, modelRef.current ? -0.6 : -0.6, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {artwork.title}
      </Text>
      
      <Text
        position={[0, modelRef.current ? -0.75 : -0.75, 0]}
        fontSize={0.06}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {artwork.artist}
      </Text>
    </group>
  );
};

export default ArtworkModel;
