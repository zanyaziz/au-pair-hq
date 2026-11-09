"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { capFor, dayMinutes, fmtHours, timeLabel, validateWeek, weekMinutes } from "@/lib/rules";
import { Badge, Card, Meter, SectionTitle } from "@/components/ui";

export default function HomePage() {
  const { state } = useStore();
  const { settings } = state;
  const cap = capFor(settings.program);
  const totalMins = weekMinutes(state.week);
  const totalHrs = Math.round((totalMins / 60) * 10) / 10;
  const issues = validateWeek(state.week, settings.program);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  const nextStipend = state.stipends.find((s) => !s.paid);
  const today = state.week[0]; // sample week starts Monday

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-semibold text-teal-700">Au Pair HQ</p>
        <h1 className="text-2xl font-bold">{settings.familyName}</h1>
        <p className="text-sm text-stone-500">
          {settings.auPairName} · {settings.agency} · {settings.program} · arrives{" "}
          {new Date(settings.arrivalDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Demo mode — sample week Mon Nov 9–15, 2026. Connect Supabase in Setup to go live.
        </p>
      </header>

      <Card>
        <SectionTitle>Where the kids are</SectionTitle>
        <div className="space-y-2">
          {settings.kids.map((k) => (
            <div key={k.id} className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 px-3 py-2">
              <div>
                <p className="font-semibold">
                  {k.name} <span className="text-sm font-normal text-stone-500">· {k.age}</span>
                </p>
                <p className="text-xs text-stone-500">{k.school}</p>
              </div>
              <Badge tone={k.arrivingSoon ? "grey" : state.onDuty ? "teal" : "grey"}>
                {k.arrivingSoon ? "Arriving soon" : state.onDuty ? state.status : "With parents"}
              </Badge>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-stone-600">
          {state.onDuty ? (
            <>
              {settings.auPairName} is on duty — {state.status}
              {state.statusAt ? ` · ${state.statusAt}` : ""}. See <Link className="font-semibold text-teal-700 underline" href="/live">Live</Link>.
            </>
          ) : (
            <>{settings.auPairName} is off duty. Location sharing is off.</>
          )}
        </p>
      </Card>

      <Card>
        <SectionTitle>This week — hours</SectionTitle>
        <Meter value={totalHrs} max={cap} label="Scheduled hours" />
        <p className="mt-2 text-xs text-stone-500">
          Cap: {cap} hrs/week · max 10 hrs/day · {settings.program} program.{" "}
          {totalMins > 0 && `${cap - totalHrs} hrs of headroom left.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {errors.length === 0 ? (
            <Badge tone="green">All compliance checks pass</Badge>
          ) : (
            <Badge tone="red">{errors.length} compliance problem{errors.length > 1 ? "s" : ""}</Badge>
          )}
          {warnings.map((w) => (
            <Badge key={w.message} tone="amber">Warning</Badge>
          ))}
          <Badge tone={state.published ? "green" : "amber"}>
            {state.published ? "Schedule published" : "Schedule draft — not published"}
          </Badge>
          <Badge tone={state.auPairAck ? "green" : "amber"}>
            {state.auPairAck ? "Au pair acknowledged" : "Awaiting au pair acknowledgement"}
          </Badge>
        </div>
        {errors.map((e) => (
          <p key={e.message} className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{e.message}</p>
        ))}
        {warnings.map((w) => (
          <p key={w.message} className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{w.message}</p>
        ))}
      </Card>

      <Card>
        <SectionTitle>Today — Monday</SectionTitle>
        {today.off ? (
          <p className="text-sm text-stone-600">Day off. No shifts scheduled.</p>
        ) : (
          <ul className="space-y-2">
            {today.shifts.map((s, i) => (
              <li key={i} className="flex justify-between rounded-xl bg-stone-50 px-3 py-2 text-sm">
                <span>Shift {i + 1}</span>
                <span className="font-semibold">
                  {timeLabel(s.start)} – {timeLabel(s.end)} · {fmtHours(dayMinutes({ ...today, shifts: [s] }))}
                </span>
              </li>
            ))}
            <li className="rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-900">
              2:30 PM — Aydin pickup, Medina Academy · 5:00 PM — park · 7:30 PM — handoff to parents
            </li>
          </ul>
        )}
        <Link href="/today" className="mt-3 inline-block text-sm font-semibold text-teal-700 underline">
          Open the au pair&apos;s Today view
        </Link>
      </Card>

      <Card>
        <SectionTitle>Stipend due this week</SectionTitle>
        {nextStipend ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">${nextStipend.amount.toFixed(2)}</p>
              <p className="text-sm text-stone-500">Week of {nextStipend.weekOf} · federal floor, paid even in light weeks</p>
            </div>
            <Link href="/compliance" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
              Mark paid
            </Link>
          </div>
        ) : (
          <p className="text-sm text-stone-600">All stipends up to date.</p>
        )}
      </Card>

      <Card>
        <SectionTitle>Quick links</SectionTitle>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/schedule" className="rounded-xl bg-stone-100 px-3 py-3 font-semibold">Build this week</Link>
          <Link href="/log" className="rounded-xl bg-stone-100 px-3 py-3 font-semibold">Daily log</Link>
          <Link href="/live" className="rounded-xl bg-stone-100 px-3 py-3 font-semibold">Duty Mode / Live</Link>
          <Link href="/compliance" className="rounded-xl bg-stone-100 px-3 py-3 font-semibold">Compliance &amp; pay</Link>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          Baby note: an au pair cannot be left alone with an infant under 3 months old. The baby profile is marked
          &ldquo;arriving soon&rdquo; — plan parent coverage for the first 3 months after birth.
        </p>
      </Card>
    </main>
  );
}
