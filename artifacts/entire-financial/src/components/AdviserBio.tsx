import { ReactNode } from "react";
import { ResponsiveImage, type ImageName } from "./ResponsiveImage";

interface AdviserBioProps {
  name: string;
  role: string;
  experience: string;
  description: ReactNode;
  credentials?: string[];
  image?: ImageName;
}

export function AdviserBio({ name, role, experience, description, credentials = [], image }: AdviserBioProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-muted/30 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-muted/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-muted/50">
          <div className="w-40 h-40 rounded-full bg-white shadow-sm border border-muted-border/50 mb-6 flex items-center justify-center overflow-hidden relative">
            {image ? (
              <ResponsiveImage image={image} sizes="160px" alt={name} className="w-full h-full object-cover object-top" />
            ) : (
              <>
                <div className="absolute inset-0 bg-primary/5" />
                <span className="font-sans text-5xl text-secondary/30">{name.charAt(0)}</span>
              </>
            )}
          </div>
          <div className="text-center mb-6" data-testid="stat-experience">
            <p className="font-sans text-3xl font-bold text-secondary">{experience}</p>
          </div>
          <h3 className="font-sans text-2xl font-bold text-secondary text-center mb-1">{name}</h3>
          <p className="text-primary font-medium mb-3 text-center">{role}</p>
        </div>
        
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <div className="prose prose-slate max-w-none mb-8">
            {description}
          </div>
          
          {credentials.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 border-b border-muted/50 pb-2">
                Qualifications & Credentials
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {credentials.map((cred, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-primary mt-1">•</span>
                    <span>{cred}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
