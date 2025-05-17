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
        if (!navigator.xr) {
          setIsARSupported(false);
          setArSupportError("WebXR no está disponible en este navegador. Intenta con Chrome o Safari en un dispositivo móvil compatible.");
          toast({
            title: "WebXR no disponible",
            description: "Tu navegador no soporta WebXR. Intenta con Chrome o Safari en un dispositivo móvil compatible.",
            variant: "destructive",
            duration: 7000,
          });
          return;
        }

        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);

        if (!isSupported) {
          setArSupportError("AR no es compatible con este dispositivo/navegador. Algunas funciones pueden no estar disponibles.");
          toast({
            title: "AR no compatible",
            description: "Tu dispositivo no parece soportar WebXR para realidad aumentada. Algunas funciones pueden no estar disponibles.",
            variant: "destructive",
            duration: 7000,
          });
        }
      } catch (error) {
        console.error("Error checking AR support:", error);
        setIsARSupported(false);
        setArSupportError("Error al verificar el soporte AR. Por favor, asegúrate de que tu navegador tenga permisos para acceder a la cámara y sensores de movimiento.");
        toast({
          title: "Error al verificar soporte AR",
          description: "No se pudo determinar si tu dispositivo soporta AR. Asegúrate de que los permisos de cámara estén habilitados.",
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