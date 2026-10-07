import { ReactNode } from "react";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
}

export function ContentBlock({ children, className = "" }: ContentBlockProps) {
  return (
    <div className={`prose prose-lg prose-slate max-w-none prose-headings:font-sans prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-primary/80 ${className}`}>
      {children}
    </div>
  );
}
