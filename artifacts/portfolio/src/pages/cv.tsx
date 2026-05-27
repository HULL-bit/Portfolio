import { useEffect } from "react";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Mail, Phone, MapPin, Globe, Github, Linkedin } from "lucide-react";

const SKILLS_GROUPED = [
  { label: "Langages", items: ["C / C++", "C#", "Java", "Python", "PHP", "JavaScript", "Dart", "XML"] },
  { label: "Frameworks & Libs", items: ["Django", "React", "Next.js", "Flutter", "Spring", "JEE", "PrimeFaces", "Hibernate"] },
  { label: "Bases de données", items: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "Excel", "KoboToolbox"] },
  { label: "Systèmes & Réseaux", items: ["Linux", "Maintenance info.", "Réseaux", "Android", "Dépannage PC", "Installation OS"] },
  { label: "Modélisation & Data", items: ["UML", "BPMN", "Data Science", "Big Data (init.)", "SQL Analytics"] },
];

const EXPERIENCES = [
  {
    role: "Développeur Full-Stack",
    company: "ONG Wagadu Africa",
    location: "Kayar, Sénégal",
    period: "2024 – 2026",
    tasks: [
      "Conception et dev. d'une plateforme web et mobile de suivi des pirogues de pêche",
      "Géolocalisation temps réel et tableaux de bord analytiques",
      "Gestion des sorties en mer pour l'ONG",
      "Intégration API REST et base de données PostgreSQL",
    ],
    stack: "Django · React · Flutter · Dart · PostgreSQL · REST API",
  },
  {
    role: "Développeur – Application Gestion Multi-Magasins",
    company: "Groupement de Commercants",
    location: "Touba, Sénégal",
    period: "2025",
    tasks: [
      "Application web/mobile de gestion de boutiques et stocks",
      "Système multi-magasins avec inventaire temps réel",
      "Rapports de vente et alertes de rupture de stock",
      "Génération de rapports XML",
    ],
    stack: "Django · React · Flutter · MySQL · XML",
  },
  {
    role: "Développeur – Plateforme Complète de Gestion de Daara",
    company: "Institution Religieuse",
    location: "Touba, Sénégal",
    period: "2025 – 2026",
    tasks: [
      "Système complet de gestion : membres, finances, RH",
      "Calendrier culturel et conservatoire",
      "Interface web Django/React et application mobile Flutter",
      "Intégration Spring Boot et PostgreSQL",
    ],
    stack: "Django · React · Next.js · Flutter · Spring · PostgreSQL",
  },
];

const EDUCATION = [
  {
    degree: "Master 1 – Systèmes d'Information Répartis (SIR)",
    school: "UCAD · Dept. Mathématiques-Informatique",
    dept: "Section Informatique · Dakar",
    period: "2025 – En cours",
    badge: "EN COURS",
  },
  {
    degree: "Licence – Informatique",
    school: "UCAD · Dept. Mathématiques-Informatique",
    dept: "Dakar",
    period: "2022 – 2025",
    badge: "TERMINÉ",
  },
  {
    degree: "Baccalauréat – Série S",
    school: "Lycée de Mbacké",
    dept: "Touba / Mbacké",
    period: "2022",
    badge: "ASSEZ BIEN",
  },
];

const CERTIF = [
  "Voyages & découvertes",
  "Recherche documentaire",
  "Musique",
  "Innovation numérique",
];

const PROJECTS_HIGHLIGHT = [
  { name: "Architecture Microservices - Gestion Distribuée Entreprise", tech: "Spring Boot · Docker · RabbitMQ · PostgreSQL · React" },
  { name: "Tracking Pirogues de Pêche – ONG Wagadu Africa", tech: "Django · React · Flutter · PostgreSQL · REST API" },
  { name: "Application Gestion Multi-Magasins", tech: "Django · React · Flutter · MySQL · XML" },
  { name: "Plateforme Complète de Gestion de Daara", tech: "Django · React · Next.js · Flutter · Spring · PostgreSQL" },
  { name: "Marketplace Pièces Détachées", tech: "Spring Boot · PrimeFaces · MySQL · JPA/Hibernate" },
  { name: "Gestion et Localisation de Services", tech: "Spring Boot · React · PostgreSQL · Maps API" },
];

export default function CVPage() {
  useEffect(() => {
    document.title = "CV — Souleymane DIAW";
  }, []);

  const handlePrint = () => window.print();

  const goBack = () => {
    window.location.href = import.meta.env.BASE_URL || "/";
  };

  return (
    <>
      {/* Print / No-print action bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#050B1F] border-b border-[#00D4FF]/20 backdrop-blur-xl">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#00D4FF] transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au portfolio
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Fichier → Imprimer → Enregistrer en PDF</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0055DD] text-white text-sm font-mono font-bold rounded-lg transition-colors"
          >
            <Printer size={15} />
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* CV Document */}
      <div className="no-print pt-14" />
      <div id="cv-document" className="cv-page font-sans text-[#1a1a2e] bg-white min-h-screen">

        {/* === HEADER === */}
        <header className="cv-header px-10 pt-10 pb-6 border-b-2 border-[#0066FF]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="cv-name text-4xl font-black tracking-tight text-[#050B1F]">
                Souleymane DIAW
              </h1>
              <p className="cv-title text-lg font-semibold text-[#0066FF] mt-1 tracking-wide">
                Étudiant Master 1 SIR · Développeur Full-Stack · Data Science
              </p>
              <p className="text-sm text-gray-500 mt-1 font-mono">
                UCAD · Département MPI · Section Informatique · Dakar, Sénégal
              </p>
            </div>
            {/* Initials badge */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black font-mono flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0066FF, #00D4FF)" }}
            >
              SD
            </div>
          </div>

          {/* Contact row */}
          <div className="mt-5 flex flex-wrap gap-5 text-xs text-gray-600 font-mono">
            {[
              { icon: <Mail size={11} />, text: "souleymane9.diaw@ucad.edu.sn" },
              { icon: <Phone size={11} />, text: "+221 77 842 73 60" },
              { icon: <MapPin size={11} />, text: "Dakar, Sénégal" },
              { icon: <Github size={11} />, text: "github.com/HULL-bit" },
              { icon: <Linkedin size={11} />, text: "linkedin.com/in/souleymane-diaw-824a8029b" },
            ].map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-[#0066FF]">{c.icon}</span>
                {c.text}
              </span>
            ))}
          </div>
        </header>

        <div className="cv-body px-10 py-6 grid grid-cols-3 gap-8">

          {/* ===== LEFT COLUMN (2/3) ===== */}
          <div className="col-span-2 space-y-6">

            {/* Profile summary */}
            <section>
              <h2 className="cv-section-title">Profil</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Étudiant en Master 1 Systèmes d'Information Répartis (SIR) à l'Université Cheikh Anta Diop de Dakar (UCAD), 
                Département Math-Info Section Informatique. Passionné par le développement full-stack, mobile et la data science. 
                Fort de trois projets déployés pour une ONG et des groupements de commerçants, je propose des solutions numériques 
                robustes à fort impact social en maîtrisant l'ensemble du cycle de développement logiciel, de la conception à la 
                mise en production.
              </p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="cv-section-title">Expériences Professionnelles</h2>
              <div className="space-y-5">
                {EXPERIENCES.map((exp, i) => (
                  <div key={i} className="cv-exp-item">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm text-[#050B1F]">{exp.role}</h3>
                      <span className="text-xs font-mono text-[#0066FF] whitespace-nowrap ml-4">{exp.period}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      {exp.company} · {exp.location}
                    </p>
                    <ul className="space-y-1">
                      {exp.tasks.map((t, j) => (
                        <li key={j} className="text-xs text-gray-700 flex gap-2">
                          <span className="text-[#0066FF] mt-0.5 flex-shrink-0">▸</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[10px] font-mono text-[#00D4FF] mt-2 bg-[#0066FF]/5 px-2 py-1 rounded">
                      {exp.stack}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Projects */}
            <section>
              <h2 className="cv-section-title">Projets Sélectionnés (20+ au total)</h2>
              <div className="grid grid-cols-2 gap-2">
                {PROJECTS_HIGHLIGHT.map((p, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    <p className="font-semibold text-[10px] text-[#050B1F] leading-tight">{p.name}</p>
                    <p className="text-[9px] font-mono text-[#0066FF] mt-1">{p.tech}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ===== RIGHT COLUMN (1/3) ===== */}
          <div className="col-span-1 space-y-6">

            {/* Education */}
            <section>
              <h2 className="cv-section-title">Formation</h2>
              <div className="space-y-4">
                {EDUCATION.map((e, i) => (
                  <div key={i} className="border-l-2 border-[#0066FF] pl-3">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-bold text-[11px] text-[#050B1F] leading-tight">{e.degree}</p>
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0"
                        style={{
                          background: e.badge === "EN COURS" ? "#00FF8820" : "#0066FF15",
                          color: e.badge === "EN COURS" ? "#00AA55" : "#0066FF",
                          border: `1px solid ${e.badge === "EN COURS" ? "#00FF8840" : "#0066FF30"}`,
                        }}
                      >
                        {e.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{e.school}</p>
                    {e.dept && <p className="text-[9px] text-gray-400">{e.dept}</p>}
                    <p className="text-[9px] font-mono text-[#0066FF] mt-0.5">{e.period}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="cv-section-title">Compétences Techniques</h2>
              <div className="space-y-3">
                {SKILLS_GROUPED.map((g, i) => (
                  <div key={i}>
                    <p className="text-[9px] font-mono font-bold text-[#0066FF] uppercase tracking-widest mb-1">{g.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {g.items.map((s, j) => (
                        <span key={j} className="text-[9px] px-1.5 py-0.5 bg-[#0066FF]/8 text-[#050B1F] border border-[#0066FF]/15 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="cv-section-title">Certifications</h2>
              <ul className="space-y-1.5">
                {CERTIF.map((c, i) => (
                  <li key={i} className="text-[10px] text-gray-700 flex gap-2 items-start">
                    <span className="text-[#0066FF] flex-shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            {/* Langues */}
            <section>
              <h2 className="cv-section-title">Langues</h2>
              {[
                { lang: "Français", level: "Courant", pct: 95 },
                { lang: "Anglais", level: "Intermédiaire", pct: 60 },
                { lang: "Wolof", level: "Langue maternelle", pct: 100 },
                { lang: "Arabe", level: "Notions", pct: 25 },
              ].map((l, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-semibold text-[#050B1F]">{l.lang}</span>
                    <span className="text-gray-500">{l.level}</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${l.pct}%`, background: "linear-gradient(90deg, #0066FF, #00D4FF)" }}
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Centres d'intérêt */}
            <section>
              <h2 className="cv-section-title">Centres d'intérêt</h2>
              <p className="text-[10px] text-gray-600">
                Voyages & découvertes · Recherche documentaire · Musique · Innovation numérique
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="cv-footer px-10 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[9px] font-mono text-gray-400">
            Souleymane DIAW · UCAD · M1 SIR 2025
          </p>
          <p className="text-[9px] font-mono text-gray-400">
            souleymane9.diaw@ucad.edu.sn · +221 77 842 73 60
          </p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        body { margin: 0; background: #f5f6fa; }

        #cv-document {
          font-family: 'Inter', sans-serif;
          max-width: 850px;
          margin: 0 auto;
          box-shadow: 0 4px 60px rgba(0,0,0,0.12);
        }

        .cv-name { font-family: 'Inter', sans-serif; }

        .cv-section-title {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0066FF;
          border-bottom: 1px solid #0066FF22;
          padding-bottom: 4px;
          margin-bottom: 10px;
        }

        .cv-exp-item {
          padding-bottom: 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        .cv-exp-item:last-child { border-bottom: none; }

        @media print {
          body { background: white !important; margin: 0 !important; }
          .no-print { display: none !important; }
          #cv-document {
            max-width: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          .cv-page {
            width: 210mm;
            min-height: 297mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}
