import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { value: 4, label: "Années d'expérience", suffix: "+" },
    { value: 20, label: "Projets réalisés", suffix: "+" },
    { value: 10, label: "Technologies maîtrisées", suffix: "+" },
    { value: 4, label: "Expériences pro", suffix: "" },
  ];

  const funStats = [
    { label: "Lignes de code écrites", value: 95, color: "#0066FF" },
    { label: "Bugs corrigés", value: 85, color: "#00FF88" },
    { label: "Cafés bus", value: 98, color: "#FFB800" },
  ];

  const tags = [".NET", "Oracle", "SQL Server", "Linux", "Spring", "Big Data", "UML", "C/C++", "Sécurité", "Performance", "Flutter", "IA"];

  return (
    <section id="about" className="py-24 relative bg-[#050B1F]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">01.</span> À Propos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Stats Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A1128] border border-[#0066FF]/30 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden group hover:border-[#00D4FF] transition-colors"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#0066FF] opacity-10 rounded-bl-full group-hover:bg-[#00D4FF] group-hover:opacity-20 transition-all"></div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00D4FF] to-[#0066FF] mb-2 font-mono">
                  {inView ? <CountUp end={stat.value} duration={2.5} /> : "0"}
                  {stat.suffix}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider font-mono">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 bg-[#0A1128] border border-white/5 p-8 rounded-lg relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00D4FF] opacity-5 rounded-full blur-3xl"></div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6 font-sans">
              Actuellement en Master 1 Systèmes d'Information Répartie (SIR) à l'Université Cheikh Anta Diop de Dakar, 
              je me passionne pour la conception d'architectures distribuées robustes et l'administration de systèmes d'entreprise.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-sans">
              Mon expertise couvre tout le cycle de vie du logiciel : du développement d'applications critiques (C#, Java EE) 
              à l'administration de bases de données (Oracle, SQL Server), en passant par l'administration Linux et l'intégration 
              de solutions d'Intelligence Artificielle.
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1 bg-[#050B1F] border border-[#00FF88]/30 text-[#00FF88] text-sm font-mono rounded hover:bg-[#00FF88]/10 hover:shadow-[0_0_10px_#00FF88]/30 transition-all cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <div className="space-y-4 mt-8 pt-8 border-t border-white/10">
              {funStats.map((stat, i) => (
                <div key={stat.label} className="w-full">
                  <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                    <span>{stat.label}</span>
                    <span style={{ color: stat.color }}>100%</span>
                  </div>
                  <div className="h-2 w-full bg-[#050B1F] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${stat.value}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                      className="h-full relative"
                      style={{ backgroundColor: stat.color }}
                    >
                      <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
