import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, GitBranch, X, ExternalLink, Layers3, Sparkles } from "lucide-react";
import { projects } from "../data/portfolio";

const filters = ["All", "Java", "Web", "ML"];

function Architecture({ stages }) {
  return <svg className="case-architecture" viewBox="0 0 600 118" role="img" aria-label={`Architecture flow: ${stages.join(", then ")}`}>
    <defs><linearGradient id="case-line" x1="0" x2="1"><stop stopColor="var(--color-accent)" /><stop offset="1" stopColor="var(--color-accent-secondary)" /></linearGradient></defs>
    {stages.map((stage, index) => {
      const x = 8 + index * (584 / stages.length);
      return <g key={stage}>
        {index < stages.length - 1 && <path d={`M ${x + 150} 58 H ${x + (584 / stages.length) - 10}`} stroke="url(#case-line)" strokeWidth="1.5" strokeDasharray="4 5" />}
        <rect x={x} y="28" width="142" height="60" rx="10" fill="var(--color-panel)" stroke="var(--color-border)" />
        <circle cx={x + 17} cy="48" r="3" fill="var(--color-accent)" />
        <text x={x + 16} y="69" fill="var(--color-text)" fontSize="11" fontFamily="JetBrains Mono, monospace">{stage}</text>
      </g>;
    })}
  </svg>;
}

function ProjectModal({ project, onClose }) {
  return <motion.div className="case-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.article className="case-modal" layoutId={`project-${project.id}`} role="dialog" aria-modal="true" aria-labelledby="case-title" onClick={(event) => event.stopPropagation()} initial={{ y: 22, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 15, scale: .98 }} transition={{ type: "spring", damping: 28, stiffness: 240 }}>
      <button className="case-close" onClick={onClose} aria-label="Close project details"><X size={19} /></button>
      <div className="case-modal-head"><span className="case-index">CASE STUDY / {project.category.toUpperCase()}</span><h2 id="case-title">{project.title}</h2><p>{project.summary}</p><div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      <div className="case-modal-body">
        <section><span className="dash-kicker">01 / PROBLEM</span><p>{project.problem}</p></section>
        <section><span className="dash-kicker">02 / APPROACH</span><p>{project.approach}</p></section>
        <section className="case-arch-section"><span className="dash-kicker"><Layers3 size={14} /> ARCHITECTURE</span><Architecture stages={project.architecture} /></section>
        <section className="case-shot-section"><span className="dash-kicker"><Sparkles size={14} /> SCREENSHOTS</span><div className="case-shot-placeholder">Screenshots not supplied yet</div></section>
        <section><span className="dash-kicker">03 / CHALLENGES</span><p>{project.challenges}</p></section>
        <section><span className="dash-kicker">04 / RESULTS</span><p>{project.results}</p></section>
      </div>
      <div className="case-modal-actions">
        {project.github ? <a href={project.github} target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub <ArrowUpRight size={14} /></a> : <span className="case-link-disabled"><GitBranch size={15} /> GitHub link not supplied</span>}
        {project.live ? <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Live project <ArrowUpRight size={14} /></a> : <span className="case-link-disabled"><ExternalLink size={15} /> Live link not supplied</span>}
      </div>
    </motion.article>
  </motion.div>;
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);
  const visible = useMemo(() => filter === "All" ? projects : projects.filter((project) => project.category === filter), [filter]);
  return <section className="wrap projects-section" id="projects">
    <div className="projects-heading"><div><p className="eyebrow">03 — Selected projects</p><h2>Built to be<br /><em>explored.</em></h2></div><p>Project details are presented as case studies. Open one to see its current information.</p></div>
    <div className="project-filters" aria-label="Filter projects">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <LayoutGroup>
      <motion.div className="project-grid" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => <motion.button className={`project-card${project.placeholder ? " project-placeholder" : ""}`} key={project.id} layoutId={`project-${project.id}`} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }} transition={{ duration: .32, delay: index * .04 }} onClick={() => setSelected(project)} onPointerMove={(event) => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 700 || (navigator.hardwareConcurrency || 8) <= 4) return;
            const box = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width;
            const y = (event.clientY - box.top) / box.height;
            event.currentTarget.style.setProperty("--spot-x", `${x * 100}%`);
            event.currentTarget.style.setProperty("--spot-y", `${y * 100}%`);
            event.currentTarget.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-3px)`;
          }} onPointerLeave={(event) => { event.currentTarget.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; }}>
            <div className="project-card-visual"><span className="project-card-number">0{projects.indexOf(project) + 1}</span><span className="project-orb" /><span className="project-card-mark">{project.placeholder ? "?" : project.category === "Java" ? "CV" : "♫"}</span></div>
            <div className="project-card-copy"><span className="case-index">{project.placeholder ? "DETAILS PENDING" : project.category.toUpperCase()}</span><h3>{project.title}</h3><p>{project.summary}</p><div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="project-card-open">OPEN CASE STUDY <ArrowUpRight size={15} /></span></div>
          </motion.button>)}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{selected && <ProjectModal key={selected.id} project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </LayoutGroup>
  </section>;
}
