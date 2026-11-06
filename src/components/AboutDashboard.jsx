import { ArrowUpRight, Code2, MapPin, GraduationCap, BookOpen, GitBranch, ExternalLink } from "lucide-react";
import { profile, skills } from "../data/portfolio";
import GithubActivity from "./GithubActivity";

const foundations = skills.find(([title]) => title === "Programming")?.[1] ?? [];
const learning = skills.find(([title]) => title === "Currently learning")?.[1] ?? [];

export default function AboutDashboard() {
  return (
    <div className="about-dashboard">
      <article className="dash-tile dash-bio">
        <span className="dash-kicker">01 / PROFILE</span>
        <h3>Grounded in fundamentals.<br /><em>Driven by curiosity.</em></h3>
        <p>I’m a third-year Information Science and Engineering student at MITE, Mangalore, pursuing a Bachelor of Engineering under VTU. I enjoy studying programming fundamentals and working through data structures, object-oriented programming, and problem solving.</p>
        <p className="dash-secondary">My current programming toolkit includes C, C++, Java, and Python. I’m continuing to build my skills through coursework and practice.</p>
      </article>

      <article className="dash-tile dash-cgpa">
        <span className="dash-kicker"><GraduationCap size={14} /> EDUCATION</span>
        <strong>9.55</strong><span className="dash-caption">CURRENT CGPA</span>
        <div className="dash-meter" aria-label="CGPA 9.55 out of 10"><i style={{ "--meter": "95.5%" }} /></div>
        <small>MITE · VTU</small>
      </article>

      <article className="dash-tile dash-stack">
        <span className="dash-kicker"><Code2 size={14} /> CORE TOOLKIT</span>
        <div className="dash-chips">{foundations.map((item) => <span key={item}>{item}</span>)}</div>
        <small>Programming languages</small>
      </article>

      <article className="dash-tile dash-location">
        <span className="dash-kicker"><MapPin size={14} /> BASED IN</span>
        <strong>Honnavar</strong><span>Karnataka, India</span>
        <div className="location-grid" aria-hidden="true" />
      </article>

      <article className="dash-tile dash-github">
        <div className="dash-tile-head"><span className="dash-kicker"><GitBranch size={14} /> GITHUB ACTIVITY</span><a href={profile.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ArrowUpRight size={16} /></a></div>
        <GithubActivity />
      </article>

      <a className="dash-tile dash-profile" href={profile.leetcode} target="_blank" rel="noreferrer">
        <span className="dash-kicker">LEETCODE <ExternalLink size={13} /></span><strong>Problem solving</strong><span>Visit profile for current activity</span>
      </a>

      <a className="dash-tile dash-profile dash-gfg" href={profile.gfg} target="_blank" rel="noreferrer">
        <span className="dash-kicker">GEEKSFORGEEKS <ExternalLink size={13} /></span><strong>Practice &amp; concepts</strong><span>Visit profile for current activity</span>
      </a>

      <article className="dash-tile dash-learning">
        <div className="dash-tile-head"><span className="dash-kicker"><BookOpen size={14} /> CURRENTLY LEARNING</span><span className="learning-live"><i />IN PROGRESS</span></div>
        <div className="learning-chips">{learning.map((item) => <span key={item}>{item}</span>)}</div>
        <small>Progress values aren’t published yet.</small>
      </article>
    </div>
  );
}
