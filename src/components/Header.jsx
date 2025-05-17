
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isARView = location.pathname === '/ar';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate('/');
    setMenuOpen(false);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const menuVariants = {
    closed: { 
      opacity: 0,
      x: '100%',
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header 
      className="ar-header glassmorphism p-4 flex items-center justify-between"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-bold">{title || 'AR Art Gallery'}</h1>
      </div>
      
      <div className="flex items-center">
        {!isHomePage && !isARView && (
          <Button variant="ghost" size="icon" onClick={handleHomeClick} className="mr-2">
            <Home className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col"
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold">Menú</h2>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col p-4 space-y-4">
          <Button 
            variant="ghost" 
            className="flex items-center justify-start text-lg"
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
            }}
          >
            <Home className="h-5 w-5 mr-2" />
            Inicio
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex items-center justify-start text-lg"
            onClick={() => {
              navigate('/ar');
              setMenuOpen(false);
            }}
          >
            <span className="mr-2">🔍</span>
            Explorar en AR
          </Button>
          
          <div className="border-t border-white/10 my-4 pt-4">
            <h3 className="text-sm text-muted-foreground mb-2">Categorías</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/?type=sculpture');
                setMenuOpen(false);
              }}
            >
              <span className="mr-2">🗿</span>
              Esculturas
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/?type=painting');
                setMenuOpen(false);
              }}
            >
              <span className="mr-2">🖼️</span>
              Pinturas
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/?type=digital');
                setMenuOpen(false);
              }}
            >
              <span className="mr-2">💻</span>
              Arte Digital
            </Button>
          </div>
          
          <div className="border-t border-white/10 my-4 pt-4">
            <Button 
              variant="ghost" 
              className="flex items-center justify-start text-lg"
              onClick={() => {
                // This would typically go to an about page
                setMenuOpen(false);
              }}
            >
              <Info className="h-5 w-5 mr-2" />
              Acerca de
            </Button>
          </div>
        </div>
        
        <div className="mt-auto p-4 text-center text-sm text-muted-foreground">
          <p>AR Art Gallery v1.0</p>
          <p>© 2025 Todos los derechos reservados</p>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
