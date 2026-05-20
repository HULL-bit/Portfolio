import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, MapPin, Mail, Github, Linkedin, Loader2, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#030614]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-4">
            <span className="text-[#00D4FF]">07.</span> Contact
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_10px_#00D4FF]"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Discutons de vos projets</h3>
            <p className="text-gray-400 mb-8 font-sans">
              Je suis actuellement à l'écoute de nouvelles opportunités (Stage, Alternance, CDI). 
              N'hésitez pas à me contacter pour échanger sur vos besoins en architecture distribuée, 
              développement d'entreprise ou administration système.
            </p>

            <div className="flex items-center gap-3 mb-8 bg-[#00FF88]/10 text-[#00FF88] px-4 py-3 rounded-md border border-[#00FF88]/20 w-max">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF88]"></span>
              </span>
              <span className="font-mono text-sm tracking-wide">Disponible</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-300 hover:text-[#00D4FF] transition-colors">
                <div className="w-12 h-12 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <a href="mailto:jaw.souleymane@etudiant.ucad.edu.sn" className="font-mono">
                  jaw.souleymane@etudiant.ucad.edu.sn
                </a>
              </div>
              
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 bg-[#0A1128] border border-white/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="font-mono">Dakar, Sénégal</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="bg-[#0A1128] p-8 rounded-xl border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">Nom</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#050B1F] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-[#050B1F] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">Message</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full bg-[#050B1F] border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all font-mono resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="w-full py-4 bg-[#0066FF] hover:bg-[#00D4FF] text-white font-bold font-mono tracking-widest rounded-md transition-all duration-300 flex justify-center items-center gap-2 hover:shadow-[0_0_20px_#00D4FF] disabled:opacity-70"
                >
                  {status === "idle" && <><Send size={18} /> Envoyer</>}
                  {status === "loading" && <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>}
                  {status === "success" && <><CheckCircle2 size={18} /> Message Envoyé</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
