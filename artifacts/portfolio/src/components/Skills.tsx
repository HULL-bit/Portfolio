import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SKILL_CATEGORIES = [
  "Tous",
  "Langages",
  "Bases de données",
  "Frameworks",
  "Systèmes",
  "Big Data",
  "IA"
];

const SKILLS = [
  // Langages
  { name: "C#", value: 90, category: "Langages", color: "#9b4993" },
  { name: "SQL (T-SQL/PL-SQL)", value: 90, category: "Langages", color: "#FFB800" },
  { name: "ASP.NET Core", value: 88, category: "Langages", color: "#512bd4" },
  { name: "C", value: 85, category: "Langages", color: "#a8b9cc" },
  { name: "Java", value: 85, category: "Langages", color: "#f89820" },
  { name: "C++", value: 82, category: "Langages", color: "#00599C" },
  { name: "Python", value: 80, category: "Langages", color: "#3776AB" },
  { name: "PHP", value: 75, category: "Langages", color: "#777bb4" },
  { name: "Flutter", value: 73, category: "Langages", color: "#02569B" },
  { name: "React", value: 72, category: "Langages", color: "#61DAFB" },
  { name: "JavaScript", value: 70, category: "Langages", color: "#F7DF1E" },
  { name: "Django", value: 70, category: "Langages", color: "#092e20" },

  // BD
  { name: "Oracle 19c", value: 92, category: "Bases de données", color: "#F80000" },
  { name: "SQL Server", value: 90, category: "Bases de données", color: "#CC292B" },
  { name: "MySQL", value: 78, category: "Bases de données", color: "#4479A1" },
  { name: "PostgreSQL", value: 75, category: "Bases de données", color: "#336791" },
  { name: "MongoDB", value: 65, category: "Bases de données", color: "#47A248" },

  // Frameworks
  { name: "PrimeFaces/JSF", value: 88, category: "Frameworks", color: "#e1215b" },
  { name: "ASP.NET MVC", value: 87, category: "Frameworks", color: "#512bd4" },
  { name: "Java EE", value: 85, category: "Frameworks", color: "#f89820" },
  { name: "Entity Framework", value: 85, category: "Frameworks", color: "#68217A" },
  { name: "Spring/Spring Boot", value: 83, category: "Frameworks", color: "#6DB33F" },
  { name: "WPF/WinForms", value: 80, category: "Frameworks", color: "#512bd4" },

  // Systèmes
  { name: "Linux Admin", value: 93, category: "Systèmes", color: "#FCC624" },
  { name: "Maintenance Info", value: 88, category: "Systèmes", color: "#0066FF" },
  { name: "Bash Scripting", value: 83, category: "Systèmes", color: "#4EAA25" },
  { name: "Réseaux TCP/IP", value: 80, category: "Systèmes", color: "#00D4FF" },
  { name: "Active Directory", value: 78, category: "Systèmes", color: "#00A4EF" },
  { name: "VMware/VirtualBox", value: 75, category: "Systèmes", color: "#607078" },

  // Big Data
  { name: "UML/Merise", value: 92, category: "Big Data", color: "#FFB800" },
  { name: "Git/GitHub", value: 85, category: "Big Data", color: "#F05032" },
  { name: "Hadoop/HDFS", value: 72, category: "Big Data", color: "#66CCFF" },
  { name: "Apache Spark", value: 68, category: "Big Data", color: "#E25A1C" },

  // IA
  { name: "Prompt Engineering", value: 80, category: "IA", color: "#00FF88" },
  { name: "LLM APIs", value: 78, category: "IA", color: "#00D4FF" },
  { name: "Machine Learning", value: 75, category: "IA", color: "#F9AB00" },
  { name: "Deep Learning", value: 65, category: "IA", color: "#FF6F00" },
  { name: "NLP", value: 60, category: "IA", color: "#0066FF" },
  { name: "Computer Vision", value: 58, category: "IA", color: "#4285F4" },
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredSkills = activeCategory === "Tous" 
    ? SKILLS 
    : SKILLS.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative bg-[#030614]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">02.</span> Compétences
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {SKILL_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 font-mono text-sm rounded-md transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.3)]"
                  : "bg-[#0A1128] text-gray-400 border border-white/5 hover:text-white hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0A1128] border border-white/5 p-4 rounded-lg hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-gray-200">{skill.name}</span>
                  <span className="font-mono text-sm" style={{ color: skill.color }}>{skill.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050B1F] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.value}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay: 0.2 + (index % 10) * 0.1 }}
                    className="h-full relative"
                    style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
