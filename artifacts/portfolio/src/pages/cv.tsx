import { useEffect } from "react";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Mail, Phone, MapPin, Globe, Github, Linkedin } from "lucide-react";

const SKILLS_GROUPED = [
  { label: "Langages", items: ["C / C++", "C# / .NET", "Java / JEE", "Python", "SQL / PL-SQL", "PHP", "JavaScript", "Flutter / Dart"] },
  { label: "Bases de données", items: ["SQL Server (DBA)", "Oracle 19c (DBA)", "PostgreSQL", "MySQL", "MongoDB"] },
  { label: "Frameworks", items: ["ASP.NET Core", "Spring Boot", "Java EE / PrimeFaces", "Entity Framework", "WPF / WinForms", "FastAPI"] },
  { label: "Systèmes & Réseaux", items: ["Linux Admin", "Bash / Shell", "Active Directory", "TCP/IP", "VMware / VirtualBox"] },
  { label: "Big Data & IA", items: ["Hadoop / HDFS", "Apache Spark", "Scikit-learn", "TensorFlow", "Pandas / NumPy"] },
  { label: "Outils & Méthodes", items: ["Git / GitHub", "UML 2.0 / Merise", "Docker", "Swagger / REST", "Agile / Scrum"] },
];

const EXPERIENCES = [
  {
    role: "Développeur Full Stack",
    company: "Wagadu Africa / ALMADE 2",
    location: "Dakar, Sénégal",
    period: "2023 – 2024",
    tasks: [
      "Développement de la plateforme Blue-Track.net pour le suivi GPS des pirogues artisanales à Kayar",
      "Système d'alertes et de secours maritime en temps réel pour sécuriser les pêcheurs",
      "Interface de monitoring pour les autorités maritimes avec intégration cartographique",
      "API REST de communication avec balises GPS embarquées",
    ],
    stack: "React · Node.js · API REST · GPS/Cartographie",
  },
  {
    role: "Développeur Backend Java EE",
    company: "Entreprise privée",
    location: "Dakar, Sénégal",
    period: "2023",
    tasks: [
      "Développement d'applications d'entreprise avec Java EE et PrimeFaces (JSF)",
      "Conception et optimisation de bases de données Oracle 19c",
      "Mise en place d'API REST avec Spring Boot",
      "Modélisation UML et rédaction de documentation technique",
    ],
    stack: "Java EE · PrimeFaces · Oracle · Spring Boot · JPA/Hibernate",
  },
  {
    role: "Développeur .NET / C#",
    company: "Structure privée",
    location: "Dakar, Sénégal",
    period: "2022 – 2023",
    tasks: [
      "Développement d'applications desktop avec WPF et MVVM pattern en C#",
      "Systèmes de gestion avec Entity Framework Core et SQL Server",
      "Génération de rapports Crystal Reports, export PDF / Excel",
      "Administration de bases de données SQL Server",
    ],
    stack: "C# · ASP.NET Core · WPF · Entity Framework · SQL Server",
  },
  {
    role: "Technicien Maintenance Informatique",
    company: "BDM TECH",
    location: "Dakar, Sénégal",
    period: "2021 – 2022",
    tasks: [
      "Maintenance préventive et corrective du parc informatique",
      "Installation et configuration d'OS (Windows, Linux), support utilisateurs N1/N2",
      "Configuration réseaux LAN/WAN, routeurs et switches Cisco",
      "Déploiement d'Active Directory et gestion des partages réseau",
    ],
    stack: "Windows Server · Active Directory · Cisco · TCP/IP · Helpdesk",
  },
];

const EDUCATION = [
  {
    degree: "Master 1 — Systèmes d'Information Répartie (SIR)",
    school: "UCAD — Université Cheikh Anta Diop de Dakar",
    dept: "Département MPI — Section Informatique",
    period: "2024 – 2025",
    badge: "EN COURS",
  },
  {
    degree: "Licence Informatique",
    school: "FST / ESP — UCAD, Dakar",
    dept: "",
    period: "2021 – 2024",
    badge: "TRÈS BIEN",
  },
  {
    degree: "Baccalauréat Série S",
    school: "Lycée de Mbacké",
    dept: "",
    period: "2022",
    badge: "ASSEZ BIEN",
  },
];

const CERTIF = [
  "AZ-900 Azure Fundamentals (Microsoft)",
  "70-462 SQL Server Administration (Microsoft)",
  "Oracle Database SQL Certified",
  "CCNA Routing & Switching (Cisco)",
  "Linux Essentials — LPI",
  "Big Data Specialization (Coursera)",
  "Python for Data Science (Coursera)",
];

const PROJECTS_HIGHLIGHT = [
  { name: "Système de Gestion Distribué (Mémoire M1)", tech: "Spring Boot · Docker · RabbitMQ · PostgreSQL · React" },
  { name: "Blue-Track — Suivi GPS pirogues artisanales", tech: "React · Node.js · GPS · API REST" },
  { name: "Plateforme de Gestion Universitaire (JEE)", tech: "Java EE · PrimeFaces · Oracle · WildFly" },
  { name: "Système de Réservation Hôtel (Microservices)", tech: "Spring Cloud · Eureka · Docker · RabbitMQ" },
  { name: "Entrepôt de Données (DWH)", tech: "SQL Server · SSAS · SSIS · SSRS · Power BI" },
  { name: "Infrastructure Serveur Linux Multi-services", tech: "Ubuntu · Nginx · Bind9 · OpenVPN · iptables" },
  { name: "Application Mobile — Gestion Daara (Flutter)", tech: "Flutter · Dart · Firebase" },
  { name: "Calcul Parallèle MPI + OpenMP", tech: "C · C++ · MPI · OpenMP · Linux HPC" },
];

export default function CVPage() {
  useEffect(() => {
    document.title = "CV — Souleymane JAW";
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
                Souleymane JAW
              </h1>
              <p className="cv-title text-lg font-semibold text-[#0066FF] mt-1 tracking-wide">
                Étudiant Master 1 SIR · Développeur Full Stack Enterprise · DBA
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
              SJ
            </div>
          </div>

          {/* Contact row */}
          <div className="mt-5 flex flex-wrap gap-5 text-xs text-gray-600 font-mono">
            {[
              { icon: <Mail size={11} />, text: "jaw.souleymane@etudiant.ucad.edu.sn" },
              { icon: <MapPin size={11} />, text: "Dakar, Sénégal" },
              { icon: <Globe size={11} />, text: "portfolio.hull-bit.dev" },
              { icon: <Github size={11} />, text: "github.com/souleymane-jaw" },
              { icon: <Linkedin size={11} />, text: "linkedin.com/in/souleymane-jaw" },
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
                Étudiant en Master 1 Systèmes d'Information Répartie (SIR) à l'Université Cheikh Anta Diop de Dakar (UCAD), 
                département Mathématiques et Physique · Informatique (MPI). Fort de 4 ans d'expérience pratique, 
                je conçois et déploie des architectures distribuées, des applications enterprise Java EE / .NET / Spring, 
                et j'assure l'administration de bases de données Oracle et SQL Server en production. 
                Passionné par les systèmes distribués, le Big Data et l'Intelligence Artificielle, 
                je cherche à contribuer à des projets innovants à fort impact technologique.
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
                { lang: "Français", level: "Courant (C1)", pct: 90 },
                { lang: "Anglais", level: "Intermédiaire (B2)", pct: 65 },
                { lang: "Wolof", level: "Langue maternelle", pct: 100 },
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

            {/* Soft skills */}
            <section>
              <h2 className="cv-section-title">Soft Skills</h2>
              <div className="flex flex-wrap gap-1">
                {["Leadership", "Travail en équipe", "Résolution de problèmes", "Curiosité intellectuelle", "Rigueur", "Adaptabilité", "Communication"].map((s, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#FFB800]/10 text-[#8B6500] border border-[#FFB800]/20 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {/* Intérêts */}
            <section>
              <h2 className="cv-section-title">Centres d'intérêt</h2>
              <p className="text-[10px] text-gray-600">
                Open Source · Innovation Africaine Tech · Intelligence Artificielle · Architecture Systèmes ·
                Compétitions de Programmation · Mentorat Informatique
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="cv-footer px-10 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[9px] font-mono text-gray-400">
            Souleymane JAW · UCAD MPI · M1 SIR 2024/2025
          </p>
          <p className="text-[9px] font-mono text-gray-400">
            Disponible pour stage · alternance · CDI · Dakar & international
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
