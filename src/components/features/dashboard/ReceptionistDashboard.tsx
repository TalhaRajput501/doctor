"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Check,
  Clock3,
  LogOut,
  Plus,
  RefreshCw,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QueuePatient {
  id: string;
  token: number;
  patientName: string;
  relation: string;
  source: "walkIn" | "whatsapp";
  priority?: number;
  ahead?: number;
  estimatedMinutes?: number;
  calledAt?: string;
}

interface QueueData {
  clinic: { doctorName: string; isOpen: boolean };
  visitDate: string;
  shift: string;
  averageMinutes: number;
  waiting: QueuePatient[];
  serving: QueuePatient | null;
  servingCount: number;
  waitingCount: number;
  completedCount: number;
}

const RELATIONS = ["self", "wife", "mother", "sister", "daughter", "other"];

function errorText(code: string) {
  const messages: Record<string, string> = {
    RECEPTIONIST_CLINIC_NOT_CONFIGURED: "Set the receptionist clinic ID in the server environment.",
    BAD_CLINIC: "The configured clinic could not be found.",
    CLINIC_CLOSED: "Walk-ins cannot be added while the clinic is closed.",
    BAD_NAME: "Enter the patient name.",
    BAD_PHONE: "Enter a valid phone number or leave the field blank.",
    ALREADY_SERVING: "Finish the current visit before calling another patient.",
    QUEUE_BUSY: "Another queue action is in progress. Refresh and retry.",
    QUEUE_INCONSISTENT: "More than one patient is marked as serving. Ask an administrator to review the queue.",
    STALE_TOKEN: "The current patient changed. Refresh the queue before continuing.",
    UNAUTHORIZED: "Your session ended. Sign in again.",
  };
  return messages[code] ?? "The request could not be completed. Refresh and retry.";
}

async function getQueue(): Promise<QueueData> {
  const response = await fetch("/api/receptionist/queue", { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(errorText(result.code));
  return result;
}

async function refreshQueue(
  setQueue: (queue: QueueData) => void,
  setError: (message: string) => void,
  setLastUpdated: (date: Date) => void,
  setLoading: (loading: boolean) => void,
  silent = false
) {
  if (!silent) setLoading(true);
  try {
    setQueue(await getQueue());
    setLastUpdated(new Date());
    setError("");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Could not load the queue.");
  } finally {
    if (!silent) setLoading(false);
  }
}

function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Karachi",
  }).format(new Date(`${value}T12:00:00+05:00`));
}

function formatTime(value: Date | null) {
  if (!value) return "Not refreshed yet";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  }).format(value);
}

function formatRelation(value: string) {
  return value === "self" ? "Self" : value.charAt(0).toUpperCase() + value.slice(1);
}

function formatShift(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ReceptionistDashboard({ clinicConfigured }: { clinicConfigured: boolean }) {
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("self");

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const nextQueue = await getQueue();
        if (active) {
          setQueue(nextQueue);
          setLastUpdated(new Date());
          setError("");
          setLoading(false);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load the queue.");
          setLoading(false);
        }
      }
    };

    void poll();
    const interval = window.setInterval(() => void poll(), 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  async function refresh(silent = false) {
    await refreshQueue(setQueue, setError, setLastUpdated, setLoading, silent);
  }

  async function sendAction(path: string, body?: Record<string, string>) {
    setActionBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(errorText(result.code));
      if (result.queueEmpty) setNotice("No patients are waiting.");
      else if (result.now) setNotice(`Now calling token #${result.now.token}, ${result.now.patientName}.`);
      else if (result.completedToken) setNotice(`Visit for token #${result.completedToken} completed.`);
      await refresh(true);
      return result;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The action could not be completed.");
      return null;
    } finally {
      setActionBusy(false);
    }
  }

  async function submitWalkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await sendAction("/api/receptionist/walk-in", {
      patientName,
      phone,
      relation,
    });
    if (result?.ok) {
      setNotice(`Walk-in registered as token #${result.token.number}.`);
      setPatientName("");
      setPhone("");
      setRelation("self");
      setWalkInOpen(false);
    }
  }

  async function signOut() {
    await fetch("/api/receptionist/logout", { method: "POST" });
    window.location.reload();
  }

  const hasQueueIssue = Boolean(queue && queue.servingCount > 1);
  const dateLabel = queue ? formatVisitDate(queue.visitDate) : "Today";

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Stethoscope aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{queue?.clinic.doctorName ?? "Clinic reception"}</p>
              <p className="text-xs text-muted-foreground">Reception desk</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Refresh queue"
              className="size-10"
              disabled={loading}
              onClick={() => void refresh()}
              title="Refresh queue"
              variant="outline"
            >
              <RefreshCw aria-hidden="true" className={loading ? "animate-spin" : ""} />
            </Button>
            <Button
              aria-label="Sign out"
              className="size-10"
              onClick={() => void signOut()}
              title="Sign out"
              variant="ghost"
            >
              <LogOut aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl">Today&apos;s queue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {dateLabel}{queue ? `  |  ${formatShift(queue.shift)} shift` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              Updated {formatTime(lastUpdated)}
            </p>
            <Button
              className="h-11 gap-2 px-4"
              disabled={!clinicConfigured || queue?.clinic.isOpen === false}
              onClick={() => setWalkInOpen(true)}
            >
              <Plus aria-hidden="true" />
              Add walk-in
            </Button>
          </div>
        </div>

        {!clinicConfigured ? (
          <div className="mb-5 rounded-md border border-border bg-accent px-4 py-3 text-sm text-accent-foreground" role="alert">
            Set the receptionist clinic ID in the server environment to load this queue.
          </div>
        ) : null}
        {error ? (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            <span>{error}</span>
            <Button aria-label="Dismiss message" className="size-7" onClick={() => setError("")} size="icon-sm" variant="ghost">
              <X aria-hidden="true" />
            </Button>
          </div>
        ) : null}
        {notice ? (
          <div className="mb-5 flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-3 text-sm text-secondary-foreground" role="status">
            <Check aria-hidden="true" className="size-4 shrink-0" />
            <span>{notice}</span>
          </div>
        ) : null}
        {hasQueueIssue ? (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            Multiple patients are marked as serving. Queue actions are paused until the data is reviewed.
          </div>
        ) : null}

        <section aria-label="Queue totals" className="mb-7 grid grid-cols-3 border-y border-border py-4">
          <Metric label="Waiting" value={queue?.waitingCount ?? "–"} icon={<UsersRound aria-hidden="true" />} />
          <Metric label="Being seen" value={queue?.servingCount ?? "–"} icon={<UserRound aria-hidden="true" />} />
          <Metric label="Completed" value={queue?.completedCount ?? "–"} icon={<Check aria-hidden="true" />} />
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:gap-10">
          <section aria-labelledby="waiting-heading">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold" id="waiting-heading">Waiting list</h2>
              <span className="text-sm text-muted-foreground">Priority first, then token</span>
            </div>
            {loading && !queue ? (
              <p className="border-t border-border py-6 text-sm text-muted-foreground">Loading today&apos;s queue...</p>
            ) : queue?.waiting.length ? (
              <ol className="divide-y divide-border border-y border-border">
                {queue.waiting.map((patient) => (
                  <li className="flex min-w-0 items-center gap-3 py-4" key={patient.id}>
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary text-sm font-semibold text-primary">
                      #{patient.token}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{patient.patientName}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {/* {formatRelation(patient.relation)}  */}
                        {/* <span aria-hidden="true">·</span>  */}
                        {patient.source === "walkIn" ? "Walk-in" : "WhatsApp"}
                        {patient.priority ? <span className="ml-2 text-accent-foreground">Priority</span> : null}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="flex items-center justify-end gap-1 text-sm font-medium">
                        <Clock3 aria-hidden="true" className="size-3.5 text-muted-foreground" />
                        {patient.estimatedMinutes} min
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{patient.ahead} ahead</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="border-y border-border py-8">
                <p className="font-medium">No one is waiting</p>
                <p className="mt-1 text-sm text-muted-foreground">New walk-ins and WhatsApp bookings will appear here.</p>
              </div>
            )}
          </section>

          <section aria-labelledby="serving-heading">
            <h2 className="mb-3 text-lg font-semibold" id="serving-heading">Currently being seen</h2>
            {queue?.serving ? (
              <div className="rounded-lg border border-border bg-secondary/70 p-5 sm:p-6">
                <p className="text-sm font-medium text-muted-foreground">Now with the doctor</p>
                <p className="mt-3 font-heading text-4xl font-semibold text-primary">#{queue.serving.token}</p>
                <p className="mt-2 break-words text-xl font-semibold">{queue.serving.patientName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatRelation(queue.serving.relation)} <span aria-hidden="true">·</span> {queue.serving.source === "walkIn" ? "Walk-in" : "WhatsApp"}
                </p>
                <Button
                  className="mt-6 h-11 w-full gap-2"
                  disabled={actionBusy || hasQueueIssue}
                  onClick={() => void sendAction("/api/receptionist/finish", { tokenId: queue.serving!.id })}
                  variant="outline"
                >
                  <Check aria-hidden="true" />
                  Finish visit
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-secondary/70 p-5 sm:p-6">
                <p className="text-sm font-medium text-muted-foreground">No active patient</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {queue?.waitingCount ? "Call the next patient when they are ready." : "The queue is clear for now."}
                </p>
                <Button
                  className="mt-6 h-11 w-full gap-2"
                  disabled={actionBusy || loading || !queue?.waitingCount || hasQueueIssue}
                  onClick={() => void sendAction("/api/receptionist/call-next")}
                >
                  <UserRound aria-hidden="true" />
                  Call next
                </Button>
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Wait estimates use an average of {queue?.averageMinutes ?? 6} minutes per consultation.
            </p>
          </section>
        </div>
      </div>

      {walkInOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setWalkInOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setWalkInOpen(false);
          }}
          role="presentation"
        >
          <section aria-labelledby="walk-in-title" aria-modal="true" className="w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-xl sm:p-6" role="dialog">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold" id="walk-in-title">Register walk-in</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add a patient to today&apos;s {queue?.shift ?? "evening"} queue.</p>
              </div>
              <Button aria-label="Close walk-in form" className="size-9" onClick={() => setWalkInOpen(false)} size="icon" variant="ghost">
                <X aria-hidden="true" />
              </Button>
            </div>
            <form className="space-y-4" onSubmit={(event) => void submitWalkIn(event)}>
              <label className="block space-y-2 text-sm font-medium" htmlFor="walk-in-name">
                Patient name
                <Input autoFocus id="walk-in-name" maxLength={60} onChange={(event) => setPatientName(event.target.value)} required value={patientName} />
              </label>
              <label className="block space-y-2 text-sm font-medium" htmlFor="walk-in-phone">
                Phone number <span className="font-normal text-muted-foreground">(optional)</span>
                <Input autoComplete="tel" id="walk-in-phone" inputMode="tel" onChange={(event) => setPhone(event.target.value)} placeholder="03XX XXXXXXX" value={phone} />
              </label>
              <label className="block space-y-2 text-sm font-medium" htmlFor="walk-in-relation">
                Booking for
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                  id="walk-in-relation"
                  onChange={(event) => setRelation(event.target.value)}
                  value={relation}
                >
                  {RELATIONS.map((option) => <option key={option} value={option}>{formatRelation(option)}</option>)}
                </select>
              </label>
              <div className="flex gap-3 pt-2">
                <Button className="h-11 flex-1" disabled={actionBusy} type="submit">
                  {actionBusy ? "Adding..." : "Add to queue"}
                </Button>
                <Button className="h-11" disabled={actionBusy} onClick={() => setWalkInOpen(false)} type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="px-2 first:pl-0 sm:px-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums sm:text-3xl">{value}</p>
    </div>
  );
}