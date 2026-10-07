import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  suburb: string;
  rating?: number;
  quote: string;
  category?: string;
}

export function TestimonialCard({ name, suburb, rating = 5, quote, category }: TestimonialCardProps) {
  return (
    <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex gap-1 mb-6">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="flex-1 text-lg text-foreground/80 leading-relaxed font-sans italic mb-8">
          "{quote}"
        </blockquote>
        <div className="flex items-center justify-between border-t border-muted/50 pt-6 mt-auto">
          <div>
            <p className="font-bold text-secondary">{name}</p>
            <p className="text-sm text-foreground/60">{suburb}</p>
          </div>
          {category && (
            <span className="text-xs font-medium px-3 py-1 bg-muted/30 text-primary rounded-full">
              {category}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
