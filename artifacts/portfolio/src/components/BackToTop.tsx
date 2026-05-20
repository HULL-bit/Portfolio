import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center group focus:outline-none"
        >
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Background ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#0A1128"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-150 ease-out"
              />
            </svg>
            
            <div className="bg-[#050B1F] rounded-full w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#00D4FF] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all">
              <ArrowUp size={20} className="text-[#00D4FF]" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
