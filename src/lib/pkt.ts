// Pakistan time helpers (PKT has no daylight saving). The server may run in UTC,
// so never use plain new Date() to decide what "today" is.

/** "YYYY-MM-DD" in Pakistan time. offsetDays: 0 = today, 1 = tomorrow. */
export function pktDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
}

/** Current hour 0-23 in Pakistan time. */
export function pktHour() {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Karachi",
    }).format(new Date())
  );
}