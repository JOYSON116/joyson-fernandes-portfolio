import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 801px) and (prefers-reduced-motion: no-preference)").matches && (navigator.hardwareConcurrency || 8) > 4;
    if (!fine) return;
    let x = -100, y = -100, rx = x, ry = y, frame;
    const move = (event) => { x = event.clientX; y = event.clientY; setVisible(true); dot.current?.style.setProperty("transform", `translate3d(${x}px,${y}px,0)`); };
    const over = (event) => { if (event.target.closest("a,button,[role=button],.dash-tile,.project-card")) document.body.classList.add("cursor-hover"); };
    const out = (event) => { if (event.target.closest("a,button,[role=button],.dash-tile,.project-card")) document.body.classList.remove("cursor-hover"); };
    const animate = () => { rx += (x - rx) * .16; ry += (y - ry) * .16; ring.current?.style.setProperty("transform", `translate3d(${rx}px,${ry}px,0)`); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); document.removeEventListener("pointerout", out); document.body.classList.remove("cursor-hover"); };
  }, []);
  return <div className={`custom-cursor${visible ? " is-visible" : ""}`} aria-hidden="true"><i ref={ring} /><b ref={dot} /></div>;
}
