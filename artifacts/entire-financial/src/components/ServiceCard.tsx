import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  forWho?: string;
  href?: string;
}

export function ServiceCard({ title, description, forWho, href = "/services" }: ServiceCardProps) {
  return (
    <Card className="group h-full border-muted-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-white overflow-hidden flex flex-col">
      <CardContent className="p-8 flex flex-col h-full relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-muted/30 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <div className="w-4 h-4 bg-current rounded-sm rotate-45" />
        </div>
        <h3 className="font-sans text-xl font-bold text-secondary mb-3">{title}</h3>
        <p className="text-foreground/70 mb-6 leading-relaxed flex-1">
          {description}
        </p>
        {forWho && (
          <div className="bg-muted/20 p-4 rounded-lg mb-6 border border-muted-border/30">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Who this is for</p>
            <p className="text-sm text-foreground/80">{forWho}</p>
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-muted-border/30">
          <Link href={href} className="inline-flex items-center text-primary font-medium text-sm group/link">
            Learn more
            <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
