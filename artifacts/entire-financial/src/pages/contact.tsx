import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAFBFA" }}>
      <PageHero
        overline="Get In Touch"
        title="Let's start the conversation."
        subtitle="Whether you have a specific financial goal in mind or just want to understand your options, our team is ready to help."
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Info */}
            <div>
              <h2 className="font-sans text-2xl font-bold text-secondary mb-8">How to reach us</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-muted/50">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-secondary mb-1">Phone</h3>
                    <a href="tel:0421833372" className="text-foreground/70 hover:text-primary">0421 833 372</a>
                    <p className="text-sm text-foreground/50 mt-1">Available Mon-Fri, 9am - 5pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-muted/50">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-secondary mb-1">Email</h3>
                    <a href="mailto:bevan@entirefs.com.au" className="text-foreground/70 hover:text-primary break-words">bevan@entirefs.com.au</a>
                    <p className="text-sm text-foreground/50 mt-1">We aim to respond within 1 business day</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-muted/50">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-bold text-secondary mb-1">Office</h3>
                    <p className="text-foreground/70">Suite 42/ 195 Wellington Road, Clayton, VIC, 3168 (Building 4)</p>
                    <p className="text-sm text-foreground/50 mt-1">Consultations by appointment only</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12 bg-white p-2 rounded-2xl shadow-sm border border-muted/50">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps?q=Suite+42%2F+195+Wellington+Road,+Clayton,+VIC,+3168,+Australia&output=embed"
                  width="100%"
                  height="280"
                  className="rounded-xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            
            {/* Form */}
            <div className="lg:mt-4">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
