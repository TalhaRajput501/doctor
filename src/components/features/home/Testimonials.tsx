import { MessageSquareQuote, Star } from "lucide-react";
import { doctorContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/Section";

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className }: TestimonialsProps) {
  const reviews = doctorContent.testimonials.reviews;
  if (reviews.length === 0) return null;

  return (
    <Section id="testimonials" tone="muted" className={cn("border-y border-border", className)}>
      <div className="max-w-xl">
        <p className="text-[13px] font-semibold leading-[1.7] text-primary">Patient reviews</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {doctorContent.testimonials.heading}
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 3).map((review, index) => (
          <article
            key={`${review.firstName}-${review.area}-${index}`}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <MessageSquareQuote className="size-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
            {typeof review.rating === "number" && (
              <div className="mt-4 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, ratingIndex) => (
                  <Star key={ratingIndex} className="size-4 fill-accent text-accent-foreground" aria-hidden="true" />
                ))}
              </div>
            )}
            <blockquote className="mt-5 text-base leading-[1.7] text-foreground">
              “{review.quote}”
            </blockquote>
            <div className="mt-6">
              <p className="text-[15px] font-semibold leading-[1.7] text-foreground">{review.firstName}</p>
              <p className="text-[15px] leading-[1.7] text-muted-foreground">{review.area}</p>
              {review.sourceUrl && (
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[13px] font-semibold leading-[1.7] text-primary underline underline-offset-4"
                >
                  View source
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
