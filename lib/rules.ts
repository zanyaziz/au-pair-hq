export type Shift = { start: string; end: string };
export type DayPlan = { day: string; off: boolean; shifts: Shift[] };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function fmtHours(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function dayMinutes(plan: DayPlan): number {
  if (plan.off) return 0;
  return plan.shifts.reduce(
    (sum, s) => sum + Math.max(0, toMinutes(s.end) - toMinutes(s.start)),
    0
  );
}

export function weekMinutes(week: DayPlan[]): number {
  return week.reduce((sum, d) => sum + dayMinutes(d), 0);
}

export function capFor(program: "Standard" | "EduCare"): number {
  return program === "EduCare" ? 30 : 45;
}

export type ValidationIssue = {
  level: "error" | "warning";
  message: string;
};

export function validateWeek(
  week: DayPlan[],
  program: "Standard" | "EduCare"
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const cap = capFor(program);
  for (const d of week) {
    const mins = dayMinutes(d);
    if (!d.off && mins > 10 * 60) {
      issues.push({
        level: "error",
        message: `${d.day}: ${fmtHours(mins)} in one day — over the 10-hour daily cap. Shorten or split this day.`,
      });
    }
    if (!d.off && mins === 0) {
      issues.push({
        level: "warning",
        message: `${d.day} has no hours and is not marked as a day off. Mark it off or add a shift.`,
      });
    }
    for (const s of d.shifts) {
      if (toMinutes(s.end) <= toMinutes(s.start)) {
        issues.push({
          level: "error",
          message: `${d.day}: shift ${s.start}–${s.end} ends before it starts.`,
        });
      }
    }
  }
  const total = weekMinutes(week);
  if (total > cap * 60) {
    issues.push({
      level: "error",
      message: `Week total ${fmtHours(total)} exceeds the ${cap}-hour weekly cap for ${program}. Remove ${fmtHours(total - cap * 60)}.`,
    });
  }
  if (total > (cap - 5) * 60 && total <= cap * 60) {
    issues.push({
      level: "warning",
      message: `Week total ${fmtHours(total)} leaves less than 5 hours of cushion under the ${cap}-hour cap for a sick day or late meeting.`,
    });
  }
  const daysOff = week.filter((d) => d.off).length;
  if (daysOff < 1.5) {
    issues.push({
      level: "error",
      message: `Only ${daysOff} day(s) off this week — the program requires at least 1.5 days off per week.`,
    });
  }
  return issues;
}

export function timeLabel(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}
