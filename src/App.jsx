import { useState, useEffect } from "react";
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
} from "lucide-react";
import { profile, skills } from "./data/portfolio";
import GithubActivity from "./components/GithubActivity";
import TypeName from "./components/TypeName";
const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
    <ArrowUpRight size={15} />
  </a>
);
function Magnetic({ children, className = "", ...props }) {
  return (
    <a className={className} {...props}>
      {children}
    </a>
  );
}
function App() {
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState("top"),
    [palette, setPalette] = useState(false),
    [query, setQuery] = useState(""),
    [skill, setSkill] = useState("C++");
  const nav = ["About", "Education", "Skills", "Learning", "Profiles", "Contact"];
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
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
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
  const go = (target) => {
    setPalette(false);
    if (target.startsWith("http")) window.open(target, "_blank");
    else if (target === "/resume.pdf") window.open(target, "_blank");
    else document.getElementById(target)?.scrollIntoView();
  };
  return (
    <>
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
          <a className="nav-resume" href="/resume.pdf" target="_blank">
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
      <main id="top">
        <section className="hero wrap">
          <div>
            <p className="eyebrow">
              <i /> {profile.role}
            </p>
            <h1>
              Hi, I’m
              <br />
              <em>
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
        <section id="about" className="wrap about">
          <div>
            <p className="eyebrow">01 — About</p>
            <h2>
              Grounded in fundamentals.
              <br />
              <em>Driven by curiosity.</em>
            </h2>
          </div>
          <div>
            <p className="body">
              I’m a third-year Information Science and Engineering student at
              MITE, Mangalore, pursuing a Bachelor of Engineering under VTU.
              I enjoy studying programming fundamentals and working through data structures, object-oriented programming, and problem solving.
            </p>
            <p className="body muted">
              My current programming toolkit includes C, C++, Java, and Python. I’m continuing to build my skills through coursework and practice.
            </p>
          </div>
        </section>
        <section id="education" className="wrap education-section">
          <div><p className="eyebrow">02 — Education</p><h2>My academic<br/><em>background.</em></h2></div>
          <article className="education-card"><span className="education-mark"><Code2 size={22}/></span><div><p className="eyebrow">Bachelor of Engineering · 2024 — Present</p><h3>Information Science &amp; Engineering</h3><p>MITE · Mangalore, Karnataka · VTU</p></div><div className="cgpa"><strong>9.55</strong><span>CGPA</span></div></article>
        </section>
        <section id="skills" className="wrap">
          <div>
            <p className="eyebrow">02 — Skills</p>
            <h2>
              A deliberate
              <br />
              <em>toolkit.</em>
            </h2>
          </div>
          <div className="skill-experience">
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
        <section id="learning" className="wrap learning-section">
          <div>
            <p className="eyebrow">04 — Currently learning</p>
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
              <p className="eyebrow">05 — Profiles</p>
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
              <p className="eyebrow">06 — Contact</p>
              <h2>
                Let’s build
                <br />
                <em>something.</em>
              </h2>
              <a className="email" href={"mailto:" + profile.email}>
                {profile.email}
                <ArrowUpRight />
              </a>
              <div className="contact-links">
                <Link href={profile.linkedin}>LinkedIn</Link>
                <Link href={profile.github}>GitHub</Link>
              </div>
            </div>
            <div className="contact-terminal"><span><i/> joyson@portfolio:~$</span><p>Have a project, question, or just want to talk code?</p><a className="button light" href={`mailto:${profile.email}?subject=Hello%20Joyson`}>Start a conversation <ArrowUpRight size={16}/></a><small>Opens your email app with a new message.</small></div>
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
              <button key={label} onClick={() => go(target)}>
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
    </>
  );
}
export default App;
