import { Ear, Route, ShieldCheck } from "lucide-react";
import { doctorContent } from "@/lib/content";
import { Section } from "@/components/shared/Section";

interface AboutProps {
  className?: string;
}

const approachPoints = [
  { icon: Ear, title: "Listening first" },
  { icon: ShieldCheck, title: "Private, respectful consultations" },
  { icon: Route, title: "Clear next steps" },
] as const;

export function About({ className }: AboutProps) {
  return (
    <Section id="about" tone="default" className={className}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 text-[13px] font-semibold leading-[1.7] text-primary">
            About the doctor
          </p>
          <h2 className="max-w-lg font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
            {doctorContent.about.heading}
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-[1.75] text-muted-foreground">
            Personal care across women's health, with enough time to understand
            the concern and explain the options.
          </p>
        </div>

        <div>
          <p className="text-lg leading-[1.75] text-foreground">
            {doctorContent.about.body}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {approachPoints.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-start gap-3 sm:block xl:flex">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-0 text-[15px] font-semibold leading-[1.7] text-foreground sm:mt-3 xl:mt-0">
                  {title}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-accent p-5 text-accent-foreground">
            <p className="text-base font-medium leading-[1.7]">
              {doctorContent.about.approach}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
