
import React, { createContext, useContext, useState } from 'react';

// Sample artwork data
const initialArtworks = [
  {
    id: '1',
    title: 'Escultura Moderna',
    artist: 'Carlos Rodríguez',
    type: 'sculpture',
    description: 'Una escultura contemporánea que explora formas geométricas y espacios negativos.',
    year: 2022,
    modelType: 'cube',
    modelScale: [1, 1, 1],
    modelColor: '#3498db',
    position: [0, 0, -2],
    featured: true
  },
  {
    id: '2',
    title: 'Abstracción en Azul',
    artist: 'María González',
    type: 'painting',
    description: 'Pintura abstracta que utiliza tonos de azul para evocar sensaciones de calma y profundidad.',
    year: 2021,
    modelType: 'plane',
    modelScale: [1.5, 1.5, 0.01],
    modelColor: '#ffffff',
    textureType: 'abstract',
    position: [0, 0, -1.5],
    featured: true
  },
  {
    id: '3',
    title: 'Nebulosa Digital',
    artist: 'Alex Torres',
    type: 'digital',
    description: 'Arte digital que representa una nebulosa espacial con colores vibrantes y formas orgánicas.',
    year: 2023,
    modelType: 'sphere',
    modelScale: [0.8, 0.8, 0.8],
    modelColor: '#9b59b6',
    animation: 'rotate',
    position: [0, 0, -1.8],
    featured: false
  },
  {
    id: '4',
    title: 'Estructura Imposible',
    artist: 'Javier Méndez',
    type: 'sculpture',
    description: 'Escultura que desafía la percepción con formas que parecen violar las leyes de la física.',
    year: 2020,
    modelType: 'custom',
    modelScale: [1, 1, 1],
    modelColor: '#e74c3c',
    position: [0, 0, -2.2],
    featured: false
  },
  {
    id: '5',
    title: 'Paisaje Onírico',
    artist: 'Laura Sánchez',
    type: 'painting',
    description: 'Un paisaje surrealista que mezcla elementos naturales con visiones oníricas.',
    year: 2019,
    modelType: 'plane',
    modelScale: [1.8, 1.2, 0.01],
    modelColor: '#ffffff',
    textureType: 'landscape',
    position: [0, 0, -1.7],
    featured: true
  },
  {
    id: '6',
    title: 'Flujo de Datos',
    artist: 'Daniel Ortiz',
    type: 'digital',
    description: 'Visualización artística de flujos de datos que representa la era de la información.',
    year: 2023,
    modelType: 'particles',
    modelScale: [1, 1, 1],
    modelColor: '#2ecc71',
    animation: 'flow',
    position: [0, 0, -2],
    featured: false
  }
];

const ArtworksContext = createContext(null);

export function ArtworksProvider({ children }) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (artworkId) => {
    setFavorites(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const getFeaturedArtworks = () => {
    return artworks.filter(artwork => artwork.featured);
  };

  const getArtworkById = (id) => {
    return artworks.find(artwork => artwork.id === id);
  };

  const getArtworksByType = (type) => {
    return artworks.filter(artwork => artwork.type === type);
  };

  const getFavoriteArtworks = () => {
    return artworks.filter(artwork => favorites.includes(artwork.id));
  };

  return (
    <ArtworksContext.Provider value={{
      artworks,
      favorites,
      toggleFavorite,
      getFeaturedArtworks,
      getArtworkById,
      getArtworksByType,
      getFavoriteArtworks
    }}>
      {children}
    </ArtworksContext.Provider>
  );
}

export function useArtworks() {
  const context = useContext(ArtworksContext);
  if (context === null) {
    throw new Error('useArtworks must be used within an ArtworksProvider');
  }
  return context;
}
