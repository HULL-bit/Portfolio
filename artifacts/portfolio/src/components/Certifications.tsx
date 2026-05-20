import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const CERTS = [
  { name: "AZ-900 Azure Fundamentals", vendor: "Microsoft", color: "#00A4EF" },
  { name: "70-462 SQL Server Admin", vendor: "Microsoft", color: "#00A4EF" },
  { name: "Oracle Database SQL Certified", vendor: "Oracle", color: "#F80000" },
  { name: "Oracle Linux Certified", vendor: "Oracle", color: "#F80000" },
  { name: "CCNA Routing & Switching", vendor: "Cisco", color: "#1BA0D7" },
  { name: "Linux Essentials (LPI)", vendor: "Linux", color: "#FCC624" },
  { name: "Big Data Specialization", vendor: "Coursera", color: "#0056D2" },
  { name: "Spring Framework", vendor: "Coursera", color: "#6DB33F" }
];

export function Certifications() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certifications" className="py-24 relative bg-[#030614]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">06.</span> Certifications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTS.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group bg-[#0A1128] rounded-lg p-6 border border-white/10 overflow-hidden cursor-pointer h-40 flex flex-col justify-center"
            >
              {/* Holographic Shimmer Effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-gradient-to-br from-white/5 via-white/20 to-white/5 mix-blend-overlay"></div>
              
              <div className="relative z-10">
                <span 
                  className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block"
                  style={{ color: cert.color }}
                >
                  {cert.vendor}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-white transition-colors">
                  {cert.name}
                </h3>
              </div>
              
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-300 w-0 group-hover:w-full"
                style={{ backgroundColor: cert.color, boxShadow: `0 0 10px ${cert.color}` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
