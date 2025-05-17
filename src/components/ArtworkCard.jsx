
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useArtworks } from '@/contexts/ArtworksContext';
import { cn } from '@/lib/utils';

const ArtworkCard = ({ artwork, index }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useArtworks();
  const isFavorite = favorites.includes(artwork.id);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sculpture':
        return '🗿';
      case 'painting':
        return '🖼️';
      case 'digital':
        return '💻';
      default:
        return '🎨';
    }
  };

  const handleCardClick = () => {
    navigate(`/artwork/${artwork.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(artwork.id);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer overflow-hidden border-primary/10 bg-black/40 backdrop-blur-sm transition-all"
        onClick={handleCardClick}
      >
        <CardHeader className="relative p-4">
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full bg-black/20 backdrop-blur-sm transition-colors",
                isFavorite ? "text-red-500 hover:text-red-600" : "text-white/70 hover:text-white"
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
            </Button>
          </div>
          <div className="flex items-center justify-center h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md overflow-hidden">
            <span className="text-6xl">{getTypeIcon(artwork.type)}</span>
          </div>
          <CardTitle className="mt-4 text-xl">{artwork.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{artwork.artist}, {artwork.year}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{artwork.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/20 text-primary-foreground">
            {artwork.type.charAt(0).toUpperCase() + artwork.type.slice(1)}
          </span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver detalles
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArtworkCard;
