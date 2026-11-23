"use client";

import { doctorContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  className?: string;
}

export function FAQ({ className }: FAQProps) {
  return (
    <Section id="faq" tone="muted" className={className}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="text-[13px] font-semibold leading-[1.7] text-primary">Common questions</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
            {doctorContent.faq.heading}
          </h2>
        </div>

        <Accordion className="lg:col-span-8">
          {doctorContent.faq.items.map((item, index) => (
            <AccordionItem key={item.question}>
              <AccordionTrigger className="text-base font-semibold text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[15px] leading-[1.7] text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
