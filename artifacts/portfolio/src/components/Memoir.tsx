import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen } from "lucide-react";

export function Memoir() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="memoir" className="py-24 relative bg-[#050B1F] overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066FF] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-block p-4 rounded-full bg-[#00D4FF]/10 mb-6">
            <BookOpen size={32} className="text-[#00D4FF]" />
          </div>
          <h2 className="text-sm md:text-base font-mono text-[#00FF88] tracking-widest uppercase mb-4">
            Mémoire Master 1 — SIR
          </h2>
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold font-sans text-white max-w-4xl mx-auto leading-tight">
            Conception d'une Architecture Microservices pour la Gestion Distribuée des Systèmes d'Information d'Entreprise
          </h3>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-[#0A1128]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="grid md:grid-cols-2 gap-8 mb-8 border-b border-white/5 pb-8">
            <div>
              <h4 className="text-gray-400 font-mono text-sm uppercase mb-2">Contexte</h4>
              <p className="text-white font-bold">Master 1 SIR — UCAD, Dakar</p>
              <p className="text-gray-300 text-sm">Département Math-Info, Section Informatique</p>
            </div>
            <div>
              <h4 className="text-gray-400 font-mono text-sm uppercase mb-2">Technologies Clés</h4>
              <div className="flex flex-wrap gap-2">
                {["Spring Boot", "Docker", "RabbitMQ", "PostgreSQL", "Eureka", "React"].map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded font-mono text-[#00D4FF]">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none font-sans">
            <p className="text-gray-300 text-lg leading-relaxed">
              Ce mémoire présente la conception et l'implémentation d'une architecture orientée microservices 
              visant à résoudre les problématiques de montée en charge, de disponibilité et de scalabilité 
              dans la gestion des systèmes d'information d'entreprise.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              L'approche retenue met en œuvre une API Gateway centralisée pour le routage intelligent, 
              Eureka pour le service discovery dynamique, et RabbitMQ pour la communication asynchrone 
              entre les services. Cette architecture garantit une haute disponibilité, une tolérance aux pannes 
              via le pattern circuit breaker, et une scalabilité horizontale grâce à la conteneurisation Docker.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Le système implémente également un monitoring temps réel avec suivi des performances, 
              une gestion centralisée des configurations, et une orchestration des services permettant 
              un déploiement continu et une maintenance sans interruption de service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
