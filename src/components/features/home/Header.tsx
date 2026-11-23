"use client";

import { Menu, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { doctorContent, waLink } from "@/lib/content";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Whatsapp from "@/components/ui/Whatsapp";

interface HeaderProps { className?: string }

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Clinic", href: "#clinic" },
];

export function Header({ className }: HeaderProps) {
  const whatsappMessage = "Hello Dr. Shafqat Batool, I would like to book an appointment.";

  return (
    <header className={cn("sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur", className)}>
      <Container>
        <div className="flex h-16 items-center justify-between gap-3">
          <a href="#hero" className="flex min-w-0 items-center gap-2" aria-label="Go to homepage">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-base font-semibold text-primary-foreground">
              SB
            </span>
            <span className="hidden min-w-0 font-heading text-base font-semibold leading-tight text-foreground sm:block sm:text-lg">
              Dr. Shafqat Batool
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
            {doctorContent.testimonials.reviews.length > 0 && (
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Reviews</a>
            )}
            <a href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 md:hidden"
              size="icon"
              render={<a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" />}
              aria-label="Book on WhatsApp"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </Button>

            <Button
              className="hidden bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 md:inline-flex"
              render={<a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" />}
            > 
              {/* <MessageCircle className="size-4" aria-hidden="true" /> */}
              <Whatsapp />
              Book on WhatsApp
            </Button>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open menu" />} className="md:hidden">
                <Menu className="size-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-background p-0">
                <SheetHeader className="border-b border-border">
                  <SheetTitle className="pr-10">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col px-5" aria-label="Mobile navigation">
                  {[...navLinks, ...(doctorContent.testimonials.reviews.length > 0 ? [{ label: "Reviews", href: "#testimonials" }] : []), { label: "FAQ", href: "#faq" }].map((link) => (
                    <SheetClose key={link.href} render={<a href={link.href} className="border-b border-border py-4 text-base font-medium text-foreground" />}>
                      {link.label}
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto grid gap-3 p-5">
                  <a href={waLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-whatsapp px-5 text-base font-semibold text-whatsapp-foreground">
                    <MessageCircle className="size-5" aria-hidden="true" />
                    Book on WhatsApp
                  </a>
                  <a href={`tel:${doctorContent.phoneHref}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-border bg-background px-5 text-base font-semibold text-foreground">
                    <Phone className="size-5" aria-hidden="true" />
                    Call clinic
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}