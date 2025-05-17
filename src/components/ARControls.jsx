
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ARControls = ({ onReset, onZoomIn, onZoomOut, onRotate, artwork }) => {
  const { toast } = useToast();
  
  const handleScreenshot = () => {
    toast({
      title: "Captura guardada",
      description: "La imagen se ha guardado en tu galería.",
    });
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <motion.div 
      className="ar-controls flex justify-center items-center"
      initial="hidden"
      animate="visible"
      variants={controlsVariants}
    >
      <div className="glassmorphism rounded-full p-2 flex items-center space-x-2">
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={onReset} className="rounded-full bg-white/10 hover:bg-white/20">
            <Trash2 className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={onZoomIn} className="rounded-full bg-white/10 hover:bg-white/20">
            <ZoomIn className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={onZoomOut} className="rounded-full bg-white/10 hover:bg-white/20">
            <ZoomOut className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={onRotate} className="rounded-full bg-white/10 hover:bg-white/20">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="icon" onClick={handleScreenshot} className="rounded-full bg-white/10 hover:bg-white/20">
            <Download className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ARControls;
