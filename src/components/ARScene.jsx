
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Interactive, useHitTest } from '@react-three/xr';
import { useToast } from '@/components/ui/use-toast';
import ArtworkModel from '@/components/ArtworkModel';
import ARPlaceholder from '@/components/ARPlaceholder';
import { useARSupport } from '@/contexts/ARSupportContext';

const ARScene = ({ artwork, isPlacementMode = true }) => {
  const { isARSupported } = useARSupport();
  const { toast } = useToast();
  const [isARSessionActive, setIsARSessionActive] = useState(false);
  const [placedArtworks, setPlacedArtworks] = useState([]);

  useEffect(() => {
    if (!isARSupported && isARSupported !== null) {
      toast({
        title: "AR no compatible",
        description: "Tu dispositivo no soporta WebXR para realidad aumentada. Se mostrará una vista previa en su lugar.",
        variant: "destructive",
      });
    }
  }, [isARSupported, toast]);

  const handleARSessionStarted = () => {
    setIsARSessionActive(true);
    toast({
      title: "Sesión AR iniciada",
      description: "Toca en la superficie donde quieras colocar la obra de arte.",
    });
  };

  const handleARSessionEnded = () => {
    setIsARSessionActive(false);
    setPlacedArtworks([]);
  };

  const handlePlaceArtwork = (position) => {
    if (artwork) {
      setPlacedArtworks(prev => [
        ...prev,
        {
          id: `${artwork.id}-${Date.now()}`,
          artwork,
          position
        }
      ]);
      
      toast({
        title: "Obra colocada",
        description: `"${artwork.title}" ha sido colocada en el espacio.`,
      });
    }
  };

  // Component to handle hit testing and placement
  const ARPlacement = () => {
    const [reticlePosition, setReticlePosition] = useState([0, 0, 0]);
    const [isReticleVisible, setIsReticleVisible] = useState(false);
    
    useHitTest((hitMatrix, hit) => {
      if (isPlacementMode) {
        hitMatrix.decompose(
          hit.position,
          hit.rotation,
          hit.scale
        );
        setReticlePosition([hit.position.x, hit.position.y, hit.position.z]);
        setIsReticleVisible(true);
      }
    });

    const handlePlacement = (event) => {
      if (isPlacementMode && isReticleVisible) {
        handlePlaceArtwork([...reticlePosition]);
      }
    };

    return (
      <>
        {isReticleVisible && isPlacementMode && (
          <Interactive onSelect={handlePlacement}>
            <mesh position={reticlePosition} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1, 0.15, 32]} />
              <meshStandardMaterial color="#3498db" transparent opacity={0.8} />
            </mesh>
          </Interactive>
        )}
        
        {placedArtworks.map((placedArtwork) => (
          <ArtworkModel
            key={placedArtwork.id}
            artwork={placedArtwork.artwork}
            position={placedArtwork.position}
          />
        ))}
      </>
    );
  };

  return (
    <div className="ar-scene">
      {isARSupported ? (
        <>
          <ARButton
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 bg-primary text-white rounded-full font-medium shadow-lg hover:bg-primary/90 transition-colors"
            onSessionStart={handleARSessionStarted}
            onSessionEnd={handleARSessionEnded}
          />
          <Canvas>
            <XR>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
              <Suspense fallback={null}>
                <ARPlacement />
              </Suspense>
            </XR>
          </Canvas>
        </>
      ) : (
        <ARPlaceholder artwork={artwork} />
      )}
    </div>
  );
};

export default ARScene;
