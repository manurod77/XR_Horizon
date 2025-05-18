import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CameraOff } from 'lucide-react';

const ARCoreScene = ({ artwork, scale, rotation }) => {
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let arCore = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let model = null;
    let arButton = null;

    const initializeAR = async () => {
      try {
        // Verificar soporte de ARCore
        if (!window.ARCore) {
          throw new Error('ARCore no está disponible en este dispositivo');
        }

        // Crear escena Three.js
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Configurar ARCore
        arCore = new window.ARCore({
          camera: camera,
          renderer: renderer,
          scene: scene,
          onError: (error) => {
            console.error('ARCore error:', error);
            setError(error.message);
          }
        });

        // Crear botón AR
        arButton = document.createElement('button');
        arButton.innerHTML = 'Iniciar AR';
        arButton.style.position = 'absolute';
        arButton.style.bottom = '20px';
        arButton.style.left = '50%';
        arButton.style.transform = 'translateX(-50%)';
        arButton.style.padding = '12px 24px';
        arButton.style.backgroundColor = '#4CAF50';
        arButton.style.color = 'white';
        arButton.style.border = 'none';
        arButton.style.borderRadius = '4px';
        arButton.style.cursor = 'pointer';
        containerRef.current.appendChild(arButton);

        arButton.addEventListener('click', async () => {
          try {
            // Solicitar permisos de cámara
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              } 
            });
            
            // Iniciar ARCore
            await arCore.start();
            
            // Ocultar botón
            arButton.style.display = 'none';
            
            toast({
              title: "AR iniciado",
              description: "Mueve tu dispositivo para detectar superficies. Toca para colocar la obra.",
            });
          } catch (error) {
            console.error('Error starting AR:', error);
            setError('Error al iniciar la cámara: ' + error.message);
            toast({
              title: "Error al iniciar AR",
              description: error.message,
              variant: "destructive",
            });
          }
        });

        // Cargar modelo 3D
        if (artwork && artwork.modelUrl) {
          const loader = new GLTFLoader();
          loader.load(
            artwork.modelUrl,
            (gltf) => {
              model = gltf.scene;
              model.scale.set(scale, scale, scale);
              model.rotation.y = rotation * (Math.PI / 180);
              scene.add(model);
            },
            undefined,
            (error) => {
              console.error('Error loading model:', error);
              setError('Error al cargar el modelo 3D');
            }
          );
        }

        // Configurar iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Manejar redimensionamiento
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Iniciar renderizado
        const animate = () => {
          requestAnimationFrame(animate);
          if (arCore && arCore.isRunning) {
            arCore.update();
          }
          renderer.render(scene, camera);
        };
        animate();

        setIsInitialized(true);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (renderer) {
            renderer.dispose();
          }
          if (arCore) {
            arCore.dispose();
          }
          if (arButton) {
            arButton.remove();
          }
        };
      } catch (error) {
        console.error('Error initializing AR:', error);
        setError(error.message);
        toast({
          title: "Error al inicializar AR",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    initializeAR();
  }, [artwork, scale, rotation, toast]);

  if (error) {
    return (
      <div className="ar-scene flex flex-col items-center justify-center p-4 text-center">
        <CameraOff className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-destructive mb-2">Error de AR</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <div className="space-y-4">
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Si el problema persiste:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Asegúrate de tener instalado Google Play Services for AR</li>
              <li>Verifica que tu dispositivo sea compatible con ARCore</li>
              <li>Intenta cerrar y volver a abrir el navegador</li>
              <li>Verifica que has dado permisos de cámara al navegador</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-scene" ref={containerRef}>
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
            <p>Inicializando AR...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARCoreScene; 