
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Filter, Heart } from 'lucide-react';
import Header from '@/components/Header';
import ArtworkCard from '@/components/ArtworkCard';
import { useArtworks } from '@/contexts/ArtworksContext';
import { useARSupport } from '@/contexts/ARSupportContext';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artworks, getFeaturedArtworks, getArtworksByType, getFavoriteArtworks } = useArtworks();
  const { isARSupported, isCheckingSupport } = useARSupport();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedArtworks, setDisplayedArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    
    if (typeParam) {
      setActiveFilter(typeParam);
    } else {
      setActiveFilter('all');
    }
  }, [location.search]);

  // Update displayed artworks based on filter
  useEffect(() => {
    let filtered = [];
    
    switch (activeFilter) {
      case 'featured':
        filtered = getFeaturedArtworks();
        break;
      case 'sculpture':
      case 'painting':
      case 'digital':
        filtered = getArtworksByType(activeFilter);
        break;
      case 'favorites':
        filtered = getFavoriteArtworks();
        break;
      default:
        filtered = [...artworks];
    }
    
    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(query) || 
        artwork.artist.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query)
      );
    }
    
    setDisplayedArtworks(filtered);
  }, [activeFilter, artworks, getFeaturedArtworks, getArtworksByType, getFavoriteArtworks, searchQuery]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    // Update URL query parameter
    if (filter === 'all') {
      navigate('/');
    } else {
      navigate(`/?type=${filter}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExploreAR = () => {
    navigate('/ar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background">
      <Header title="AR Art Gallery" />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.section 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Arte en Realidad Aumentada
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explora esculturas, pinturas y arte digital en tu espacio real a través de la realidad aumentada.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
              onClick={handleExploreAR}
              disabled={isCheckingSupport}
            >
              {isCheckingSupport ? (
                <span className="flex items-center">
                  <span className="loading-spinner h-4 w-4 mr-2"></span>
                  Verificando AR...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🔍</span>
                  Explorar en AR
                </span>
              )}
            </Button>
            
            {!isARSupported && !isCheckingSupport && (
              <p className="text-sm text-yellow-500 mt-2">
                Tu dispositivo no parece soportar AR. Algunas funciones pueden estar limitadas.
              </p>
            )}
          </div>
        </motion.section>
        
        {/* Search and Filter */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por título, artista o descripción..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('all')}
              >
                Todos
              </Button>
              <Button 
                variant={activeFilter === 'featured' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('featured')}
              >
                Destacados
              </Button>
              <Button 
                variant={activeFilter === 'sculpture' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('sculpture')}
              >
                <span className="mr-1">🗿</span> Esculturas
              </Button>
              <Button 
                variant={activeFilter === 'painting' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('painting')}
              >
                <span className="mr-1">🖼️</span> Pinturas
              </Button>
              <Button 
                variant={activeFilter === 'digital' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('digital')}
              >
                <span className="mr-1">💻</span> Digital
              </Button>
              <Button 
                variant={activeFilter === 'favorites' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('favorites')}
                className={activeFilter === 'favorites' ? 'bg-red-500 hover:bg-red-600 border-red-500' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${activeFilter === 'favorites' ? 'fill-current' : ''}`} /> Favoritos
              </Button>
            </div>
          </div>
        </motion.section>
        
        {/* Artworks Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {displayedArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArtworks.map((artwork, index) => (
                <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No se encontraron resultados</h3>
              <p className="text-muted-foreground mb-6">
                No hay obras de arte que coincidan con tu búsqueda o filtros actuales.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                handleFilterChange('all');
              }}>
                Mostrar todas las obras
              </Button>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default HomePage;
