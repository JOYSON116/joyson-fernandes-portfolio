import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><div className="not-found-card"><Terminal size={20} /><p className="not-found-prompt">joyson@portfolio:~$ locate page</p><h1>404<span>_</span></h1><p>PATH NOT FOUND<br />The page you requested could not be located.</p><a className="button light" href="/"><ArrowLeft size={15} /> Return to portfolio</a></div></main>;
}
