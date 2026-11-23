import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends Omit<ComponentProps<"section">, "children"> {
  tone?: "default" | "muted" | "primary";
  children: ReactNode;
}

export function Section({ tone = "default", className, children, ...props }: SectionProps) {
  const toneClass = {
    default: "bg-background text-foreground",
    muted: "bg-secondary text-foreground",
    primary: "bg-primary text-primary-foreground",
  }[tone];

  return (
    <section className={cn(toneClass, "py-16 md:py-24", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
