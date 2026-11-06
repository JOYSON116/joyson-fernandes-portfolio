import { useState } from "react";
import { skills } from "../data/portfolio";

const orbitSkills = ["C++", "Java", "Python", "React", "MySQL", "MongoDB", "Git"];

export default function InteractiveSkills() {
  const [active, setActive] = useState("C++");
  return <div className="interactive-skills">
    <div className="skill-orbit" aria-label="Interactive skills orbit">
      <span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" />
      <span className="orbit-core">{active}</span>
      {orbitSkills.map((item, index) => <button key={item} className={`orbit-skill orbit-skill-${index}`} onClick={() => setActive(item)} aria-pressed={active === item}>{item}</button>)}
    </div>
    <div className="tech-marquee" aria-label="Technologies">
      <div className="tech-marquee-track">{[0, 1].map((copy) => <div className="tech-marquee-group" key={copy} aria-hidden={copy === 1}>{[...skills.flatMap(([, items]) => items), "React", "JavaScript"].map((item, index) => <span key={`${copy}-${item}-${index}`}>{item}<i>✳</i></span>)}</div>)}</div>
    </div>
  </div>;
}
