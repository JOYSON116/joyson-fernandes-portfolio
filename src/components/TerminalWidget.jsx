import { useMemo, useRef, useState } from "react";
import { profile, skills, projects } from "../data/portfolio";
import { Terminal, X, Minus, ChevronUp } from "lucide-react";

const commands = ["help", "about", "skills", "projects", "contact", "resume", "theme neon|violet|light", "clear"];

export default function TerminalWidget({ onTheme, onClose }) {
  const [history, setHistory] = useState([{ command: "help", output: "Available commands: help, about, skills, projects, contact, resume, theme neon|violet|light, clear" }]);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState(-1);
  const input = useRef(null);
  const historyValues = useMemo(() => history.map(({ command }) => command), [history]);
  const run = (raw) => {
    const command = raw.trim();
    if (!command) return;
    const [base, arg] = command.split(/\s+/, 2);
    let output;
    if (base === "clear") { setHistory([]); return; }
    if (base === "help") output = commands.join(" · ");
    else if (base === "about") output = `${profile.name} — ${profile.role}. Based in ${profile.location}.`;
    else if (base === "skills") output = skills.map(([title, items]) => `${title}: ${items.join(", ")}`).join("\n");
    else if (base === "projects") output = projects.map((item) => item.title).join(" · ");
    else if (base === "contact") output = profile.email;
    else if (base === "resume") { window.open("/resume.pdf", "_blank", "noopener,noreferrer"); output = "Opening resume.pdf"; }
    else if (base === "theme" && ["neon", "violet", "light"].includes(arg)) { onTheme(arg); output = `Theme set to ${arg}.`; }
    else output = base === "theme" ? "Usage: theme neon|violet|light" : `Command not found: ${base}. Type help.`;
    setHistory((items) => [...items, { command, output }]);
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter") { run(value); setValue(""); setPosition(-1); }
    if (event.key === "ArrowUp") { event.preventDefault(); const next = Math.min(position + 1, historyValues.length - 1); setPosition(next); setValue(historyValues[historyValues.length - 1 - next] || ""); }
    if (event.key === "ArrowDown") { event.preventDefault(); const next = Math.max(-1, position - 1); setPosition(next); setValue(next < 0 ? "" : historyValues[historyValues.length - 1 - next]); }
    if (event.key === "Tab") { event.preventDefault(); const match = commands.find((item) => item.startsWith(value)); if (match) setValue(match); }
    if (event.key === "Escape") onClose();
  };
  return <div className="terminal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="terminal-widget" role="dialog" aria-modal="true" aria-label="Portfolio terminal">
      <header className="terminal-widget-head"><span><Terminal size={15} /> joyson@portfolio:~</span><div><button onClick={() => input.current?.focus()} aria-label="Focus command input"><Minus size={14} /></button><button onClick={onClose} aria-label="Close terminal"><X size={15} /></button></div></header>
      <div className="terminal-output" onClick={() => input.current?.focus()}>
        {history.map((item, index) => <div key={`${item.command}-${index}`} className="terminal-entry"><p><b>$</b> {item.command}</p><pre>{item.output}</pre></div>)}
        <div className="terminal-input-row"><b>$</b><input ref={input} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} autoFocus aria-label="Terminal command" autoComplete="off" spellCheck="false" /><ChevronUp size={13} /></div>
      </div>
      <footer>↑ ↓ HISTORY <span>·</span> TAB AUTOCOMPLETE <span>·</span> ESC CLOSE</footer>
    </section>
  </div>;
}
