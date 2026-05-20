import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Accueil", href: "#hero" },
  { name: "À Propos", href: "#about" },
  { name: "Compétences", href: "#skills" },
  { name: "Expériences", href: "#experience" },
  { name: "Projets", href: "#projects" },
  { name: "Parcours", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Mémoire", href: "#memoir" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050B1F]/80 backdrop-blur-md border-b border-[#00D4FF]/20 shadow-[0_4px_30px_rgba(0,102,255,0.1)] py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
          className="relative group"
        >
          <div className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0066FF]">
            SJ<span className="text-[#00FF88]">_</span>
          </div>
          <motion.div 
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FF88] group-hover:w-full transition-all duration-300"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className={`relative font-mono text-sm tracking-wide transition-colors hover:text-[#00D4FF] ${
                activeSection === link.href.substring(1)
                  ? "text-[#00D4FF]"
                  : "text-gray-300"
              }`}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#00D4FF] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#050B1F]/95 backdrop-blur-xl border-b border-[#00D4FF]/20 py-4 px-4 flex flex-col gap-4 shadow-2xl"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className={`text-lg font-mono p-2 rounded-md ${
                  activeSection === link.href.substring(1)
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] border-l-2 border-[#00D4FF]"
                    : "text-gray-300"
                }`}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
