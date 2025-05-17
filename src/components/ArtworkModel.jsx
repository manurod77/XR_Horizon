import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const ArtworkModel = ({ artwork, position = [0, 0, -2], scale = [1, 1, 1], rotationY = 0 }) => {
  const modelRef = useRef();
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (!modelRef.current || !groupRef.current) return;
    
    groupRef.current.rotation.y = rotationY;

    if (artwork.animation === 'rotate') {
      modelRef.current.rotation.y += delta * 0.5;
    } else if (artwork.animation === 'flow') {
      modelRef.current.rotation.y += delta * 0.2;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 * scale[1];
    }
  });

  const renderModel = () => {
    const { modelType, modelColor } = artwork;
    const effectiveScale = artwork.modelScale || [1,1,1];
    
    switch (modelType) {
      case 'cube':
        return (
          <mesh ref={modelRef} castShadow scale={effectiveScale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={modelColor} />
          </mesh>
        );
      
      case 'sphere':
        return (
          <mesh ref={modelRef} castShadow scale={effectiveScale}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={modelColor} />
          </mesh>
        );
      
      case 'plane':
        return (
          <mesh ref={modelRef} castShadow scale={effectiveScale}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color={modelColor} 
              side={2}
            />
          </mesh>
        );
      
      case 'particles':
        return (
          <group ref={modelRef} scale={effectiveScale}>
            {Array.from({ length: 50 }).map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  (Math.random() - 0.5),
                  (Math.random() - 0.5),
                  (Math.random() - 0.5)
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
        return (
          <group ref={modelRef} scale={effectiveScale}>
            <mesh castShadow position={[0, 0, 0]}>
              <torusKnotGeometry args={[0.3, 0.1, 64, 16]} />
              <meshStandardMaterial color={modelColor} />
            </mesh>
          </group>
        );
      
      default:
        return (
          <mesh ref={modelRef} castShadow scale={effectiveScale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={modelColor || "#ffffff"} />
          </mesh>
        );
    }
  };

  const textYOffset = (artwork.modelScale ? artwork.modelScale[1] * 0.5 : 0.5) + 0.15;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {renderModel()}
      
      <Text
        position={[0, -textYOffset, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {artwork.title}
      </Text>
      
      <Text
        position={[0, -textYOffset - 0.12, 0]}
        fontSize={0.06}
        color="#cccccc"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {artwork.artist}
      </Text>
    </group>
  );
};

export default ArtworkModel;