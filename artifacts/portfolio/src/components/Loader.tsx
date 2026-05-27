import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const BOOT_LINES = [
  { text: "[ OK ] Chargement du kernel SIR-v2.5.1...", color: "#00FF88", delay: 0.1 },
  { text: "[ OK ] Montage du système de fichiers distribué...", color: "#00FF88", delay: 0.5 },
  { text: "[ OK ] Démarrage Django & Spring Boot...", color: "#00FF88", delay: 0.9 },
  { text: "[ OK ] Connexion PostgreSQL · MySQL...", color: "#00FF88", delay: 1.2 },
  { text: "[ OK ] Initialisation React & Flutter...", color: "#00FF88", delay: 1.5 },
  { text: "[ OK ] Compilation modules Python · Dart...", color: "#00FF88", delay: 1.8 },
  { text: "[ !! ] Café détecté — performances optimales...", color: "#FFB800", delay: 2.1 },
  { text: "[ OK ] Portfolio prêt — bienvenue Souleymane DIAW", color: "#00D4FF", delay: 2.5 },
];

const CODE_SNIPPETS = [
  `public class SIR {
  @SpringBootApplication
  void main() {
    run(this);
  }
}`,
  `SELECT u.nom, p.titre
FROM projets p
JOIN ucad u ON u.id = p.etudiant_id
WHERE p.mention = 'TRES BIEN';`,
  `def train_model(data):
  model = Sequential([
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')
  ])
  return model.fit(data)`,
  `class Pirogue {
  trackGPS(): Observable<Position> {
    return this.gpsService
      .stream()
      .pipe(filter(p => p.valid));
  }
}`,
  `#!/bin/bash
systemctl start nginx
systemctl start postgresql
echo "Infrastructure SIR ready ✓"`,
];

/* Animated steaming coffee cup SVG */
function CoffeeCup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, rotate: 10 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
        {/* Saucer */}
        <ellipse cx="45" cy="100" rx="38" ry="7" fill="#1a2444" stroke="#FFB800" strokeWidth="1.5" />
        {/* Cup body */}
        <path d="M15 60 Q12 95 45 95 Q78 95 75 60 Z" fill="#0a1628" stroke="#FFB800" strokeWidth="2" />
        {/* Cup top ellipse */}
        <ellipse cx="45" cy="60" rx="30" ry="8" fill="#0d1f3c" stroke="#FFB800" strokeWidth="2" />
        {/* Coffee surface */}
        <ellipse cx="45" cy="60" rx="26" ry="6" fill="#3d1a00" />
        {/* Coffee shimmer */}
        <motion.ellipse
          cx="45" cy="60" rx="20" ry="4"
          fill="none"
          stroke="#FFB800"
          strokeWidth="1"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Handle */}
        <path d="M75 68 Q92 68 92 78 Q92 88 75 88" stroke="#FFB800" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* HULL-bit text on cup */}
        <text x="28" y="82" fontFamily="monospace" fontSize="8" fill="#FFB800" opacity="0.6">HULL-bit</text>
      </svg>

      {/* Steam wisps */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: 22 + i * 12, top: 0 }}
          animate={{
            y: [0, -30, -50],
            opacity: [0, 0.7, 0],
            scaleX: [1, 1.4, 0.8],
            x: [0, (i - 1) * 6, (i - 1) * 10],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        >
          <svg width="12" height="30" viewBox="0 0 12 30">
            <path
              d="M6 28 Q2 20 6 14 Q10 8 6 2"
              stroke="#FFB800"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* Laptop SVG with animated screen */
function Laptop({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
        {/* === SCREEN === */}
        {/* Screen back */}
        <rect x="20" y="8" width="240" height="155" rx="8" fill="#050B1F" stroke="#0066FF" strokeWidth="2" />
        {/* Screen inner bezel */}
        <rect x="28" y="16" width="224" height="138" rx="4" fill="#02070f" />
        {/* Screen glow when active */}
        <motion.rect
          x="28" y="16" width="224" height="138" rx="4"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="1"
          animate={{ opacity: progress > 0.3 ? [0.3, 0.8, 0.3] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Screen content — fills as progress goes up */}
        <motion.rect
          x="28" y="16" width="224" height="138" rx="4"
          fill="#000d1a"
          animate={{ opacity: Math.min(1, progress * 3) }}
        />

        {/* Screen — code lines that appear */}
        {[
          { y: 32, w: 120, color: "#00D4FF" },
          { y: 44, w: 90, color: "#00FF88" },
          { y: 56, w: 140, color: "#FFB800" },
          { y: 68, w: 70, color: "#00D4FF" },
          { y: 80, w: 110, color: "#00FF88" },
          { y: 92, w: 85, color: "#FF3366" },
          { y: 104, w: 130, color: "#00D4FF" },
          { y: 116, w: 60, color: "#00FF88" },
          { y: 128, w: 100, color: "#FFB800" },
          { y: 140, w: 75, color: "#00D4FF" },
        ].map((line, i) => {
          const threshold = i * 0.1;
          const visible = progress > threshold;
          return (
            <motion.rect
              key={i}
              x="40"
              y={line.y}
              width={visible ? line.w : 0}
              height="6"
              rx="2"
              fill={line.color}
              opacity={visible ? 0.7 : 0}
              transition={{ duration: 0.4 }}
            />
          );
        })}

        {/* Cursor blink */}
        <motion.rect
          x="42"
          y="152"
          width="8"
          height="10"
          rx="1"
          fill="#00D4FF"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Webcam dot */}
        <circle cx="140" cy="12" r="3" fill="#1a2444" />
        <motion.circle cx="140" cy="12" r="2" fill="#00FF88"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* === BASE === */}
        <rect x="10" y="163" width="260" height="18" rx="4" fill="#0a1628" stroke="#0066FF" strokeWidth="1.5" />
        {/* Hinge line */}
        <rect x="10" y="163" width="260" height="3" rx="1" fill="#0066FF" opacity="0.5" />
        {/* Touchpad */}
        <rect x="105" y="168" width="70" height="9" rx="3" fill="#0d2040" stroke="#0066FF" strokeWidth="1" opacity="0.6" />
        {/* Keyboard rows suggestion */}
        {[0,1,2].map(row => (
          <rect key={row} x={20 + row * 2} y={166 + row * 0} width={240 - row * 4} height="1.5" rx="0.5" fill="#0066FF" opacity="0.15" />
        ))}

        {/* UCAD badge on lid */}
        <rect x="118" y="85" width="44" height="16" rx="3" fill="#FFB80015" stroke="#FFB800" strokeWidth="0.8" />
        <text x="140" y="96" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#FFB800" opacity="0.8">UCAD · SIR</text>

        {/* Screen reflection */}
        <motion.rect
          x="28" y="16" width="60" height="138" rx="4"
          fill="url(#screenSheen)"
          animate={{ x: [28, 192, 28] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ mixBlendMode: "screen" }}
        />
        <defs>
          <linearGradient id="screenSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.03" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Neon glow under laptop */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 h-2 rounded-full"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: "#0066FF", filter: "blur(8px)" }}
      />
    </motion.div>
  );
}

/* Floating code snippet card */
function FloatingCode({ snippet, delay, x, y }: { snippet: string; delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: y + 20 }}
      animate={{ opacity: [0, 0.85, 0.85, 0], scale: 1, y: [y + 20, y, y - 10] }}
      transition={{ delay, duration: 3.5, ease: "easeOut" }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div
        className="text-[9px] font-mono px-3 py-2 rounded-xl border max-w-[180px] whitespace-pre"
        style={{
          background: "rgba(0,102,255,0.06)",
          borderColor: "rgba(0,212,255,0.2)",
          color: "#00D4FF",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 20px rgba(0,102,255,0.1)",
          lineHeight: 1.6,
        }}
      >
        {snippet}
      </div>
    </motion.div>
  );
}

/* Matrix column of characters */
function MatrixColumn({ x, delay }: { x: number; delay: number }) {
  const chars = "01アイウエオカキクABCDEF{}[]()=>$#@JAVA.NET".split("");
  const colChars = Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]);
  return (
    <motion.div
      className="absolute top-0 flex flex-col gap-1 font-mono text-[11px]"
      style={{ left: x }}
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: ["0%", "110%"], opacity: [0, 0.6, 0.6, 0] }}
      transition={{ delay, duration: 3 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
    >
      {colChars.map((c, i) => (
        <span
          key={i}
          style={{ color: i === 0 ? "#ffffff" : i < 3 ? "#00FF88" : `rgba(0,255,136,${0.7 - i * 0.05})` }}
        >
          {c}
        </span>
      ))}
    </motion.div>
  );
}

export function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    const total = 4500;
    const start = Date.now();

    const progInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / total, 1);
      setProgress(p);
    }, 30);

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay * 1000);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, total);

    return () => {
      clearTimeout(timer);
      clearInterval(progInterval);
    };
  }, []);

  const matrixCols = Array.from({ length: 30 }, (_, i) => ({
    x: i * 42 + Math.random() * 20,
    delay: Math.random() * 2,
  }));

  const snippetPlacements = [
    { snippet: CODE_SNIPPETS[0], delay: 0.8, x: 40, y: 80 },
    { snippet: CODE_SNIPPETS[1], delay: 1.5, x: -240, y: 120 },
    { snippet: CODE_SNIPPETS[2], delay: 2.0, x: 50, y: 300 },
    { snippet: CODE_SNIPPETS[3], delay: 2.4, x: -230, y: 280 },
    { snippet: CODE_SNIPPETS[4], delay: 1.0, x: 30, y: 500 },
  ];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
          style={{ background: "#050B1F" }}
        >
          {/* Matrix rain background */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {matrixCols.map((col, i) => (
              <MatrixColumn key={i} x={col.x} delay={col.delay} />
            ))}
          </div>

          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.05) 2px, rgba(0,212,255,0.05) 4px)",
            }}
          />

          {/* Floating code snippets */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            {snippetPlacements.map((s, i) => (
              <FloatingCode key={i} {...s} />
            ))}
          </div>

          {/* === MAIN CONTENT === */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-2xl">

            {/* Top row: Laptop + Coffee */}
            <div className="flex items-end gap-8 md:gap-12">
              <Laptop progress={progress} />
              <div className="mb-4">
                <CoffeeCup />
              </div>
            </div>

            {/* System name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-mono font-black tracking-[0.2em]"
                style={{
                  background: "linear-gradient(90deg, #0066FF, #00D4FF, #FFB800)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}
              >
                HULL-bit OS
              </div>
              <motion.div
                className="text-[10px] font-mono text-[#00D4FF]/50 tracking-[0.4em] mt-1"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                UCAD · MPI · SYSTÈMES D'INFORMATION RÉPARTIE
              </motion.div>
            </motion.div>

            {/* Terminal boot log */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-xl rounded-xl border overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.6)",
                borderColor: "rgba(0,212,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00D4FF]/10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3366]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
                <span className="ml-2 text-[10px] font-mono text-[#00D4FF]/40 tracking-widest">boot.sh — jaw@ucad-sir</span>
              </div>

              {/* Terminal body */}
              <div className="px-4 py-3 min-h-[180px] space-y-1.5">
                <div className="text-[10px] font-mono text-[#FFB800]/60 mb-2">
                  jaw@ucad-sir:~$ sudo systemctl start portfolio.service
                </div>
                {BOOT_LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {visibleLines.includes(i) && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2 text-[10px] font-mono"
                      >
                        <span style={{ color: line.color }}>{line.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
                {/* Blinking prompt */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#00D4FF]/50">
                  <span>jaw@ucad-sir:~$</span>
                  <motion.span
                    className="w-2 h-3 bg-[#00D4FF] inline-block"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full max-w-xl space-y-2">
              <div className="h-1.5 bg-[#ffffff08] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, #0066FF, #00D4FF, #00FF88)",
                    boxShadow: "0 0 12px #00D4FF",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#00D4FF]/40">
                <span>Chargement modules...</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
