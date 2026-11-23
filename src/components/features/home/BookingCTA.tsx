"use client";

import { FormEvent, useState } from "react";
import { Clock3, Phone, MessageCircle } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Whatsapp from "@/components/ui/Whatsapp";

interface BookingCTAProps {
  className?: string;
}

export function BookingCTA({ className }: BookingCTAProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [concern, setConcern] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Assalam o Alaikum, I would like to book an appointment.",
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Concern: ${concern.trim() || "Not specified"}`,
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

        <form onSubmit={handleSubmit} className="grid gap-4 lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-[15px] font-medium text-primary-foreground">
              Name
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </label>
            <label className="grid gap-2 text-[15px] font-medium text-primary-foreground">
              Phone
              <Input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Your phone number"
                className="h-12 rounded-xl border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </label>
          </div>

          <label className="grid gap-2 text-[15px] font-medium text-primary-foreground">
            Concern
            <Textarea
              value={concern}
              onChange={(event) => setConcern(event.target.value)}
              placeholder="How can we help?"
              className="min-h-28 rounded-xl border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </label>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            {/* <MessageCircle className="size-5" aria-hidden="true" /> */}
            <Whatsapp />
            Send booking request
          </button>
        </form>
      </div>
    </Section>
  );
}
