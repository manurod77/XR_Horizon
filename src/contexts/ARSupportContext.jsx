
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ARSupportContext = createContext(null);

export function ARSupportProvider({ children }) {
  const [isARSupported, setIsARSupported] = useState(null);
  const [isCheckingSupport, setIsCheckingSupport] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function checkARSupport() {
      try {
        // Check if WebXR is available
        if ('xr' in navigator) {
          // Check if AR is supported
          const isSupported = await navigator.xr?.isSessionSupported('immersive-ar');
          setIsARSupported(isSupported);
          
          if (!isSupported) {
            toast({
              title: "AR no compatible",
              description: "Tu dispositivo no parece soportar WebXR para realidad aumentada. Algunas funciones pueden no estar disponibles.",
              variant: "destructive",
              duration: 5000,
            });
          }
        } else {
          setIsARSupported(false);
          toast({
            title: "WebXR no disponible",
            description: "Tu navegador no soporta WebXR. Intenta con Chrome o Safari en un dispositivo móvil compatible.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error checking AR support:", error);
        setIsARSupported(false);
        toast({
          title: "Error al verificar soporte AR",
          description: "No se pudo determinar si tu dispositivo soporta AR. Algunas funciones pueden no estar disponibles.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsCheckingSupport(false);
      }
    }

    checkARSupport();
  }, [toast]);

  return (
    <ARSupportContext.Provider value={{ isARSupported, isCheckingSupport }}>
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
