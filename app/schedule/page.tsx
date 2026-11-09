"use client";

import { useStore } from "@/lib/store";
import { capFor, dayMinutes, fmtHours, timeLabel, validateWeek, weekMinutes } from "@/lib/rules";
import { Badge, Card, Meter, PrimaryButton, SectionTitle } from "@/components/ui";

export default function SchedulePage() {
  const { state, update } = useStore();
  const { settings } = state;
  const cap = capFor(settings.program);
  const totalMins = weekMinutes(state.week);
  const totalHrs = Math.round((totalMins / 60) * 10) / 10;
  const issues = validateWeek(state.week, settings.program);
  const errors = issues.filter((i) => i.level === "error");

  const setWeek = (week: typeof state.week) =>
    update((s) => ({ ...s, week, published: false, auPairAck: false }));

  return (
    <main className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Week Builder</h1>
        <p className="text-sm text-stone-500">
          Sample week Mon Nov 9–15, 2026 · {settings.program} · cap {cap} hrs/week, 10 hrs/day.
          Split shifts count as one day&apos;s total. Hours cannot be banked across weeks.
        </p>
      </header>

      <Card>
        <Meter value={totalHrs} max={cap} label="Week total" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={errors.length ? "red" : "green"}>
            {errors.length ? `${errors.length} problem${errors.length > 1 ? "s" : ""} — cannot publish` : "Valid — ready to publish"}
          </Badge>
          <Badge tone="grey">{state.week.filter((d) => d.off).length} day(s) off · need 1.5+</Badge>
          <Badge tone={state.weekendOffDone ? "green" : "amber"}>
            {state.weekendOffDone ? "Full weekend off this month: done" : "Full weekend off this month: not yet scheduled"}
          </Badge>
        </div>
        {issues.map((i) => (
          <p
            key={i.message}
            className={`mt-2 rounded-lg px-3 py-2 text-sm ${i.level === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}
          >
            {i.level === "error" ? "Blocked: " : "Heads up: "}{i.message}
          </p>
        ))}
      </Card>

      {state.week.map((day, di) => {
        const mins = dayMinutes(day);
        const overDay = !day.off && mins > 10 * 60;
        return (
          <Card key={day.day} className={overDay ? "border-red-300 bg-red-50/40" : ""}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{day.day}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{day.off ? "Day off" : fmtHours(mins)}</span>
                {overDay && <Badge tone="red">Over 10h — blocked</Badge>}
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={day.off}
                    onChange={(e) => {
                      const week = state.week.map((d, i) =>
                        i === di ? { ...d, off: e.target.checked, shifts: e.target.checked ? [] : d.shifts } : d
                      );
                      setWeek(week);
                    }}
                  />
                  Off
                </label>
              </div>
            </div>
            {!day.off && (
              <div className="mt-3 space-y-2">
                {day.shifts.map((s, si) => (
                  <div key={si} className="flex items-center gap-2 text-sm">
                    <label>
                      Start{" "}
                      <input
                        type="time"
                        value={s.start}
                        onChange={(e) => {
                          const week = state.week.map((d, i) =>
                            i === di
                              ? { ...d, shifts: d.shifts.map((sh, j) => (j === si ? { ...sh, start: e.target.value } : sh)) }
                              : d
                          );
                          setWeek(week);
                        }}
                        className="rounded-lg border border-stone-300 px-2 py-1"
                      />
                    </label>
                    <label>
                      End{" "}
                      <input
                        type="time"
                        value={s.end}
                        onChange={(e) => {
                          const week = state.week.map((d, i) =>
                            i === di
                              ? { ...d, shifts: d.shifts.map((sh, j) => (j === si ? { ...sh, end: e.target.value } : sh)) }
                              : d
                          );
                          setWeek(week);
                        }}
                        className="rounded-lg border border-stone-300 px-2 py-1"
                      />
                    </label>
                    <span className="text-stone-500">{timeLabel(s.start)} – {timeLabel(s.end)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const week = state.week.map((d, i) =>
                          i === di ? { ...d, shifts: d.shifts.filter((_, j) => j !== si) } : d
                        );
                        setWeek(week);
                      }}
                      className="ml-auto text-sm font-semibold text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const week = state.week.map((d, i) =>
                      i === di ? { ...d, shifts: [...d.shifts, { start: "15:00", end: "18:00" }] } : d
                    );
                    setWeek(week);
                  }}
                  className="text-sm font-semibold text-teal-700 underline"
                >
                  + Add a split shift
                </button>
                <p className="text-xs text-stone-500">
                  Try it: set Saturday to 8:00 AM – 7:00 PM (11 hrs) and watch the validator refuse it.
                </p>
              </div>
            )}
          </Card>
        );
      })}

      <Card>
        <SectionTitle>Publish</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          Publishing locks the week and asks {settings.auPairName} to acknowledge it, so she can plan her own time
          around it. Publish by Sunday evening for the week ahead.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton
            disabled={errors.length > 0}
            onClick={() => update((s) => ({ ...s, published: true }))}
          >
            Publish this week
          </PrimaryButton>
          {state.published && (
            <button
              type="button"
              onClick={() => update((s) => ({ ...s, auPairAck: true }))}
              className="rounded-xl border border-teal-700 px-4 py-3 text-sm font-semibold text-teal-700"
            >
              Simulate au pair acknowledgement
            </button>
          )}
          <span className="text-sm text-stone-500">
            {state.published
              ? state.auPairAck
                ? "Published and acknowledged."
                : "Published — awaiting acknowledgement."
              : "Draft — not published yet."}
          </span>
        </div>
        {errors.length > 0 && (
          <p className="mt-2 text-sm text-red-700">
            Fix the blocked items above before publishing — the caps are federal J-1 rules, not suggestions.
          </p>
        )}
      </Card>
    </main>
  );
}
