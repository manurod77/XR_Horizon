import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ARSupportContext = createContext(null);

export function ARSupportProvider({ children }) {
  const [isARSupported, setIsARSupported] = useState(null);
  const [isCheckingSupport, setIsCheckingSupport] = useState(true);
  const [arSupportError, setArSupportError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const { toast } = useToast();

  const checkCameraPermission = async () => {
    try {
      // Primero verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta acceso a la cámara");
      }

      // Intentar obtener acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Detener el stream después de verificar
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      return true;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setCameraPermission('denied');
      
      if (error.name === 'NotAllowedError') {
        throw new Error("Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.");
      } else if (error.name === 'NotFoundError') {
        throw new Error("No se encontró ninguna cámara en tu dispositivo.");
      } else if (error.name === 'NotReadableError') {
        throw new Error("La cámara está siendo usada por otra aplicación.");
      } else {
        throw new Error("Error al acceder a la cámara: " + error.message);
      }
    }
  };

  useEffect(() => {
    async function checkARSupport() {
      setIsCheckingSupport(true);
      setArSupportError(null);
      
      try {
        // Verificar permisos de cámara primero
        await checkCameraPermission();

        // Verificar soporte WebXR
        if (!navigator.xr) {
          throw new Error("WebXR no está disponible en este navegador");
        }

        // Verificar soporte AR
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);

        if (!isSupported) {
          throw new Error("AR no es compatible con este dispositivo/navegador");
        }

        // Verificar sensores de movimiento
        if (!window.DeviceMotionEvent && !window.DeviceOrientationEvent) {
          throw new Error("Tu dispositivo no tiene los sensores necesarios para AR");
        }

      } catch (error) {
        console.error("Error checking AR support:", error);
        setIsARSupported(false);
        setArSupportError(error.message);
        
        let errorMessage = "Error al verificar el soporte AR: ";
        let errorTitle = "AR no disponible";
        
        if (error.message.includes("WebXR")) {
          errorMessage = "WebXR no está disponible en este navegador. Intenta con Chrome o Safari en un dispositivo móvil compatible.";
        } else if (error.message.includes("cámara")) {
          errorTitle = "Error de cámara";
          errorMessage = error.message;
        } else if (error.message.includes("sensores")) {
          errorMessage = "Tu dispositivo no tiene los sensores necesarios para AR (giroscopio y acelerómetro).";
        } else {
          errorMessage = "AR no es compatible con este dispositivo/navegador. Algunas funciones pueden no estar disponibles.";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          duration: 7000,
        });
      } finally {
        setIsCheckingSupport(false);
      }
    }

    checkARSupport();
  }, [toast]);

  const requestCameraPermission = async () => {
    try {
      await checkCameraPermission();
      return true;
    } catch (error) {
      setArSupportError(error.message);
      return false;
    }
  };

  return (
    <ARSupportContext.Provider value={{ 
      isARSupported, 
      isCheckingSupport, 
      arSupportError,
      cameraPermission,
      requestCameraPermission 
    }}>
      {children}
    </ARSupportContext.Provider>
  );
}

export function useARSupport() {
  const context = useContext(ARSupportContext);
  if (context === null) {
    throw new Error('useARSupport must be used within an ARSupportProvider');
  }
  return context;
}