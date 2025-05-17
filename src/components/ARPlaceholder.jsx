
import React from 'react';
import { motion } from 'framer-motion';
import { Box as Cube, Image, Cpu } from 'lucide-react';

const ARPlaceholder = ({ artwork }) => {
  const getArtworkIcon = () => {
    if (!artwork) return <Cube className="h-16 w-16 text-primary" />;
    
    switch (artwork.type) {
      case 'sculpture':
        return <Cube className="h-16 w-16 text-primary" />;
      case 'painting':
        return <Image className="h-16 w-16 text-primary" />;
      case 'digital':
        return <Cpu className="h-16 w-16 text-primary" />;
      default:
        return <Cube className="h-16 w-16 text-primary" />;
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black/70 to-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div 
          className="mx-auto mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {getArtworkIcon()}
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-4">
          {artwork 
            ? `Vista previa: ${artwork.title}` 
            : "Experiencia AR no disponible"}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {artwork 
            ? `Esta es una vista previa de "${artwork.title}" por ${artwork.artist}. Para ver esta obra en realidad aumentada, necesitas un dispositivo compatible con WebXR.` 
            : "La realidad aumentada no está disponible en tu dispositivo. Para disfrutar de la experiencia completa, intenta acceder desde un dispositivo móvil compatible con AR."}
        </p>
        
        <div className="glassmorphism p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Dispositivos recomendados:</h3>
          <ul className="text-sm text-muted-foreground text-left list-disc pl-5">
            <li>iPhone o iPad con iOS 12 o superior (Safari)</li>
            <li>Dispositivos Android con ARCore (Chrome)</li>
            <li>Navegadores compatibles con WebXR</li>
          </ul>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="w-full h-full bg-gradient-to-t from-primary/20 to-transparent" />
      </motion.div>
    </div>
  );
};

export default ARPlaceholder;
