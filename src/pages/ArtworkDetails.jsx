
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Calendar, User, Tag, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { useArtworks } from '@/contexts/ArtworksContext';

const ArtworkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getArtworkById, favorites, toggleFavorite } = useArtworks();
  
  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch artwork details
    const fetchedArtwork = getArtworkById(id);
    
    if (fetchedArtwork) {
      setArtwork(fetchedArtwork);
    } else {
      toast({
        title: "Obra no encontrada",
        description: "La obra de arte que buscas no existe o ha sido eliminada.",
        variant: "destructive",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  }, [id, getArtworkById, navigate, toast]);
  
  const handleViewInAR = () => {
    navigate(`/ar?id=${artwork.id}`);
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(artwork.id);
    
    toast({
      title: favorites.includes(artwork.id) 
        ? "Eliminado de favoritos" 
        : "Añadido a favoritos",
      description: favorites.includes(artwork.id)
        ? `"${artwork.title}" ha sido eliminado de tus favoritos.`
        : `"${artwork.title}" ha sido añadido a tus favoritos.`,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Mira "${artwork.title}" por ${artwork.artist} en AR Art Gallery`,
        url: window.location.href,
      })
        .then(() => {
          toast({
            title: "Compartido con éxito",
            description: "Gracias por compartir esta obra de arte.",
          });
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          toast({
            title: "Error al compartir",
            description: "No se pudo compartir la obra de arte.",
            variant: "destructive",
          });
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Cargando..." showBackButton={true} />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  if (!artwork) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Obra no encontrada" showBackButton={true} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Obra no encontrada</h2>
          <p className="text-muted-foreground mb-6">
            La obra de arte que buscas no existe o ha sido eliminada.
          </p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }
  
  const isFavorite = favorites.includes(artwork.id);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background">
      <Header title={artwork.title} showBackButton={true} />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Artwork Preview */}
          <div className="mb-6 aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {artwork.type === 'sculpture' && <span className="text-9xl">🗿</span>}
            {artwork.type === 'painting' && <span className="text-9xl">🖼️</span>}
            {artwork.type === 'digital' && <span className="text-9xl">💻</span>}
          </div>
          
          {/* Artwork Info */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{artwork.title}</h1>
                <p className="text-xl text-muted-foreground">{artwork.artist}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isFavorite ? 'bg-red-500/20 border-red-500/50 text-red-500' : ''}`}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="glassmorphism rounded-lg p-6 mb-6">
              <p className="mb-6">{artwork.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="h-4 w-4" /> Año
                  </span>
                  <span className="font-medium">{artwork.year}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-4 w-4" /> Artista
                  </span>
                  <span className="font-medium">{artwork.artist}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <Tag className="h-4 w-4" /> Tipo
                  </span>
                  <span className="font-medium capitalize">{artwork.type}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <Eye className="h-4 w-4" /> Destacado
                  </span>
                  <span className="font-medium">{artwork.featured ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
            
            {/* AR View Button */}
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
              onClick={handleViewInAR}
            >
              <span className="mr-2">🔍</span>
              Ver en Realidad Aumentada
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sobre esta obra</h2>
            
            <div className="glassmorphism rounded-lg p-6">
              <p className="mb-4">
                Esta {artwork.type === 'sculpture' ? 'escultura' : artwork.type === 'painting' ? 'pintura' : 'obra digital'} fue creada por {artwork.artist} en {artwork.year}. 
                {artwork.type === 'sculpture' && ' La escultura explora formas tridimensionales y texturas que puedes apreciar desde diferentes ángulos en realidad aumentada.'}
                {artwork.type === 'painting' && ' La pintura utiliza técnicas que cobran vida cuando la observas en tu espacio real a través de la realidad aumentada.'}
                {artwork.type === 'digital' && ' Esta obra digital aprovecha las posibilidades de la realidad aumentada para crear una experiencia inmersiva e interactiva.'}
              </p>
              
              <p>
                Para disfrutar de la experiencia completa, utiliza el botón "Ver en Realidad Aumentada" y coloca la obra en tu espacio real.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ArtworkDetails;
