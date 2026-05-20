import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatrixRain } from "./MatrixRain";

export function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050B1F]"
        >
          <div className="absolute inset-0 opacity-50">
            <MatrixRain />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-24 border-4 border-t-[#00D4FF] border-r-[#0066FF] border-b-[#FFB800] border-l-[#00FF88] rounded-full animate-spin"></div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#FFB800] tracking-widest"
            >
              INITIALISATION...
            </motion.h1>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              className="h-1 mt-4 bg-[#00FF88] shadow-[0_0_10px_#00FF88]"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 font-mono text-[#00D4FF] text-sm"
            >
              CHARGEMENT DES MODULES SIR
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
