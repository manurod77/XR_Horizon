
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background">
      <Header title="Página no encontrada" showBackButton={true} />
      
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div 
            className="text-9xl mb-6 text-primary"
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            404
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
          
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/ar')}
            >
              Explorar en AR
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;
