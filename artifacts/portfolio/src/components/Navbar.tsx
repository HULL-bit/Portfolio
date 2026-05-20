import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { id: "01", name: "Accueil",       href: "#hero" },
  { id: "02", name: "À Propos",      href: "#about" },
  { id: "03", name: "Compétences",   href: "#skills" },
  { id: "04", name: "Expériences",   href: "#experience" },
  { id: "05", name: "Projets",       href: "#projects" },
  { id: "06", name: "Parcours",      href: "#education" },
  { id: "07", name: "Certifications",href: "#certifications" },
  { id: "08", name: "Mémoire",       href: "#memoir" },
  { id: "09", name: "Contact",       href: "#contact" },
];

const ABBR_DEFINITIONS = [
  { abbr: "M1",   full: "Master 1",                          color: "#00D4FF" },
  { abbr: "SIR",  full: "Systèmes d'Information Répartie",   color: "#00FF88" },
  { abbr: "MPI",  full: "Mathématiques & Physique · Informatique", color: "#FFB800" },
  { abbr: "UCAD", full: "Université Cheikh Anta Diop de Dakar",    color: "#0066FF" },
];

/* Glitch letter animation for logo */
function GlitchLogo({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const trigger = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 4000);
    return () => clearInterval(trigger);
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); setGlitching(true); setTimeout(() => setGlitching(false), 400); }}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-2 group focus:outline-none"
      data-testid="logo-button"
    >
      {/* Animated bracket left */}
      <motion.span
        animate={{ x: hovered ? -4 : 0, opacity: hovered ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-[#00FF88] font-mono text-lg font-bold"
      >[</motion.span>

      {/* Main initials */}
      <div className="relative">
        <motion.span
          animate={{
            backgroundPosition: hovered ? "200% center" : "0% center",
          }}
          transition={{ duration: 0.8 }}
          className="text-xl font-mono font-black tracking-widest"
          style={{
            background: "linear-gradient(90deg, #00D4FF, #0066FF, #00FF88, #FFB800, #00D4FF)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SJ
        </motion.span>
        {/* Glitch layers */}
        {glitching && (
          <>
            <span
              className="absolute inset-0 text-xl font-mono font-black tracking-widest text-[#FF3366] pointer-events-none"
              style={{ clipPath: "inset(20% 0 60% 0)", transform: "translateX(-2px)", opacity: 0.7 }}
            >SJ</span>
            <span
              className="absolute inset-0 text-xl font-mono font-black tracking-widest text-[#00D4FF] pointer-events-none"
              style={{ clipPath: "inset(60% 0 10% 0)", transform: "translateX(2px)", opacity: 0.7 }}
            >SJ</span>
          </>
        )}
      </div>

      {/* Underscore cursor */}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-[#00FF88] font-mono text-lg font-bold"
      >_</motion.span>

      {/* Bracket right */}
      <motion.span
        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-[#00FF88] font-mono text-lg font-bold"
      >]</motion.span>

      {/* Expanded name on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: -8, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -8, width: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden whitespace-nowrap text-xs font-mono text-[#00D4FF]/70 tracking-widest ml-1"
          >
            · SOULEYMANE JAW
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* Single animated nav link with magnetic feel */
function NavLink({
  link,
  isActive,
  onClick,
}: {
  link: (typeof NAV_LINKS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 focus:outline-none group"
      data-testid={`nav-link-${link.href.substring(1)}`}
    >
      {/* Number prefix */}
      <motion.span
        animate={{ opacity: hovered || isActive ? 1 : 0, y: hovered || isActive ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        className="text-[9px] font-mono text-[#00FF88] tracking-widest"
      >
        {link.id}
      </motion.span>

      {/* Link label */}
      <span
        className={`relative text-xs font-mono tracking-wider transition-colors duration-200 ${
          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
        }`}
      >
        {link.name}

        {/* Scan-line hover effect */}
        <motion.span
          className="absolute inset-0 overflow-hidden pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
        >
          <span
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)",
              transform: hovered ? "translateX(100%)" : "translateX(-100%)",
              transition: "transform 0.4s ease",
            }}
          />
        </motion.span>
      </span>

      {/* Active / hover underline */}
      <motion.span
        className="h-px w-full rounded-full"
        animate={{
          scaleX: isActive ? 1 : hovered ? 0.6 : 0,
          backgroundColor: isActive ? "#00D4FF" : "#00FF88",
          boxShadow: isActive
            ? "0 0 8px #00D4FF, 0 0 16px #00D4FF44"
            : "0 0 6px #00FF88",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        layoutId={isActive ? "activeNavLine" : undefined}
      />
    </motion.button>
  );
}

/* Abbreviation badge strip */
function AbbrStrip() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="hidden xl:flex items-center gap-3 ml-4 border-l border-[#00D4FF]/20 pl-4">
      {ABBR_DEFINITIONS.map((item, i) => (
        <div key={item.abbr} className="relative">
          <button
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            className="flex items-center gap-1 group focus:outline-none"
          >
            <motion.span
              animate={{
                color: activeIdx === i ? item.color : "rgba(156,163,175,0.6)",
                textShadow: activeIdx === i ? `0 0 10px ${item.color}` : "none",
              }}
              className="text-[10px] font-mono font-bold tracking-widest"
            >
              {item.abbr}
            </motion.span>
          </button>

          {/* Tooltip */}
          <AnimatePresence>
            {activeIdx === i && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-1/2 mt-3 z-50 pointer-events-none"
                style={{ transform: "translateX(-50%)" }}
              >
                <div
                  className="px-3 py-2 rounded-lg text-center whitespace-nowrap backdrop-blur-md border text-[10px] font-mono"
                  style={{
                    background: `${item.color}10`,
                    borderColor: `${item.color}40`,
                    color: item.color,
                    boxShadow: `0 0 20px ${item.color}20`,
                  }}
                >
                  <div className="font-bold mb-0.5">{item.abbr}</div>
                  <div className="opacity-80 text-[9px]">{item.full}</div>
                  {/* Arrow */}
                  <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-l border-t"
                    style={{ background: `${item.color}10`, borderColor: `${item.color}40` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "py-2"
            : "py-4"
        }`}
      >
        {/* Glassmorphism bar */}
        <motion.div
          animate={{
            backgroundColor: isScrolled ? "rgba(5,11,31,0.88)" : "rgba(5,11,31,0.2)",
            borderColor: isScrolled ? "rgba(0,212,255,0.18)" : "rgba(0,212,255,0.06)",
          }}
          className="mx-4 md:mx-8 rounded-2xl border backdrop-blur-xl px-5 py-3 flex items-center justify-between"
          style={{
            boxShadow: isScrolled
              ? "0 4px 40px rgba(0,102,255,0.08), inset 0 1px 0 rgba(0,212,255,0.08)"
              : "none",
          }}
        >
          {/* Logo */}
          <GlitchLogo onClick={() => scrollTo("#hero")} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                link={link}
                isActive={activeSection === link.href.substring(1)}
                onClick={() => scrollTo(link.href)}
              />
            ))}
          </nav>

          {/* Right side: abbr strip + status dot */}
          <div className="hidden lg:flex items-center gap-3">
            <AbbrStrip />

            {/* Status dot */}
            <div className="flex items-center gap-1.5 ml-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-[#00FF88]"
                style={{ boxShadow: "0 0 6px #00FF88" }}
              />
              <span className="text-[9px] font-mono text-[#00FF88]/70 tracking-widest">
                DISPONIBLE
              </span>
            </div>

            {/* Zap icon decoration */}
            <Zap size={13} className="text-[#FFB800]/50" />
          </div>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-[#00D4FF] p-1.5 rounded-lg border border-[#00D4FF]/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 44px) 28px)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 44px) 28px)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 44px) 28px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-center items-center"
            style={{ background: "rgba(5,11,31,0.97)", backdropFilter: "blur(24px)" }}
          >
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6 w-full px-8">
              {/* Mobile logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-mono font-black mb-4"
                style={{
                  background: "linear-gradient(90deg, #00D4FF, #0066FF, #00FF88)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                [SJ_]
              </motion.div>

              {/* Nav links */}
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => scrollTo(link.href)}
                  className={`flex items-center gap-4 w-full max-w-xs group focus:outline-none`}
                  data-testid={`mobile-nav-${link.href.substring(1)}`}
                >
                  <span className="text-xs font-mono text-[#00FF88]/50 w-6 text-right">{link.id}</span>
                  <span
                    className={`text-2xl font-mono font-bold tracking-wide transition-colors duration-200 ${
                      activeSection === link.href.substring(1)
                        ? "text-[#00D4FF]"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                    style={
                      activeSection === link.href.substring(1)
                        ? { textShadow: "0 0 20px #00D4FF66" }
                        : {}
                    }
                  >
                    {link.name}
                  </span>
                  {activeSection === link.href.substring(1) && (
                    <motion.div layoutId="mobileActive" className="ml-auto w-2 h-2 rounded-full bg-[#00D4FF]" style={{ boxShadow: "0 0 8px #00D4FF" }} />
                  )}
                </motion.button>
              ))}

              {/* Abbr legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs"
              >
                {ABBR_DEFINITIONS.map((item) => (
                  <div key={item.abbr} className="px-3 py-2 rounded-xl border" style={{ borderColor: `${item.color}25`, background: `${item.color}08` }}>
                    <div className="text-[10px] font-mono font-bold" style={{ color: item.color }}>{item.abbr}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{item.full}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
