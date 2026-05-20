import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, ChevronDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { MatrixRain } from "./MatrixRain";

const SOCIAL_LINKS = [
  { icon: <Github size={18} />, label: "GitHub",   href: "https://github.com/souleymane-jaw",        color: "#00D4FF" },
  { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com/in/souleymane-jaw", color: "#0066FF" },
  { icon: <Mail size={18} />,   label: "Email",    href: "mailto:jaw.souleymane@etudiant.ucad.edu.sn", color: "#00FF88" },
];

/* Hexagonal avatar */
function HexAvatar() {
  return (
    <div className="relative w-52 h-52 md:w-64 md:h-64 flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        <div
          className="w-full h-full"
          style={{
            background: "conic-gradient(from 0deg, #0066FF, #00D4FF, #00FF88, #FFB800, #FF3366, #0066FF)",
          }}
        />
      </motion.div>

      {/* Slow counter-rotate inner accent ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: "calc(100% - 6px)",
          height: "calc(100% - 6px)",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "conic-gradient(from 180deg, transparent 60%, rgba(0,212,255,0.5) 70%, transparent 80%)",
        }}
      />

      {/* Inner dark fill */}
      <div
        className="absolute bg-[#050B1F] flex items-center justify-center"
        style={{
          width: "calc(100% - 8px)",
          height: "calc(100% - 8px)",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {/* Grid pattern inside hex */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Initials */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.span
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl md:text-6xl font-black font-mono"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #0066FF, #00FF88)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SJ
          </motion.span>
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#00D4FF]/50 mt-1">
            HULL-bit
          </span>
        </div>
      </div>

      {/* Corner accent dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ["#0066FF","#00D4FF","#00FF88","#FFB800","#FF3366","#00D4FF"][i],
            boxShadow: `0 0 8px ${["#0066FF","#00D4FF","#00FF88","#FFB800","#FF3366","#00D4FF"][i]}`,
            top: "50%",
            left: "50%",
            transform: `rotate(${deg}deg) translateY(-${128}%) translate(-50%, -50%)`,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.33 }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* Parallax layers */
  const yBg     = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yLeft   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yRight  = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* === BACKGROUND LAYERS (parallax) === */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <MatrixRain />
      </motion.div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050B1F]/30 via-[#050B1F]/60 to-[#050B1F] pointer-events-none" />

      {/* Radial spotlight behind left column */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 70% at 20% 55%, rgba(0,102,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Floating grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* === MAIN LAYOUT: two-column, fully wrapped === */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 md:px-12 pt-24 pb-16 flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-20 min-h-screen"
      >

        {/* ── LEFT: Avatar (parallax slower) ── */}
        <motion.div
          style={{ y: yLeft }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 flex flex-col items-center gap-6"
        >
          <HexAvatar />

          {/* Location tag below avatar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500"
          >
            <MapPin size={11} className="text-[#00FF88]" />
            Dakar, Sénégal
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#00FF88] ml-1"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* ── RIGHT: All text content (parallax faster) ── */}
        <motion.div
          style={{ y: yRight }}
          className="flex flex-col items-start text-left flex-1 max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/08 backdrop-blur-md text-[#00D4FF] text-[11px] font-mono tracking-wider"
            style={{ boxShadow: "0 0 20px rgba(0,212,255,0.12)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            UCAD · Dépt. MPI · M1 SIR · Section Informatique · Dakar, Sénégal
          </motion.div>

          {/* Tagline ABOVE name */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-sm md:text-base text-gray-400 font-sans leading-relaxed mb-5 max-w-xl border-l-2 border-[#0066FF]/40 pl-4"
          >
            Ingénieur logiciel passionné par les systèmes distribués, les bases de données enterprise
            et l'architecture cloud. Formé à l'UCAD, je combine rigueur académique et expérience terrain
            pour construire des solutions{" "}
            <span className="text-[#00D4FF]">robustes</span> et{" "}
            <span className="text-[#00FF88]">scalables</span>.
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-none"
          >
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF 0%, #00D4FF 40%, #FFB800 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Souleymane
            </span>
            <br />
            <span className="text-white">JAW</span>
            <span className="text-[#00FF88] font-mono">_</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg md:text-xl font-mono text-gray-300 mb-8 flex items-center gap-2"
          >
            <span className="text-[#00FF88] text-sm">&gt;</span>
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
              speed={55}
              repeat={Infinity}
              className="text-gray-100"
            />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-7 py-3 overflow-hidden rounded-lg border border-[#0066FF] text-[#0066FF] font-mono font-bold text-sm tracking-widest transition-all duration-300 hover:text-white hover:shadow-[0_0_24px_#0066FF55]"
            >
              <div className="absolute inset-0 w-0 bg-[#0066FF] transition-all duration-[220ms] ease-out group-hover:w-full -z-0" />
              <span className="relative z-10">Voir mes Projets</span>
            </a>

            <a
              href="/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-7 py-3 overflow-hidden rounded-lg border border-[#00D4FF] text-[#00D4FF] font-mono font-bold text-sm tracking-widest transition-all duration-300 hover:text-[#050B1F] hover:shadow-[0_0_24px_#00D4FF55] flex items-center gap-2"
            >
              <div className="absolute inset-0 w-0 bg-[#00D4FF] transition-all duration-[220ms] ease-out group-hover:w-full -z-0" />
              <span className="relative z-10">Télécharger CV</span>
              <Download size={15} className="relative z-10 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Social links — horizontal with labels */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex items-center gap-1"
          >
            {SOCIAL_LINKS.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 bg-white/03 backdrop-blur-sm font-mono text-xs text-gray-400 transition-all duration-200 hover:border-current"
                style={{ "--hover-color": s.color } as React.CSSProperties}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = s.color;
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.color}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${s.color}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
                data-testid={`social-${s.label.toLowerCase()}`}
              >
                {s.icon}
                <span>{s.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-1 text-[#00D4FF]/50 hover:text-[#00D4FF] transition-colors focus:outline-none"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
