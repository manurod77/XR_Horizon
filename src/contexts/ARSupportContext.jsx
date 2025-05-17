import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ARSupportContext = createContext(null);

export function ARSupportProvider({ children }) {
  const [isARSupported, setIsARSupported] = useState(null);
  const [isCheckingSupport, setIsCheckingSupport] = useState(true);
  const [arSupportError, setArSupportError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    async function checkARSupport() {
      setIsCheckingSupport(true);
      setArSupportError(null);
      
      try {
        // Primero verificar si el navegador soporta WebXR
        if (!navigator.xr) {
          throw new Error("WebXR no está disponible en este navegador");
        }

        // Verificar permisos de cámara
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          throw new Error("No se pudo acceder a la cámara. Verifica los permisos.");
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
        if (error.message.includes("WebXR")) {
          errorMessage = "WebXR no está disponible en este navegador. Intenta con Chrome o Safari en un dispositivo móvil compatible.";
        } else if (error.message.includes("cámara")) {
          errorMessage = "No se pudo acceder a la cámara. Por favor, verifica los permisos en la configuración de tu navegador.";
        } else if (error.message.includes("sensores")) {
          errorMessage = "Tu dispositivo no tiene los sensores necesarios para AR (giroscopio y acelerómetro).";
        } else {
          errorMessage = "AR no es compatible con este dispositivo/navegador. Algunas funciones pueden no estar disponibles.";
        }

        toast({
          title: "AR no disponible",
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

  return (
    <ARSupportContext.Provider value={{ isARSupported, isCheckingSupport, arSupportError }}>
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