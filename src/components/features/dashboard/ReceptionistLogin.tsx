"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReceptionistLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/receptionist/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          result.code === "INVALID_PASSWORD"
            ? "That password did not match. Try again."
            : "Receptionist access is not configured on the server."
        );
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the server. Check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-medium">Dr. Shafqat Batool</p>
            <p className="text-sm text-muted-foreground">Clinic reception</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
            <LockKeyhole aria-hidden="true" className="size-5" />
          </div>
          <h1 className="font-heading text-2xl font-semibold">Receptionist sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage today&apos;s patient queue.
          </p>

          {!configured ? (
            <p className="mt-5 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
              Receptionist access needs to be configured on the server.
            </p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium" htmlFor="receptionist-password">
                Password
                <Input
                  autoComplete="current-password"
                  id="receptionist-password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>
              {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
              <Button className="h-11 w-full" disabled={submitting} type="submit">
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}