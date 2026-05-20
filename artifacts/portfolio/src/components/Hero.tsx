import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Download, ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { MatrixRain } from "./MatrixRain";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <MatrixRain />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B1F]/80 to-[#050B1F] pointer-events-none z-0" />
      
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* Hexagon profile placeholder */}
          <div className="w-48 h-48 relative overflow-hidden" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF] via-[#00D4FF] to-[#FFB800] animate-spin-slow opacity-80" style={{ animationDuration: "10s" }} />
            <div className="absolute inset-1 bg-[#050B1F] flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
              <span className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-[#00D4FF] to-[#00FF88]">SJ</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 backdrop-blur-md text-[#00D4FF] text-sm font-mono tracking-wider shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            UCAD · Dépt. MPI · M1 SIR · Section Informatique · Dakar, Sénégal
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#00D4FF] to-[#FFB800] animate-gradient-x">
            Souleymane JAW
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl md:text-3xl font-mono text-gray-300 mb-12 h-[40px]"
        >
          <span className="text-[#00FF88]">{"> "}</span>
          <TypeAnimation
            sequence={[
              "Développeur .NET & C#", 2000,
              "SQL Server & Oracle DBA", 2000,
              "Administrateur Systèmes Linux", 2000,
              "Développeur Java EE / Spring", 2000,
              "Architecte Big Data & Python", 2000,
              "Étudiant M1 Systèmes Distribués", 2000,
              "Expert Modélisation UML", 2000,
              "Développeur Mobile Flutter", 2000,
              "Expert Intelligence Artificielle", 2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-gray-100"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          <a
            href="#projects"
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-md border border-[#0066FF] text-[#0066FF] font-mono font-bold tracking-widest transition-all duration-300 hover:text-white hover:shadow-[0_0_20px_#0066FF]"
          >
            <div className="absolute inset-0 w-0 bg-[#0066FF] transition-all duration-[250ms] ease-out group-hover:w-full -z-10" />
            <span className="relative z-10">Voir mes Projets</span>
          </a>
          
          <a
            href="/cv"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-[#050B1F] overflow-hidden rounded-md border border-[#00D4FF] text-[#00D4FF] font-mono font-bold tracking-widest transition-all duration-300 hover:text-white hover:shadow-[0_0_20px_#00D4FF] flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 w-0 bg-[#00D4FF] transition-all duration-[250ms] ease-out group-hover:w-full -z-10" />
            <span className="relative z-10">Télécharger CV</span>
            <Download size={18} className="relative z-10 group-hover:animate-bounce" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex gap-8"
        >
          {[
            { icon: <Github size={24} />, href: "#" },
            { icon: <Linkedin size={24} />, href: "#" },
            { icon: <Mail size={24} />, href: "mailto:jaw.souleymane@etudiant.ucad.edu.sn" }
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="text-gray-400 hover:text-[#00D4FF] transition-all duration-300 hover:scale-125 hover:shadow-[0_0_15px_#00D4FF] rounded-full p-2"
            >
              {item.icon}
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <a href="#about" className="text-[#00D4FF] flex flex-col items-center justify-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
