import { MapPin, Phone } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { Container } from "@/components/shared/Container";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const year = 2026
  const whatsappMessage = "Assalam o Alaikum, I would like to ask about an appointment.";

  return (
    <footer className={`bg-foreground text-background ${className ?? ""}`}>
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-3 md:py-16">
          <div>
            <p className="font-heading text-xl font-semibold leading-tight text-background">{doctorContent.name}</p>
            <p className="mt-3 max-w-xs text-[15px] leading-[1.7] text-background/70">Consultant Gynecologist, Obstetrician, and Infertility Specialist</p>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-semibold leading-[1.7] text-background/70">Visit</p>
            <div className="grid gap-3 text-[15px] leading-[1.7] text-background/85">
              <p className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />{doctorContent.clinic.address}</p>
              <p>{doctorContent.clinic.hours}</p>
              <p>{doctorContent.clinic.timing}</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-semibold leading-[1.7] text-background/70">Quick links</p>
            <nav className="grid grid-cols-2 gap-3 text-[15px] leading-[1.7]" aria-label="Footer navigation">
              <a href="#about" className="hover:underline">About</a>
              <a href="#services" className="hover:underline">Services</a>
              <a href="#clinic" className="hover:underline">Clinic</a>
              <a href="#faq" className="hover:underline">FAQ</a>
              <a href={`tel:${doctorContent.phoneHref}`} className="flex items-center gap-2"><Phone className="size-4" aria-hidden="true" />Call</a>
              <a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
            </nav>
          </div>
        </div>

        <div className="grid gap-3 border-t border-background/15 py-6 text-[13px] leading-[1.7] text-background/70 md:grid-cols-2 md:items-start">
          <p>© {year} {doctorContent.name}</p>
          <p className="md:text-right">All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
