import { useEffect, useState } from "react";

const lines = ["initializing portfolio...", "loading projects...", "ready"];

export default function IntroLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const value = Math.min(100, Math.round(((now - start) / 1750) * 100));
      setProgress(value);
      setLine(value < 42 ? 0 : value < 82 ? 1 : 2);
      if (value < 100) frame = requestAnimationFrame(tick);
      else setFinished(true);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); };
  }, [onComplete]);

  useEffect(() => {
    if (!finished) return;
    setLeaving(true);
    const timer = window.setTimeout(onComplete, 380);
    return () => window.clearTimeout(timer);
  }, [finished, onComplete]);

  const skip = () => { setFinished(true); };

  return (
    <div className={`intro-loader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="intro-loader__content">
        <div className="intro-loader__brand"><span className="intro-loader__mark">JF</span><span>PORTFOLIO SYSTEMS</span></div>
        <div className="intro-loader__terminal">
          <p className="intro-loader__label">BOOT SEQUENCE <span>v1.0.0</span></p>
          {lines.slice(0, line + 1).map((text, index) => (
            <p className={`intro-loader__line${index === line ? " is-active" : ""}`} key={text}>
              <span className="intro-loader__prompt">&gt;</span> {text}{index === line && progress < 100 && <i />}
              {index < line && <b>OK</b>}
            </p>
          ))}
          <div className="intro-loader__progress"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
          <div className="intro-loader__meta"><span>SYSTEM CHECK</span><span>{String(progress).padStart(3, "0")}%</span></div>
        </div>
        <button className="intro-loader__skip" onClick={skip}>SKIP INTRO <kbd>ESC</kbd></button>
      </div>
    </div>
  );
}
