import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, ChevronDown, Github, Linkedin, Mail, Monitor } from "lucide-react";
import { MatrixRain } from "./MatrixRain";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg    = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade   = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background matrix */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <MatrixRain />
      </motion.div>
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050B1F]/60 via-[#050B1F]/70 to-[#050B1F] pointer-events-none" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 w-full container mx-auto px-6 md:px-12 pt-28 pb-16"
      >
        {/* ── Availability line ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full bg-[#00FF88]"
            style={{ boxShadow: "0 0 8px #00FF88" }}
          />
          <span className="text-[#00FF88] font-mono text-sm tracking-widest font-bold">
            DISPONIBLE — STAGE / CDI
          </span>
        </motion.div>

        {/* ── UCAD badge ── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-block"
        >
          <div className="px-4 py-1.5 border border-[#00D4FF]/40 rounded text-[#00D4FF] font-mono text-xs tracking-wider"
               style={{ background: "rgba(0,212,255,0.06)" }}>
            UCAD · Dépt. MPI · M1 SIR · Section Informatique · Dakar, Sénégal
          </div>
        </motion.div>

        {/* ── Main 2-column grid ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-0">

          {/* ════ LEFT COLUMN ════ */}
          <div className="flex-1 flex flex-col items-start">

            {/* Giant name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              {/* Line 1 — "Souleymane" */}
              <h1 className="leading-none font-black tracking-tight"
                  style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
                <span
                  style={{
                    background: "linear-gradient(90deg, #ffffff 0%, #00D4FF 60%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Souleymane
                </span>
              </h1>
              {/* Line 2 — "JAW @ HULL-bit" */}
              <h1 className="leading-none font-black tracking-tight flex items-baseline gap-4 flex-wrap"
                  style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
                <span style={{ color: "#00D4FF" }}>JAW</span>
                <span className="font-mono font-bold" style={{ fontSize: "clamp(1rem, 2.5vw, 2rem)", color: "#FFB800" }}>
                  @ HULL-bit
                </span>
              </h1>
            </motion.div>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 flex items-center gap-2"
              style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
            >
              <span className="text-[#00D4FF] font-mono font-bold">&gt;</span>
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
                className="font-mono font-bold text-[#00D4FF]"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-md font-sans"
            >
              Ingénieur logiciel passionné par les systèmes distribués, les bases de données
              enterprise et l'architecture cloud. Formé à l'UCAD, je combine rigueur académique
              et expérience terrain pour construire des solutions robustes et scalables.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              {/* Primary — filled */}
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-2 px-6 py-3 font-mono font-bold text-sm tracking-widest text-white rounded transition-all duration-300 hover:shadow-[0_0_30px_#0066FF66]"
                style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)" }}
                data-testid="cta-projects"
              >
                <Monitor size={15} />
                VOIR MES PROJETS →
              </a>

              {/* Secondary — outlined */}
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 font-mono font-bold text-sm tracking-widest text-[#00D4FF] border border-[#00D4FF]/50 rounded transition-all duration-300 hover:bg-[#00D4FF]/10 hover:border-[#00D4FF] hover:shadow-[0_0_20px_#00D4FF33]"
                data-testid="cta-cv"
              >
                <Download size={15} />
                TÉLÉCHARGER CV
              </a>
            </motion.div>

            {/* Social pill buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: <Github size={14} />,   label: "GITHUB",   href: "https://github.com/souleymane-jaw",             color: "#fff" },
                { icon: <Linkedin size={14} />, label: "LINKEDIN", href: "https://linkedin.com/in/souleymane-jaw",        color: "#00D4FF" },
                { icon: <Mail size={14} />,     label: "EMAIL",    href: "mailto:jaw.souleymane@etudiant.ucad.edu.sn",    color: "#00FF88" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-white/15 rounded font-mono text-xs text-gray-300 tracking-widest transition-all duration-200 hover:border-white/40 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${s.color}60`;
                    (e.currentTarget as HTMLElement).style.color = s.color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${s.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "";
                    (e.currentTarget as HTMLElement).style.color = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                  data-testid={`social-${s.label.toLowerCase()}`}
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT COLUMN — circular avatar ════ */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex flex-col items-center gap-4 lg:ml-auto"
          >
            {/* Circle avatar */}
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, #0066FF 0%, #00D4FF 30%, #00FF88 50%, #FFB800 70%, #0066FF 100%)",
                  padding: "3px",
                }}
              >
                <div className="w-full h-full rounded-full bg-[#050B1F]" />
              </motion.div>

              {/* Counter-rotating accent */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 90deg, transparent 70%, rgba(0,255,136,0.6) 80%, transparent 90%)",
                  padding: "3px",
                }}
              >
                <div className="w-full h-full rounded-full" style={{ background: "transparent" }} />
              </motion.div>

              {/* Inner circle content */}
              <div
                className="absolute rounded-full overflow-hidden flex items-center justify-center"
                style={{ inset: "6px", background: "linear-gradient(135deg, #0a1628, #050B1F)" }}
              >
                {/* Hex clip inner avatar (SJ placeholder) */}
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #0d1f3c 0%, #050B1F 100%)",
                  }}
                >
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: "linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Initials */}
                  <motion.div
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <span
                      className="font-black font-mono leading-none"
                      style={{
                        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                        background: "linear-gradient(135deg, #ffffff 0%, #00D4FF 50%, #00FF88 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      SJ
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-[#00D4FF]/50 mt-1">
                      HULL-bit
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Pulsing dot on ring */}
              <motion.div
                className="absolute w-3.5 h-3.5 rounded-full bg-[#00FF88] border-2 border-[#050B1F]"
                style={{ top: "50%", right: "-4px", transform: "translateY(-50%)" }}
                animate={{ scale: [1, 1.3, 1], boxShadow: ["0 0 6px #00FF88", "0 0 16px #00FF88", "0 0 6px #00FF88"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Badge below avatar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-1.5 rounded-full font-mono text-xs tracking-wider text-[#00D4FF] border border-[#00D4FF]/30"
              style={{ background: "rgba(0,212,255,0.08)" }}
            >
              M1 SIR · UCAD 2025
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* SCROLL indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 right-1/3 z-10 flex flex-col items-center gap-1"
      >
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#00D4FF] transition-colors focus:outline-none"
        >
          <span className="text-[9px] font-mono tracking-[0.4em]">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
