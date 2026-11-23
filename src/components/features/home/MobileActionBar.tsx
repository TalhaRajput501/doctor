import { MessageCircle, Phone } from "lucide-react";
import { doctorContent, waLink } from "@/lib/content";

export function MobileActionBar() {
  const whatsappMessage = "Assalam o Alaikum, I would like to ask about an appointment.";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <a
        href={`tel:${doctorContent.phoneHref}`}
        className="inline-flex min-h-14 items-center justify-center gap-2 border-r border-border text-base font-semibold text-foreground"
      >
        <Phone className="size-5 text-primary" aria-hidden="true" />
        Call
      </a>
      <a
        href={waLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-whatsapp text-base font-semibold text-whatsapp-foreground"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}
