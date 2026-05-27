import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap } from "lucide-react";

const EDUCATION = [
  {
    year: "2024 - 2025 (EN COURS)",
    degree: "Master 1 SIR",
    school: "UCAD, Dépt. MPI",
    detail: "Systèmes d'Information Répartie",
    active: true
  },
  {
    year: "2022 - 2024",
    degree: "Licence Informatique",
    school: "FST/ESP UCAD",
    detail: "Mention TRES BIEN",
    active: false
  },
  {
    year: "2022",
    degree: "BAC Série S",
    school: "Lycée de Mbacké",
    detail: "Mention Assez Bien",
    active: false
  }
];

export function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="education" className="py-24 relative bg-[#050B1F]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">05.</span> Parcours Scolaire
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
            <motion.div 
              className="absolute top-0 w-full bg-gradient-to-b from-[#00D4FF] via-[#0066FF] to-[#FFB800]"
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {EDUCATION.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#050B1F] border-2 z-10 flex items-center justify-center
                  ${item.active ? 'border-[#00FF88] shadow-[0_0_15px_#00FF88]' : 'border-[#0066FF]'}
                " style={{ borderColor: item.active ? "#00FF88" : "#0066FF" }}>
                  {item.active && (
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-[#00FF88] opacity-20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <GraduationCap size={16} className={item.active ? "text-[#00FF88]" : "text-[#0066FF]"} />
                </div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                  <div className={`p-6 rounded-lg bg-[#0A1128] border border-white/10 hover:border-[#00D4FF]/50 transition-colors shadow-lg ${item.active ? 'ring-1 ring-[#00FF88]/30' : ''}`}>
                    <span className={`text-xs font-mono mb-2 inline-block px-2 py-1 rounded bg-white/5 ${item.active ? 'text-[#00FF88]' : 'text-[#00D4FF]'}`}>
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">{item.degree}</h3>
                    <h4 className="text-md text-gray-300 font-mono mb-3">{item.school}</h4>
                    <p className="text-gray-400 text-sm bg-black/20 p-3 rounded">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
