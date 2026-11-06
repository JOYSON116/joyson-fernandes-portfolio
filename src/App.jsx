import { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Menu,
  X,
  Terminal,
  Command,
  Search,
  ChevronRight,
  Copy,
  FileText,
  Send,
} from "lucide-react";
import { profile, skills, certifications } from "./data/portfolio";
import GithubActivity from "./components/GithubActivity";
import AboutDashboard from "./components/AboutDashboard";
import ProjectsSection from "./components/ProjectsSection";
import TypeName from "./components/TypeName";
import IntroLoader from "./components/IntroLoader";
import { Sun, Moon, Palette, BriefcaseBusiness, Sparkles } from "lucide-react";
import CustomCursor from "./components/CustomCursor";
import NotFound from "./components/NotFound";
const TerminalWidget = lazy(() => import("./components/TerminalWidget"));
const InteractiveSkills = lazy(() => import("./components/InteractiveSkills"));
const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
    <ArrowUpRight size={15} />
  </a>
);
function Magnetic({ children, className = "", ...props }) {
  const ref = useRef(null);
  const move = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 700 || (navigator.hardwareConcurrency || 8) <= 4) return;
    const box = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .12}px, ${(event.clientY - box.top - box.height / 2) * .12}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0, 0)"; };
  return (
    <a ref={ref} className={className} onPointerMove={move} onPointerLeave={reset} {...props}>
      {children}
    </a>
  );
}
function App() {
  const [menu, setMenu] = useState(false),
    [booting, setBooting] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    [active, setActive] = useState("top"),
    [palette, setPalette] = useState(false),
    [query, setQuery] = useState(""),
    [skill, setSkill] = useState("C++"),
    [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "neon"),
    [indiaTime, setIndiaTime] = useState(""),
    [roleIndex, setRoleIndex] = useState(0),
    [typedRole, setTypedRole] = useState(""),
    [glitch, setGlitch] = useState(false),
    [terminalOpen, setTerminalOpen] = useState(false),
    [recruiterMode, setRecruiterMode] = useState(false),
    [toast, setToast] = useState(""),
    [matrix, setMatrix] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [contactState, setContactState] = useState({ kind: "", message: "" });
  const [copied, setCopied] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const heroRef = useRef(null);
  const commandsRef = useRef([]);
  const paletteIndexRef = useRef(0);
  const paletteOpenRef = useRef(false);
  const roles = ["Information Science Student", "Problem Solver", "Aspiring Developer"];
  const lowMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth <= 700 || (navigator.hardwareConcurrency || 8) <= 4;
  const completeLoader = () => setBooting(false);
  const nav = ["About", "Education", "Skills", "Projects", "Learning", "Profiles", "Contact"];
  const isPortfolioPath = window.location.pathname === "/" || window.location.pathname === "/index.html";
  useEffect(() => {
    if (!booting) return;
    const started = Date.now();
    const timer = window.setTimeout(() => setBooting(false), 2100);
    const skip = (event) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        if (Date.now() - started > 250) setBooting(false);
      }
    };
    window.addEventListener("keydown", skip);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", skip); };
  }, [booting]);
  useEffect(() => {
    const updateTime = () => setIndiaTime(new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (lowMotion) { setTypedRole(roles[0]); return; }
    let cancelled = false;
    const current = roles[roleIndex];
    let index = 0;
    setTypedRole("");
    let timer = window.setTimeout(function type() {
      if (cancelled) return;
      index += 1;
      setTypedRole(current.slice(0, index));
      if (index < current.length) timer = window.setTimeout(type, 55);
      else timer = window.setTimeout(() => { if (!cancelled) setRoleIndex((roleIndex + 1) % roles.length); }, 1550);
    }, 450);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [roleIndex, lowMotion]);
  useEffect(() => {
    if (lowMotion) return;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.querySelector(".scroll-progress")?.style.setProperty("transform", `scaleX(${scrollable ? window.scrollY / scrollable : 0})`);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [lowMotion]);
  useEffect(() => {
    if (lowMotion) return;
    let frame;
    const parallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        document.documentElement.style.setProperty("--page-parallax", `${Math.min(y * -.035, 0)}px`);
        document.documentElement.style.setProperty("--hero-parallax", `${Math.max(-22, -y * .06)}px`);
      });
    };
    window.addEventListener("scroll", parallax, { passive: true });
    parallax();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", parallax); document.documentElement.style.removeProperty("--page-parallax"); document.documentElement.style.removeProperty("--hero-parallax"); };
  }, [lowMotion]);
  useEffect(() => {
    document.documentElement.classList.toggle("recruiter-mode", recruiterMode);
  }, [recruiterMode]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!resumeOpen) return;
    const close = (event) => { if (event.key === "Escape") setResumeOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [resumeOpen]);
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const reveals = document.querySelectorAll("main section, .experiment-card, .skill-grid article, .timeline article, .contact-terminal");
    reveals.forEach((el) => el.classList.add("reveal"));
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));
    const ids = [
      "top",
      "about",
      "education",
      "skills",
      "projects",
      "learning",
      "profiles",
      "contact",
    ];
    const observer = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -55%" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let sequenceIndex = 0;
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      sequenceIndex = e.key === sequence[sequenceIndex] ? sequenceIndex + 1 : e.key === sequence[0] ? 1 : 0;
      if (sequenceIndex === sequence.length) { sequenceIndex = 0; setToast("Konami code unlocked"); setMatrix(true); window.setTimeout(() => setMatrix(false), 4500); }
      if (paletteOpenRef.current && e.key === "ArrowDown") { e.preventDefault(); setPaletteIndex((index) => (index + 1) % Math.max(commandsRef.current.length, 1)); }
      if (paletteOpenRef.current && e.key === "ArrowUp") { e.preventDefault(); setPaletteIndex((index) => (index - 1 + Math.max(commandsRef.current.length, 1)) % Math.max(commandsRef.current.length, 1)); }
      if (paletteOpenRef.current && e.key === "Enter") { e.preventDefault(); const item = commandsRef.current[paletteIndexRef.current]; if (item) { setPalette(false); if (item[1].startsWith("http") || item[1] === "/resume.pdf") window.open(item[1], "_blank", "noopener,noreferrer"); else document.getElementById(item[1])?.scrollIntoView(); } }
      if (e.key === "Escape") {
        setPalette(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      revealObserver.disconnect();
      document.documentElement.classList.remove("reveal-ready");
      observer.disconnect();
      window.removeEventListener("keydown", key);
    };
  }, []);
  const commands = [
    ["Go Home", "top"],
    ...nav.map((x) => [x, x.toLowerCase()]),
    ["GitHub", profile.github],
    ["LeetCode", profile.leetcode],
    ["GeeksforGeeks", profile.gfg],
    ["Resume", "/resume.pdf"],
    ["Contact", "contact"],
  ].filter((x) => x[0].toLowerCase().includes(query.toLowerCase()));
  commandsRef.current = commands;
  paletteIndexRef.current = paletteIndex;
  paletteOpenRef.current = palette;
  const go = (target) => {
    setPalette(false);
    if (target.startsWith("http")) window.open(target, "_blank");
    else if (target === "/resume.pdf") setResumeOpen(true);
    else document.getElementById(target)?.scrollIntoView();
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setToast("Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setToast("Copy unavailable — use the email link");
    }
  };
  const sendContact = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setContactState({ kind: "error", message: "Please complete each field." });
      return;
    }
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setContactState({ kind: "success", message: "Your email app should open with the message ready to send." });
    form.reset();
  };
  if (!isPortfolioPath) return <NotFound />;
  return (
    <>
      <CustomCursor />
      {matrix && <div className="matrix-overlay" aria-hidden="true">{Array.from({ length: 15 }, (_, index) => <span key={index} style={{ "--column": index, "--duration": `${1.3 + (index % 5) * .38}s` }}>{Array.from({ length: 20 }, (_, char) => String.fromCharCode(0x30a0 + ((char * 17 + index * 23) % 96))).join("")}</span>)}</div>}
      {booting && <IntroLoader onComplete={completeLoader} />}
      <div className="scroll-progress" aria-hidden="true" />
      <header className={active !== "top" ? "scrolled" : ""}>
        <a className="brand" href="#top">
          Joyson Fernandes<span>.</span>
        </a>
        <nav>
          {nav.map((n) => (
            <a
              className={active === n.toLowerCase() ? "active" : ""}
              key={n}
              href={"#" + n.toLowerCase()}
            >
              {n}
            </a>
          ))}
          <button
            className="command-trigger"
            onClick={() => setPalette(true)}
            aria-label="Open command palette"
          >
            <Command size={14} />
            <span>⌘K</span>
          </button>
          <a className="nav-resume" href="/resume.pdf" download="Joyson-Fernandes-Resume.pdf">
            Resume
          </a>
        </nav>
        <button
          className="menu"
          aria-label="Toggle menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        {menu && (
          <div className="mobile-nav">
            {nav.map((n) => (
              <a
                onClick={() => setMenu(false)}
                key={n}
                href={"#" + n.toLowerCase()}
              >
                {n}
              </a>
            ))}
          </div>
        )}
      </header>
      <div className="status-bar wrap" role="region" aria-label="Portfolio status">
        <span className="status-time"><span className="status-label">LOCAL TIME</span><b>{indiaTime}</b><span className="status-zone">IST</span></span>
        <span className="status-open"><i />OPEN TO OPPORTUNITIES</span>
        <button className="theme-switch" onClick={() => setTheme(theme === "neon" ? "violet" : theme === "violet" ? "light" : "neon")} aria-label={`Switch theme; current theme ${theme}`} title={`Theme: ${theme}`}>
          {theme === "light" ? <Sun size={14} /> : theme === "violet" ? <Palette size={14} /> : <Moon size={14} />}<span>{theme.toUpperCase()}</span>
        </button>
        <button className={`recruiter-toggle${recruiterMode ? " active" : ""}`} onClick={() => setRecruiterMode((value) => !value)} aria-pressed={recruiterMode}><BriefcaseBusiness size={13} /><span>{recruiterMode ? "RECRUITER ON" : "RECRUITER MODE"}</span></button>
      </div>
      <main id="top" data-theme={theme}>
        {recruiterMode && <section className="recruiter-summary wrap" aria-label="Recruiter summary"><div className="recruiter-top"><div><p className="eyebrow">QUICK PROFILE / INDIA</p><h1>{profile.name}</h1><p>{profile.role} · {profile.location}</p></div><a className="button light" href="/resume.pdf" target="_blank" rel="noreferrer">Download resume <ArrowUpRight size={15} /></a></div><div className="recruiter-columns"><article><span>SKILLS</span><p>{skills.flatMap(([, items]) => items).join(" · ")}</p></article><article><span>PROJECTS</span>{["Real-time Face Recognition", "Spotify Clone", "Project 03 · details pending"].map((name) => <a href="#projects" key={name}>{name}<ArrowUpRight size={13} /></a>)}</article><article><span>EDUCATION</span><p>Information Science &amp; Engineering<br />MITE · VTU · CGPA 9.55</p></article><article><span>CONTACT</span><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a></article></div><p className="recruiter-note">Compact summary view · Toggle Recruiter Mode to return</p></section>}
        <section className={`hero wrap${lowMotion ? " hero-static" : ""}`} ref={heroRef} onPointerMove={(event) => {
          if (lowMotion) return;
          const box = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--pointer-x", `${(event.clientX - box.left) / box.width * 100}%`);
          event.currentTarget.style.setProperty("--pointer-y", `${(event.clientY - box.top) / box.height * 100}%`);
        }}>
          <div>
            <p className="eyebrow">
              <i /> {profile.role}
            </p>
            <h1>
              Hi, I’m
              <br />
              <em onMouseEnter={() => { if (!lowMotion) setGlitch(true); }} onMouseLeave={() => setGlitch(false)} className={glitch ? "name-glitch" : ""}>
                <TypeName />
              </em>
            </h1>
            <p className="intro">I’m an Information Science and Engineering student interested in programming, problem solving, and learning how software is built.</p>
            <div className="actions">
              <Magnetic className="button light" href="#education">
                About my studies <ArrowRight size={17} />
              </Magnetic>
              <Magnetic className="button" href="#skills">
                View skills <Code2 size={16} />
              </Magnetic>
            </div>
            <div className="hero-role" aria-live="polite"><span className="role-prompt">//</span><span>{typedRole}<i /></span></div>
            {!lowMotion && <div className="hero-floaties" aria-hidden="true"><span> C++</span><span>Java</span><span>Py</span><span>React</span></div>}
            <div className="socials">
              <Link href={profile.github}>GitHub</Link>
              <Link href={profile.linkedin}>LinkedIn</Link>
              <Link href={profile.leetcode}>LeetCode</Link>
              <Link href={profile.gfg}>GeeksforGeeks</Link>
            </div>
          </div>
          <div className="hero-terminal" aria-label="Code editor illustration">
            <div className="terminal-bar">
              <span />
              <span />
              <span />
              <code>profile.js</code>
            </div>
            <pre>
              <span className="code-muted">01</span> <span className="code-purple">const</span> student = {"{"}<br />
              <span className="code-muted">02</span>   field: <span className="code-cyan">"Information Science"</span>,<br />
              <span className="code-muted">03</span>   languages: [<span className="code-cyan">"C++"</span>, <span className="code-cyan">"Java"</span>, <span className="code-cyan">"Python"</span>],<br />
              <span className="code-muted">04</span>   interests: [<span className="code-cyan">"DSA"</span>, <span className="code-cyan">"software"</span>],<br />
              <span className="code-muted">05</span>   status: <span className="code-cyan">"learning"</span><br />
              <span className="code-muted">06</span> {"}"};<span className="terminal-cursor">▍</span>
            </pre>
            <p>
              <i /> AVAILABLE FOR OPPORTUNITIES
            </p>
          </div>
        </section>
        <section id="about" className="wrap dashboard-section">
          <div className="dashboard-heading"><div><p className="eyebrow">01 — About</p><h2>A little more<br /><em>about me.</em></h2></div><p>One place for the details, tools, and learning journey behind the work.</p></div>
          <AboutDashboard />
        </section>
        <section id="education" className="wrap journey-section">
          <div className="journey-heading"><p className="eyebrow">02 — Journey</p><h2>Learning as<br /><em>I go.</em></h2></div>
          <div className="journey-columns">
            <div className="journey-track">
              <p className="journey-label">EDUCATION</p>
              <article className="journey-entry"><span className="journey-dot" /><small>2024 — PRESENT</small><h3>Information Science &amp; Engineering</h3><p>Bachelor of Engineering · MITE, Mangalore · VTU</p><b>CGPA 9.55</b></article>
              <p className="journey-label journey-label-next">CURRENT FOCUS</p>
              {skills.find(([title]) => title === "Currently learning")?.[1].map((item) => <article className="journey-entry compact" key={item}><span className="journey-dot" /><small>IN PROGRESS</small><h3>{item}</h3></article>)}
            </div>
            <div className="journey-certs"><p className="journey-label">CERTIFICATIONS</p>
              {certifications.map(([title, issuer, date, id]) => <article className="cert-row" key={id}><span className="cert-mark"><Code2 size={15} /></span><div><h3>{title}</h3><p>{issuer} · {date}</p></div><a href={`https://www.coursera.org/account/accomplishments/certificate/${id}`} target="_blank" rel="noreferrer">VERIFY <ArrowUpRight size={13} /></a></article>)}
            </div>
          </div>
        </section>
        <section id="skills" className="wrap">
          <div>
            <p className="eyebrow">04 — Skills</p>
            <h2>
              A deliberate
              <br />
              <em>toolkit.</em>
            </h2>
          </div>
          <div className="skill-experience">
            <Suspense fallback={<div className="skills-loading">Preparing skills visualization…</div>}><InteractiveSkills /></Suspense>
            <div className="skill-grid">
              {skills.map(([title, items, desc], i) => (
                <article key={title}>
                  <span className="skill-num">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <ul>
                    {items.map((s) => (
                      <li
                        className={skill === s ? "selected" : ""}
                        onClick={() => setSkill(s)}
                        role="button"
                        tabIndex="0"
                        onKeyDown={(e) => e.key === "Enter" && setSkill(s)}
                        key={s}
                      >
                        <Code2 size={15} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <aside className="skill-detail">
              <p className="eyebrow">Selected skill</p>
              <h3>{skill}</h3>
              <p>
                {skill === "C++"
                    ? "Programming language used for DSA and problem solving."
                    : skill === "Python"
                      ? "Programming language in Joyson’s foundational toolkit."
                      : skill === "C"
                        ? "Programming language in Joyson’s foundational toolkit."
                        : skill === "GitHub"
                          ? "A place to version and share work."
                          : "Part of Joyson’s current software learning journey."}
              </p>
            </aside>
          </div>
        </section>
        <ProjectsSection />
        <section id="learning" className="wrap learning-section">
          <div>
            <p className="eyebrow">05 — Currently learning</p>
            <h2>
              Areas I’m
              <br />
              <em>exploring.</em>
            </h2>
          </div>
          <div className="learning-list">{["Full-Stack Web Development", "MySQL", "MongoDB"].map((item, i) => <article key={item}><span>0{i+1}</span><h3>{item}</h3><small>Currently learning</small></article>)}</div>
        </section>
        <section className="activity">
          <div className="wrap" id="profiles">
            <div>
              <p className="eyebrow">06 — Profiles</p>
              <h2>
                Where I<br />
                <em>build.</em>
              </h2>
            </div>
            <div className="profiles">
              {[
                ["GitHub", profile.github, "Code, versioned."],
                ["LeetCode", profile.leetcode, "Problems, explored."],
                ["GeeksforGeeks", profile.gfg, "Concepts, practiced."],
              ].map(([n, u, d]) => (
                <a href={u} target="_blank" rel="noreferrer" key={n}>
                  <Terminal size={20} />
                  <h3>{n}</h3>
                  <p>{d}</p>
                  <ArrowUpRight />
                </a>
              ))}
              <GithubActivity />
            </div>
          </div>
        </section>
        <section id="contact" className="contact">
          <div className="wrap">
            <div>
              <p className="eyebrow">07 — Contact</p>
              <h2>
                Let’s build
                <br />
                <em>something.</em>
              </h2>
              <a className="email" href={"mailto:" + profile.email}>
                {profile.email}
                <ArrowUpRight />
              </a>
              <div className="contact-utility-actions"><button type="button" onClick={copyEmail}><Copy size={14} />{copied ? "COPIED" : "COPY EMAIL"}</button><button type="button" onClick={() => setResumeOpen(true)}><FileText size={14} />PREVIEW RESUME</button><a href="/resume.pdf" download="Joyson-Fernandes-Resume.pdf"><ArrowUpRight size={14} />DOWNLOAD RESUME</a></div>
              <div className="contact-links">
                <Link href={profile.linkedin}>LinkedIn</Link>
                <Link href={profile.github}>GitHub</Link>
              </div>
            </div>
            <form className="contact-form" onSubmit={sendContact}>
              <span className="contact-form-prompt"><i /> joyson@portfolio:~$ compose</span>
              <p>Write a message to start a conversation.</p>
              <label>Name<input name="name" autoComplete="name" required minLength={2} placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
              <label>Message<textarea name="message" required minLength={10} placeholder="What would you like to discuss?" /></label>
              <button className="button light" type="submit">Prepare email <Send size={15} /></button>
              <small>Opens your email app with the message prefilled. It is sent only when you choose to send it.</small>
              {contactState.message && <p className={`contact-state ${contactState.kind}`} role="status">{contactState.message}</p>}
            </form>
          </div>
        </section>
      </main>
      <footer className="wrap">
        <span>© {new Date().getFullYear()} Joyson Fernandes</span>
        <span>Made with curiosity in India.</span>
      </footer>
      {palette && (
        <div className="palette-back" onClick={() => setPalette(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()}>
            <div>
              <Search size={17} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
              />
              <kbd>ESC</kbd>
            </div>
            <p>Navigate</p>
            {commands.map(([label, target]) => (
              <button key={label} className={commands[paletteIndex]?.[0] === label ? "selected" : ""} onMouseEnter={() => setPaletteIndex(commands.findIndex((item) => item[0] === label))} onClick={() => go(target)}>
                {label}
                <ChevronRight size={16} />
              </button>
            ))}
            <small>
              <Command size={12} /> Use ↑ ↓ to explore · Enter to select
            </small>
          </div>
        </div>
      )}
      <button className="terminal-launch" onClick={() => setTerminalOpen(true)} aria-label="Open portfolio terminal"><Terminal size={18} /></button>
      {terminalOpen && <Suspense fallback={<div className="terminal-loading">Loading terminal…</div>}><TerminalWidget onTheme={setTheme} onClose={() => setTerminalOpen(false)} /></Suspense>}
      {resumeOpen && <div className="resume-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setResumeOpen(false); }}><section className="resume-preview" role="dialog" aria-modal="true" aria-labelledby="resume-title"><button className="resume-preview-close" onClick={() => setResumeOpen(false)} aria-label="Close resume preview"><X size={18} /></button><p className="eyebrow">DOCUMENT / PDF</p><h2 id="resume-title">Resume preview</h2><div className="resume-preview-empty"><FileText size={32} /><p>Resume PDF is not in the portfolio yet.</p><small>Add your file at <code>public/resume.pdf</code> to enable preview and download.</small></div><a className="button light" href="/resume.pdf" download="Joyson-Fernandes-Resume.pdf">Download resume <ArrowUpRight size={15} /></a></section></div>}
      {toast && <div className="explore-toast" role="status"><Sparkles size={16} />{toast}</div>}
    </>
  );
}
export default App;
