import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, Interactive, useHitTest, useXR } from '@react-three/xr';
import { useToast } from '@/components/ui/use-toast';
import ArtworkModel from '@/components/ArtworkModel';
import ARPlaceholder from '@/components/ARPlaceholder';
import { useARSupport } from '@/contexts/ARSupportContext';
import { Button } from '@/components/ui/button';
import { CameraOff } from 'lucide-react';

const ARScene = ({ artwork, scale, rotation, isPlacementMode = true }) => {
  const { isARSupported, arSupportError } = useARSupport();
  const { toast } = useToast();
  const [isARSessionActive, setIsARSessionActive] = useState(false);
  const [placedArtworks, setPlacedArtworks] = useState([]);
  const [sessionError, setSessionError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    // Verificar permisos de cámara al montar el componente
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setIsCameraReady(true);
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        setSessionError('No se pudo acceder a la cámara. Por favor, asegúrate de dar permiso de acceso.');
        toast({
          title: "Error de cámara",
          description: "No se pudo acceder a la cámara. Verifica los permisos en la configuración de tu navegador.",
          variant: "destructive",
          duration: 7000,
        });
      }
    };

    checkCameraPermission();
  }, [toast]);

  const handleARSessionStarted = useCallback(() => {
    if (!isCameraReady) {
      setSessionError('La cámara no está lista. Por favor, verifica los permisos.');
      return;
    }
    setIsARSessionActive(true);
    setSessionError(null);
    toast({
      title: "Sesión AR iniciada",
      description: "Mueve tu dispositivo para detectar superficies. Toca para colocar la obra.",
    });
  }, [toast, isCameraReady]);

  const handleARSessionEnded = useCallback(() => {
    setIsARSessionActive(false);
    setPlacedArtworks([]);
  }, []);

  const handleSessionError = useCallback((error) => {
    console.error("AR Session Error:", error);
    setSessionError(error.message);
    toast({
      title: "Error en la sesión AR",
      description: `No se pudo iniciar la sesión AR: ${error.message}. Asegúrate de que los permisos de cámara estén habilitados.`,
      variant: "destructive",
      duration: 7000,
    });
    setIsARSessionActive(false);
  }, [toast]);

  const handlePlaceArtwork = (position) => {
    if (artwork) {
      setPlacedArtworks(prev => [
        ...prev,
        {
          id: `${artwork.id}-${Date.now()}`,
          artwork,
          position,
          scale: [scale, scale, scale],
          rotationY: rotation * (Math.PI / 180) 
        }
      ]);
      
      toast({
        title: "Obra colocada",
        description: `"${artwork.title}" ha sido colocada en el espacio.`,
      });
    }
  };

  const ARPlacement = () => {
    const [reticlePosition, setReticlePosition] = useState([0, 0, 0]);
    const [isReticleVisible, setIsReticleVisible] = useState(false);
    const { isPresenting } = useXR();

    useEffect(() => {
      if (!isPresenting) {
        setIsReticleVisible(false);
      }
    }, [isPresenting]);
    
    useHitTest((hitMatrix, hit) => {
      if (isPlacementMode && isPresenting) {
        hitMatrix.decompose(
          hit.position,
          hit.rotation,
          hit.scale
        );
        setReticlePosition([hit.position.x, hit.position.y, hit.position.z]);
        setIsReticleVisible(true);
      } else {
        setIsReticleVisible(false);
      }
    });

    const handlePlacement = () => {
      if (isPlacementMode && isReticleVisible && isPresenting) {
        handlePlaceArtwork([...reticlePosition]);
      }
    };

    return (
      <>
        {isReticleVisible && isPlacementMode && isPresenting && (
          <Interactive onSelect={handlePlacement}>
            <mesh position={reticlePosition} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.1 * scale, 0.15 * scale, 32]} />
              <meshStandardMaterial color="#3498db" transparent opacity={0.8} />
            </mesh>
          </Interactive>
        )}
        
        {placedArtworks.map((placedArtwork) => (
          <ArtworkModel
            key={placedArtwork.id}
            artwork={placedArtwork.artwork}
            position={placedArtwork.position}
            scale={placedArtwork.scale}
            rotationY={placedArtwork.rotationY}
          />
        ))}
      </>
    );
  };

  if (!isARSupported) {
    return <ARPlaceholder artwork={artwork} error={arSupportError} />;
  }

  if (sessionError) {
    return (
      <div className="ar-scene flex flex-col items-center justify-center p-4 text-center">
        <CameraOff className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-destructive mb-2">Error de Sesión AR</h2>
        <p className="text-muted-foreground mb-4">{sessionError}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Asegúrate de que tu navegador tenga permisos para acceder a la cámara y que no haya otras aplicaciones usando la cámara.
        </p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="ar-scene">
      {isCameraReady ? (
        <>
          <ARButton
            sessionInit={{
              requiredFeatures: ['hit-test'],
              optionalFeatures: ['dom-overlay'],
              domOverlay: { root: document.body }
            }}
            onStart={handleARSessionStarted}
            onEnd={handleARSessionEnded}
            onError={handleSessionError}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-full font-semibold shadow-xl hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
          >
            {isARSessionActive ? "Salir de AR" : "Iniciar AR"}
          </ARButton>
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: true
            }}
            dpr={[1, 2]}
            camera={{ position: [0, 0, 0], near: 0.1, far: 1000 }}
          >
            <XR>
              <ambientLight intensity={1.2} />
              <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
              <Suspense fallback={null}>
                {isARSessionActive && <ARPlacement />}
              </Suspense>
            </XR>
          </Canvas>
        </>
      ) : (
        <div className="ar-scene flex flex-col items-center justify-center p-4 text-center">
          <CameraOff className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">Cámara no disponible</h2>
          <p className="text-muted-foreground mb-4">
            {sessionError || 'Esperando acceso a la cámara...'}
          </p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      )}
    </div>
  );
};

export default ARScene;