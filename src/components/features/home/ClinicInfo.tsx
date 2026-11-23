import { Clock3, MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";

interface ClinicInfoProps {
  className?: string;
}

export function ClinicInfo({ className }: ClinicInfoProps) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(doctorContent.clinic.mapQuery)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctorContent.clinic.mapQuery)}`;
  const whatsappMessage = "Assalam o Alaikum, I would like to ask about an appointment.";

  return (
    <Section id="clinic" tone="default" className={className}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-[13px] font-semibold leading-[1.7] text-primary">Clinic information</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
            {doctorContent.clinic.heading}
          </h2>

          <div className="mt-8 grid gap-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <MapPin className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold leading-[1.7] text-foreground">{doctorContent.clinic.name}</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-muted-foreground">{doctorContent.clinic.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Clock3 className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold leading-[1.7] text-foreground">{doctorContent.clinic.hours}</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-muted-foreground">{doctorContent.clinic.timing}</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-muted-foreground">Sunday: closed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold leading-[1.7] text-foreground">Contact</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-muted-foreground">{doctorContent.phone}</p>
              </div>
            </div>
          </div>

          {doctorContent.clinic.fee && (
            <p className="mt-6 text-base font-semibold leading-[1.7] text-foreground">
              Consultation fee: Rs. {doctorContent.clinic.fee}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <a href={`tel:${doctorContent.phoneHref}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-border bg-background px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
              <Phone className="size-5" aria-hidden="true" /> Call
            </a>
            <a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-whatsapp px-4 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
              <MessageCircle className="size-5" aria-hidden="true" /> WhatsApp
            </a>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-border bg-background px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
              <Navigation className="size-5" aria-hidden="true" /> Directions
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <iframe
            src={mapUrl}
            title={`Map showing ${doctorContent.clinic.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-2xl border border-border md:h-full md:min-h-96"
          />
        </div>
      </div>
    </Section>
  );
}
