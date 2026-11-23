import { ArrowUpRight, Baby, Droplets, ScanLine, ShieldCheck, Sprout, Stethoscope } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";

interface ServicesProps { className?: string }

const serviceIcons = [Baby, Sprout, Stethoscope, Droplets, ShieldCheck, ScanLine] as const;

export function Services({ className }: ServicesProps) {
  return (
    <Section id="services" tone="muted" className={className}>
      <div className="mb-10 max-w-2xl">
        <p className="mb-4 text-[13px] font-semibold leading-[1.7] text-primary">Our services</p>
        <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {doctorContent.services.heading}
        </h2>
        <p className="mt-4 text-lg leading-[1.7] text-muted-foreground">
          {doctorContent.services.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {doctorContent.services.items.map((service, index) => {
          const Icon = serviceIcons[index];
          const message = `Assalam o Alaikum, I would like to ask about ${service.title}`;
          return (
            <a
              key={service.title}
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-56 flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <ArrowUpRight className="size-5 text-primary transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold leading-tight text-foreground">{service.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground md:text-base">{service.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
