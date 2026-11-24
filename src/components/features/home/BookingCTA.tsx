"use client";

import { FormEvent, useState } from "react";
import { Clock3, Phone } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";
import { Input } from "@/components/ui/input";
import Whatsapp from "@/components/ui/Whatsapp";

interface BookingCTAProps {
  className?: string;
}

export function BookingCTA({ className }: BookingCTAProps) {
  const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState<"Self" | "Mother" | "Father" | "Sibling" | "Spouse" | "Other">("Self");


  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Assalam o Alaikum, I would like to book an appointment.",
      `Name: ${name.trim()}`,
      `Relation with patient: ${relation.trim() || "Not specified"}`,
    ].join("\n");

    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <Section id="booking" tone="primary" className={className}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-[13px] font-semibold leading-[1.7] text-primary-foreground/70">Appointment request</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-primary-foreground md:text-4xl">
            Book a consultation
          </h2>
          <p className="mt-5 max-w-md text-lg leading-[1.7] text-primary-foreground/85">
            Send your details on WhatsApp and the clinic can confirm the next available appointment.
          </p>

          <div className="mt-8 grid gap-5 border-t border-primary-foreground/20 pt-6">
            <div className="flex items-start gap-3">
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[13px] leading-[1.7] text-primary-foreground/70">Clinic phone</p>
                <a href={`tel:${doctorContent.phoneHref}`} className="mt-1 inline-block text-base font-semibold text-primary-foreground">
                  {doctorContent.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[13px] leading-[1.7] text-primary-foreground/70">Clinic timings</p>
                <p className="mt-1 text-[15px] leading-[1.7] text-primary-foreground">
                  {doctorContent.clinic.hours}<br />{doctorContent.clinic.timing}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid content-start gap-4 lg:col-span-7">
          <div className="flex  flex-col gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-[15px] font-medium text-primary-foreground">
              Name
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-12 w-full rounded-xl border-primary-foreground/30 bg-primary-foreground/10 px-3.5 text-base text-primary-foreground placeholder:text-primary-foreground/60 sm:text-sm"
              />
            </label>

            <label className="grid gap-2 text-[15px] font-medium text-primary-foreground">
              Relation with patient
              <div className="relative">
                <select
                  required
                  name="relation"
                  id="relation"
                  value={relation}
                  onChange={(event) =>
                    setRelation(
                      event.target.value as
                      | "Self"
                      | "Mother"
                      | "Father"
                      | "Sibling"
                      | "Spouse"
                      | "Other"
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 pl-3.5 pr-10 text-base text-primary-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-sm"
                >
                  <option value="" disabled className="bg-slate-900 text-white">
                    Select relation
                  </option>
                  <option value="Self" className="bg-slate-900 text-white">
                    Self
                  </option>
                  <option value="Mother" className="bg-slate-900 text-white">
                    Mother
                  </option>
                  <option value="Father" className="bg-slate-900 text-white">
                    Father
                  </option>
                  <option value="Sibling" className="bg-slate-900 text-white">
                    Sibling
                  </option>
                  <option value="Spouse" className="bg-slate-900 text-white">
                    Spouse
                  </option>
                  <option value="Other" className="bg-slate-900 text-white">
                    Other
                  </option>
                </select>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/80"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 self-start rounded-[var(--radius-xl)] bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring "
          >
            <Whatsapp />
            Send booking request
          </button>
        </form>

      </div>
    </Section>
  );
}
