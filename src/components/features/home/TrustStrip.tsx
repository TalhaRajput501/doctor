import { Award, Languages, MapPin, Stethoscope, BadgeCheck } from "lucide-react";
import { doctorContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps) {
  const items = [
    { icon: Award, ...doctorContent.trust.qualifications },
    { icon: Stethoscope, ...doctorContent.trust.experience },
    { icon: Languages, ...doctorContent.trust.languages },
    { icon: MapPin, ...doctorContent.trust.clinic },
    ...(doctorContent.pmcNumber
      ? [{
          icon: BadgeCheck,
          label: "PMC registration",
          value: doctorContent.pmcNumber,
          detail: "Verified registration",
        }]
      : []),
  ];

  const lgColumns = doctorContent.pmcNumber ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <Section
      id="trust"
      tone="primary"
      aria-label="Doctor credentials and clinic details"
      className={cn("border-y border-primary", className)}
    >
      <div className={cn("grid grid-cols-2 gap-y-8 lg:gap-y-0", lgColumns)}>
        {items.map(({ icon: Icon, label, value, detail }, index) => (
          <div
            key={label}
            className={cn(
              "grid min-h-28 content-start gap-3 px-3 first:pl-0 sm:px-5 lg:min-h-36 lg:px-6",
              index % 2 === 0 && "pl-0",
              index > 0 && "lg:border-l lg:border-primary-foreground/20",
              index === 0 && "lg:border-l-0 lg:pl-0",
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] leading-[1.7] text-primary-foreground/70">
                {label}
              </p>
              <p className="mt-1 text-xl font-semibold leading-[1.7] text-primary-foreground">
                {value}
              </p>
              <p className="mt-0.5 text-[14px] leading-[1.7] text-primary-foreground/80">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
