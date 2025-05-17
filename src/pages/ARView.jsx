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
import { Loader2 } from 'lucide-react';

const ARView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { artworks, getArtworkById } = useArtworks();
  const { isARSupported, isCheckingSupport, arSupportError } = useARSupport();
  
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isArtworkSelectorOpen, setIsArtworkSelectorOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const artworkId = params.get('id');
    
    if (artworkId) {
      const artwork = getArtworkById(artworkId);
      if (artwork) {
        setSelectedArtwork(artwork);
        setIsLoading(false);
        if (isARSupported) {
          toast({
            title: "Obra seleccionada",
            description: `"${artwork.title}" está lista. Inicia AR para colocarla.`,
          });
        }
      } else {
        setError("La obra de arte solicitada no se pudo encontrar.");
        setIsLoading(false);
        toast({
          title: "Obra no encontrada",
          description: "La obra de arte solicitada no se pudo encontrar.",
          variant: "destructive"
        });
        navigate('/');
      }
    } else {
      setIsLoading(false);
    }
  }, [location.search, getArtworkById, toast, navigate, isARSupported]);

  const handleReset = () => {
    // This will be handled by ARScene's onSessionEnd or a specific reset function there
    // For now, we can clear the selected artwork to allow re-selection or re-placement
    // setSelectedArtwork(null); // This might be too aggressive, depends on desired UX
    // The ARScene itself should manage placed artworks.
    // We can trigger a reset within ARScene if needed.
    toast({
      title: "Escena reiniciada",
      description: "Se han eliminado las obras colocadas. Puedes volver a colocar la obra actual o seleccionar una nueva.",
    });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.2));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 45) % 360);
  };

  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setIsArtworkSelectorOpen(false);
    setScale(1); // Reset scale for new artwork
    setRotation(0); // Reset rotation for new artwork
    if (isARSupported) {
      toast({
        title: "Obra cambiada",
        description: `"${artwork.title}" está lista. Inicia AR o, si ya está activa, toca para colocarla.`,
      });
    }
  };

  const toggleArtworkSelector = () => {
    setIsArtworkSelectorOpen(!isArtworkSelectorOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header title="Explorar en AR" showBackButton={true} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Cargando experiencia AR...</h2>
          <p className="text-muted-foreground">Esto tomará un momento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header title="Explorar en AR" showBackButton={true} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <div className="text-destructive mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Explorar en AR" showBackButton={true} />
      
      <div className="flex-grow relative">
        <ARScene 
          artwork={selectedArtwork} 
          scale={scale} 
          rotation={rotation} 
        />
      </div>
      
      {isARSupported && (
        <ARControls 
          onReset={handleReset}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotate={handleRotate}
          artwork={selectedArtwork}
        />
      )}
      
      <motion.div 
        className="fixed left-4 bottom-24 md:bottom-20 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          onClick={toggleArtworkSelector}
          className="glassmorphism border-primary/30 hover:border-primary/50 shadow-lg"
          size="lg"
        >
          {selectedArtwork ? 'Cambiar Obra' : 'Seleccionar Obra'}
        </Button>
      </motion.div>
      
      <motion.div 
        className={`fixed inset-0 z-30 ${isArtworkSelectorOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isArtworkSelectorOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleArtworkSelector}></div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-background border-t border-primary/20 rounded-t-xl p-4 max-h-[70vh] overflow-y-auto"
          initial={{ y: '100%' }}
          animate={{ y: isArtworkSelectorOpen ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <h2 className="text-xl font-bold">Seleccionar Obra de Arte</h2>
            <Button variant="ghost" size="sm" onClick={toggleArtworkSelector}>Cerrar</Button>
          </div>
          
          {artworks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {artworks.map((art) => (
                <div 
                  key={art.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedArtwork?.id === art.id ? 'bg-primary/30 border-2 border-primary ring-2 ring-primary/50' : 'bg-black/40 border border-white/10 hover:bg-black/60 hover:border-primary/30'}`}
                  onClick={() => handleSelectArtwork(art)}
                >
                  <div className="aspect-square rounded flex items-center justify-center mb-2 bg-gradient-to-br from-primary/10 to-secondary/10">
                    {art.type === 'sculpture' && <span className="text-4xl">🗿</span>}
                    {art.type === 'painting' && <span className="text-4xl">🖼️</span>}
                    {art.type === 'digital' && <span className="text-4xl">💻</span>}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{art.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{art.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No hay obras de arte disponibles.</p>
          )}
        </motion.div>
      </motion.div>
      
      {arSupportError && !isARSupported && (
        <motion.div 
          className="fixed top-16 left-0 right-0 mx-auto max-w-md z-20 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="glassmorphism border-yellow-500/30 p-4 rounded-lg">
            <h3 className="text-yellow-500 font-medium mb-1">Modo de Vista Previa Activo</h3>
            <p className="text-sm text-muted-foreground">
              {arSupportError}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ARView;