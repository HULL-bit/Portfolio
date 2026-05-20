import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#00D4FF] origin-left z-[100] shadow-[0_0_10px_#00D4FF]"
      style={{ scaleX }}
    />
  );
}
