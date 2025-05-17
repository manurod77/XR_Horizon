
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ARScene from '@/components/ARScene';
import ARControls from '@/components/ARControls';
import { useArtworks } from '@/contexts/ArtworksContext';
import { useARSupport } from '@/contexts/ARSupportContext';

const ARView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { artworks, getArtworkById } = useArtworks();
  const { isARSupported, isCheckingSupport } = useARSupport();
  
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isArtworkSelectorOpen, setIsArtworkSelectorOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Check for artwork ID in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const artworkId = params.get('id');
    
    if (artworkId) {
      const artwork = getArtworkById(artworkId);
      if (artwork) {
        setSelectedArtwork(artwork);
        toast({
          title: "Obra seleccionada",
          description: `"${artwork.title}" está lista para ser colocada en AR.`,
        });
      }
    }
  }, [location.search, getArtworkById, toast]);

  const handleReset = () => {
    // Reset the scene
    setSelectedArtwork(null);
    setScale(1);
    setRotation(0);
    toast({
      title: "Escena reiniciada",
      description: "Se han eliminado todas las obras colocadas.",
    });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 45);
  };

  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsArtworkSelectorOpen(false);
    toast({
      title: "Obra seleccionada",
      description: `"${artwork.title}" está lista para ser colocada en AR.`,
    });
  };

  const toggleArtworkSelector = () => {
    setIsArtworkSelectorOpen(!isArtworkSelectorOpen);
  };

  return (
    <div className="min-h-screen">
      <Header title="Explorar en AR" showBackButton={true} />
      
      {/* AR Scene */}
      <ARScene artwork={selectedArtwork} scale={scale} rotation={rotation} />
      
      {/* AR Controls */}
      <ARControls 
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        artwork={selectedArtwork}
      />
      
      {/* Artwork Selection Button */}
      <motion.div 
        className="fixed left-4 bottom-20 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          onClick={toggleArtworkSelector}
          className="glassmorphism border-primary/30 hover:border-primary/50"
        >
          {selectedArtwork ? 'Cambiar obra' : 'Seleccionar obra'}
        </Button>
      </motion.div>
      
      {/* Artwork Selector Panel */}
      <motion.div 
        className={`fixed inset-0 z-30 ${isArtworkSelectorOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isArtworkSelectorOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleArtworkSelector}></div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-background border-t border-primary/20 rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
          initial={{ y: '100%' }}
          animate={{ y: isArtworkSelectorOpen ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Seleccionar obra de arte</h2>
            <Button variant="ghost" size="sm" onClick={toggleArtworkSelector}>Cerrar</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.map((artwork) => (
              <div 
                key={artwork.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedArtwork?.id === artwork.id ? 'bg-primary/20 border border-primary' : 'bg-black/40 border border-white/10 hover:bg-black/60'}`}
                onClick={() => handleSelectArtwork(artwork)}
              >
                <div className="aspect-square rounded flex items-center justify-center mb-2 bg-gradient-to-br from-primary/10 to-secondary/10">
                  {artwork.type === 'sculpture' && <span className="text-4xl">🗿</span>}
                  {artwork.type === 'painting' && <span className="text-4xl">🖼️</span>}
                  {artwork.type === 'digital' && <span className="text-4xl">💻</span>}
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{artwork.title}</h3>
                <p className="text-xs text-muted-foreground">{artwork.artist}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* AR Support Warning */}
      {!isARSupported && !isCheckingSupport && (
        <motion.div 
          className="fixed top-16 left-0 right-0 mx-auto max-w-md z-20 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="glassmorphism border-yellow-500/30 p-4 rounded-lg">
            <h3 className="text-yellow-500 font-medium mb-1">Modo de vista previa</h3>
            <p className="text-sm text-muted-foreground">
              Tu dispositivo no soporta WebXR para realidad aumentada. Estás viendo una simulación.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ARView;
