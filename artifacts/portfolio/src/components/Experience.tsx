import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, Briefcase, CheckCircle2 } from "lucide-react";

const EXPERIENCES = [
  {
    id: 1,
    title: "Développeur Full Stack",
    company: "Wagadu Africa / ALMADE 2",
    location: "Sénégal",
    type: "Stage/Emploi",
    badgeColor: "#00FF88", // Freelance/Emploi green
    project: "Plateforme blue-track.net — système de tracking des pirogues artisanales pour sécuriser la pêche et permettre les secours en mer à Kayar",
    missions: [
      "Développement de la plateforme Blue-Track pour le suivi GPS des pirogues artisanales",
      "Système d'alertes et de secours en mer en temps réel",
      "Interface de monitoring pour les autorités maritimes",
      "Intégration de cartes marines et données GPS",
      "API de communication avec les balises embarquées"
    ],
    stack: ["React", "Node.js", "GPS/Cartographie", "Base de données", "API REST"]
  },
  {
    id: 2,
    title: "Développeur Backend Java EE",
    company: "[Entreprise privée]",
    location: "Dakar, Sénégal",
    type: "Stage",
    badgeColor: "#00D4FF", // Stage cyan
    missions: [
      "Développement d'applications d'entreprise avec Java EE et PrimeFaces",
      "Conception et optimisation de bases de données Oracle",
      "Mise en place d'API REST avec Spring Boot",
      "Modélisation UML et documentation technique"
    ],
    stack: ["Java EE", "PrimeFaces", "Oracle", "Spring Boot", "JPA/Hibernate"]
  },
  {
    id: 3,
    title: "Développeur .NET / C#",
    company: "[Structure privée]",
    location: "Dakar, Sénégal",
    type: "Stage/Projet",
    badgeColor: "#00D4FF",
    missions: [
      "Développement d'applications desktop avec WPF et C#",
      "Conception de systèmes de gestion avec Entity Framework",
      "Administration de bases de données SQL Server",
      "Rapports Crystal Reports et export PDF/Excel"
    ],
    stack: ["C#", "ASP.NET Core", "WPF", "Entity Framework", "SQL Server"]
  },
  {
    id: 4,
    title: "Technicien Maintenance Informatique",
    company: "BDM TECH",
    location: "Dakar, Sénégal",
    type: "Stage",
    badgeColor: "#00D4FF",
    missions: [
      "Maintenance préventive et corrective du parc informatique (PCs, imprimantes, switches)",
      "Installation et configuration de systèmes d'exploitation (Windows, Linux)",
      "Support technique utilisateurs niveau 1 et 2",
      "Configuration réseaux LAN/WAN, câblage, routeurs, switches Cisco",
      "Gestion des licences logicielles et inventaire du parc",
      "Installation et configuration d'Active Directory et partages réseaux"
    ],
    stack: ["Windows Server", "Active Directory", "Cisco", "TCP/IP", "Hardware", "Helpdesk"]
  }
];

export function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" className="py-24 relative bg-[#050B1F]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">03.</span> Expériences
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {EXPERIENCES.map((exp, index) => {
            const isExpanded = expandedId === exp.id;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-[#0A1128] border transition-all duration-300 rounded-lg overflow-hidden ${
                  isExpanded ? "border-[#0066FF] shadow-[0_0_20px_rgba(0,102,255,0.2)]" : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  className="w-full text-left p-6 flex items-start sm:items-center gap-4 focus:outline-none"
                >
                  <div 
                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center bg-[#050B1F] border border-white/10 relative overflow-hidden"
                  >
                    {isExpanded && (
                      <motion.div 
                        layoutId="activeGlow"
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundColor: exp.badgeColor }}
                      />
                    )}
                    <Briefcase size={20} style={{ color: isExpanded ? exp.badgeColor : "#fff" }} />
                  </div>

                  <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 font-sans">{exp.title}</h3>
                      <div className="text-sm font-mono text-gray-400 mt-1">
                        <span className="text-white">{exp.company}</span> · {exp.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-xs font-mono px-3 py-1 rounded-full border bg-opacity-10 backdrop-blur-sm"
                        style={{ 
                          color: exp.badgeColor, 
                          borderColor: `${exp.badgeColor}40`,
                          backgroundColor: `${exp.badgeColor}10` 
                        }}
                      >
                        {exp.type}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 border-t border-white/5 mt-2">
                        {exp.project && (
                          <div className="mb-4 p-4 rounded bg-[#050B1F] border border-white/5 font-sans text-gray-300 text-sm italic border-l-2 border-l-[#0066FF]">
                            "{exp.project}"
                          </div>
                        )}
                        
                        <ul className="space-y-3 mb-6">
                          {exp.missions.map((mission, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.05 }}
                              className="flex gap-3 text-gray-300 text-sm font-sans"
                            >
                              <CheckCircle2 size={18} className="shrink-0 text-[#0066FF] mt-0.5" />
                              <span>{mission}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {exp.stack.map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-1 text-xs font-mono rounded bg-white/5 text-gray-300 border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
