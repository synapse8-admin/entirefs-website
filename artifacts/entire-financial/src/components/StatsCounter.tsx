import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface StatsCounterProps {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
  href?: string;
}

export function StatsCounter({ target, label, prefix = "", suffix = "", href }: StatsCounterProps) {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInView && !reducedMotion) {
      let start = 0;
      setCount(0);
      const duration = 2000;
      
      const timer = setInterval(() => {
        start += Math.ceil(target / (duration / 50)) || 1;
        if (start > target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isInView, target, reducedMotion]);

  const inner = (
    <>
      <div className="font-sans text-4xl md:text-5xl font-bold text-secondary mb-2 flex items-baseline">
        {prefix && <span className="text-2xl md:text-3xl text-primary mr-1">{prefix}</span>}
        <span className="tabular-nums" aria-hidden="true">{count}</span>
        <span className="sr-only">{target}</span>
        {suffix && <span className="text-3xl md:text-4xl text-primary ml-1">{suffix}</span>}
      </div>
      <div className="h-1 w-12 bg-accent rounded-full mb-4"></div>
      <p className="text-sm md:text-base font-medium text-foreground/70 uppercase tracking-wider">{label}</p>
    </>
  );

  return (
    <div ref={ref} className="text-center flex flex-col items-center">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group hover:opacity-80 transition-opacity">
          {inner}
        </a>
      ) : inner}
    </div>
  );
}
