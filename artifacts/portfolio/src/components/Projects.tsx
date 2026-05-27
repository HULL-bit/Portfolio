import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, ExternalLink } from "lucide-react";

// Real projects from CV
const PROJECTS = [
  {
    id: 0,
    title: "Système de Gestion Distribué (Mémoire M1)",
    desc: "Conception d'une architecture microservices pour la gestion distribuée des systèmes d'information d'entreprise. Mise en place de load balancing, service discovery avec Eureka, API Gateway centralisée et monitoring temps réel. Sécurisation des communications inter-services avec pattern circuit breaker et gestion de la tolérance aux pannes.",
    stack: ["Java Spring Boot", "Docker", "RabbitMQ", "PostgreSQL", "React", "UML"],
    category: "Full-Stack",
    tags: ["Microservices", "Docker", "M1 Mémoire", "Entreprise", "Architecture"],
    featured: true,
  },
  {
    id: 1,
    title: "Application Gestion Multi-Magasins",
    desc: "Application web/mobile de gestion de boutiques et stocks : multi-magasins, inventaire temps réel, rapports de vente et alertes de rupture de stock",
    stack: ["Django", "React", "Flutter", "MySQL", "XML"],
    category: "Full-Stack",
    tags: ["E-commerce", "Multi-magasins", "Inventaire"],
    featured: true,
  },
  {
    id: 2,
    title: "Plateforme Complète de Gestion de Daara",
    desc: "Système complet de gestion : membres, finances, RH, calendrier culturel et conservatoire. Interface web Django/React et application mobile Flutter",
    stack: ["Django", "React", "Next.js", "Flutter", "Spring", "PostgreSQL"],
    category: "Full-Stack",
    tags: ["Gestion", "Mobile", "Web", "Spring Boot"],
    featured: true,
  },
  {
    id: 3,
    title: "Marketplace Pièces Détachées",
    desc: "Plateforme e-commerce de vente de pièces détachées automobiles avec catalogue produits, gestion des commandes, paiements et système d'avis clients",
    stack: ["Spring Boot", "PrimeFaces", "MySQL", "JPA/Hibernate", "Java EE"],
    category: "Full-Stack",
    tags: ["E-commerce", "Spring", "PrimeFaces", "Marketplace"],
    featured: true,
  },
  {
    id: 4,
    title: "Gestion et Localisation de Services",
    desc: "Application web de géolocalisation et gestion de services : cartographie interactive, suivi en temps réel, planification et optimisation des interventions",
    stack: ["Spring Boot", "React", "PostgreSQL", "Maps API", "REST API"],
    category: "Full-Stack",
    tags: ["Géolocalisation", "Services", "Cartographie", "Spring"],
    featured: true,
  },
];

const CATEGORIES = ["Tous", "Full-Stack", "Mobile", "Web"];

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative ${project.featured ? "md:col-span-2 lg:col-span-3" : ""}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative bg-[#0A1128] border border-white/10 rounded-xl overflow-hidden flex flex-col transition-shadow duration-500 hover:border-[#00D4FF]/50 hover:shadow-[0_10px_30px_rgba(0,212,255,0.15)] ${
          project.featured ? "lg:flex-row" : ""
        } h-full`}
      >
        {/* CSS Art / Mockup Area Placeholder */}
        <div className={`relative bg-[#050B1F] overflow-hidden ${project.featured ? "lg:w-2/5" : "h-48"}`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwNTBCMUYiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDIgMloiIHN0cm9rZT0iIzIyMjIyMiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9zdmc+')] opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-500">
            <div className="text-[#00D4FF] font-mono text-6xl opacity-20">&lt;/&gt;</div>
          </div>
          {/* Glowing accent border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className={`p-6 flex flex-col flex-grow bg-[#0A1128] translate-z-10 ${project.featured ? "lg:w-3/5" : ""}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold font-sans text-white group-hover:text-[#00D4FF] transition-colors">
              {project.title}
            </h3>
            <div className="flex gap-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#00D4FF] transition-colors"><ExternalLink size={20} /></a>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-6 flex-grow">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.stack.map(tech => (
              <span key={tech} className="text-xs font-mono text-[#00FF88]">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex gap-2 flex-wrap">
            {project.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-gray-300 uppercase tracking-wider border border-white/10 group-hover:border-[#0066FF]/30 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredProjects = activeCategory === "Tous" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative bg-[#030614]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">04.</span> Projets Réalisés
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 font-mono text-sm rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.5)]"
                  : "bg-[#0A1128] text-gray-400 border border-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
