import { AlertCircle } from "lucide-react";

interface DisclosureBlockProps {
  children?: React.ReactNode;
  title?: string;
}

export function DisclosureBlock({ 
  children = "Entire Financial Services is a corporate authorized representative of Apex Macro Financial Group. The information on this website is general in nature and does not consider your personal circumstances.",
  title = "General Advice Warning"
}: DisclosureBlockProps) {
  return (
    <div className="bg-muted/30 border border-muted-border/50 rounded-xl p-6 flex gap-4 text-sm text-foreground/70 my-8">
      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div>
        {title && <strong className="block text-secondary mb-1">{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
}
