
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import HomePage from '@/pages/HomePage';
import ARView from '@/pages/ARView';
import ArtworkDetails from '@/pages/ArtworkDetails';
import NotFound from '@/pages/NotFound';
import { ArtworksProvider } from '@/contexts/ArtworksContext';
import { ARSupportProvider } from '@/contexts/ARSupportContext';

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Bienvenido a AR Art Gallery!",
        description: "Explora arte en realidad aumentada directamente desde tu dispositivo móvil.",
        duration: 5000,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="loading-spinner"></div>
          <h1 className="mt-4 text-2xl font-bold text-primary">AR Art Gallery</h1>
          <p className="mt-2 text-muted-foreground">Cargando experiencia de arte en AR...</p>
        </div>
      </div>
    );
  }

  return (
    <ARSupportProvider>
      <ArtworksProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ar" element={<ARView />} />
            <Route path="/artwork/:id" element={<ArtworkDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </ArtworksProvider>
    </ARSupportProvider>
  );
}

export default App;
