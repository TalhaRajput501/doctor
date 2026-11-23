"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, MapPin, MessageCircle, Phone } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";
import Whatsapp from "@/components/ui/Whatsapp";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const whatsappMessage = "Hello Dr. Shafqat Batool, I would like to book an appointment.";

  return (
    <Section
      id="hero"
      tone="default"
      className={cn("relative isolate overflow-hidden py-12 md:py-20", className)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="max-w-2xl lg:col-span-7">
          <p className="mb-4 text-[13px] font-semibold leading-[1.7] text-primary">
            Women&apos;s health in Dera Ghazi Khan
          </p>

          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
            {doctorContent.name}
          </h1>

          <p dir="rtl" className="mt-3 font-urdu text-lg leading-loose text-muted-foreground">
            ماہرِ امراضِ نسواں
          </p>

          <p className="mt-4 max-w-xl text-lg font-medium leading-[1.7] text-foreground">
            {doctorContent.specialty}
          </p>

          <p className="mt-4 max-w-prose text-lg leading-[1.7] text-muted-foreground">
            {doctorContent.promise}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={waLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              {/* <MessageCircle className="size-5" aria-hidden="true" /> */}
              <Whatsapp />
              Book on WhatsApp
            </a>
            <a
              href={`tel:${doctorContent.phoneHref}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-border bg-background px-6 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <Phone className="size-5" aria-hidden="true" />
              Call clinic
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-[15px] leading-[1.7] text-muted-foreground sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{doctorContent.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{doctorContent.clinic.name}, {doctorContent.location}</span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary to-accent">
            {!portraitFailed ? (
              <Image
                src={doctorContent.portrait}
                alt={doctorContent.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                onError={() => setPortraitFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-6xl font-semibold tracking-tight text-primary">SB</span>
              </div>
            )}

            {doctorContent.pmcNumber && (
              <span className="absolute bottom-4 left-4 rounded-full border border-border bg-background px-3 py-1.5 text-[13px] font-semibold leading-[1.7] text-foreground">
                PMC verified
              </span>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}