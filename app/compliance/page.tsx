"use client";

import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { capFor, validateWeek, weekMinutes, fmtHours } from "@/lib/rules";
import { Badge, Card, PrimaryButton, SectionTitle } from "@/components/ui";

export default function CompliancePage() {
  const { state, update } = useStore();
  const { settings } = state;
  const cap = capFor(settings.program);
  const issues = validateWeek(state.week, settings.program);
  const [course, setCourse] = useState("");
  const [checkin, setCheckin] = useState("");

  const exportCsv = () => {
    const rows = [
      ["Au Pair HQ — sponsor summary"],
      ["Family", settings.familyName],
      ["Au pair", settings.auPairName],
      ["Agency", settings.agency],
      ["Program", settings.program],
      ["Arrival", settings.arrivalDate],
      ["Week hours scheduled", `${fmtHours(weekMinutes(state.week))} / ${cap}h cap`],
      ["Stipend per week", `$${settings.stipendWeekly.toFixed(2)}`],
      ["Vacation days used", `${state.vacationDaysUsed} / 10`],
      ["Education fund spent", `$${state.educationSpent} / $${settings.educationFund}`],
      ["Full weekend off this month", state.weekendOffDone ? "Yes" : "No"],
      [],
      ["Stipend payments"],
      ["Week of", "Amount", "Paid", "Paid date"],
      ...state.stipends.map((s) => [s.weekOf, s.amount.toFixed(2), s.paid ? "Yes" : "No", s.paidDate]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "au-pair-hq-sponsor-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Compliance &amp; Pay</h1>
        <p className="text-sm text-stone-500">
          The paper trail for the J-1 program — hours, time off, stipend, education, and check-ins in one place.
        </p>
      </header>

      <Card>
        <SectionTitle>Weekly rules — this week</SectionTitle>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Hours</span><strong>{fmtHours(weekMinutes(state.week))} / {cap}h cap</strong></li>
          <li className="flex justify-between"><span>Days off</span><strong>{state.week.filter((d) => d.off).length} (need 1.5+)</strong></li>
          <li className="flex justify-between"><span>Full weekend off this month</span><strong>{state.weekendOffDone ? "Done" : "Not yet"}</strong></li>
          <li className="flex justify-between"><span>Vacation used</span><strong>{state.vacationDaysUsed} / 10 days (2 weeks)</strong></li>
        </ul>
        {issues.filter((i) => i.level === "error").length === 0 ? (
          <p className="mt-3"><Badge tone="green">No compliance errors this week</Badge></p>
        ) : (
          issues.filter((i) => i.level === "error").map((i) => (
            <p key={i.message} className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{i.message}</p>
          ))
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, weekendOffDone: !s.weekendOffDone }))}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold"
          >
            {state.weekendOffDone ? "Mark full weekend off as not done" : "Mark this month's full weekend off as done"}
          </button>
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, vacationDaysUsed: Math.min(10, s.vacationDaysUsed + 1) }))}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold"
          >
            + 1 vacation day used
          </button>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Full weekend off = Friday night through Monday morning, once a month. Vacation = 2 weeks paid per year.
        </p>
      </Card>

      <Card>
        <SectionTitle>Stipend — ${settings.stipendWeekly.toFixed(2)}/week</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          The federal floor is paid every week, even in light weeks. It never goes up or down with hours worked.
        </p>
        <ul className="space-y-2">
          {state.stipends.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-sm">
              <span>Week of {s.weekOf} · <strong>${s.amount.toFixed(2)}</strong></span>
              {s.paid ? (
                <Badge tone="green">Paid {s.paidDate}</Badge>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    update((st) => ({
                      ...st,
                      stipends: st.stipends.map((x) =>
                        x.id === s.id ? { ...x, paid: true, paidDate: new Date().toISOString().slice(0, 10) } : x
                      ),
                    }))
                  }
                  className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Mark paid
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            update((s) => ({
              ...s,
              stipends: [
                ...s.stipends,
                { id: uid(), weekOf: new Date().toISOString().slice(0, 10), amount: settings.stipendWeekly, paid: false, paidDate: "" },
              ],
            }))
          }
          className="mt-3 text-sm font-semibold text-teal-700 underline"
        >
          + Add next week&apos;s stipend
        </button>
      </Card>

      <Card>
        <SectionTitle>Education — ${settings.educationFund} fund</SectionTitle>
        <p className="text-sm text-stone-600">
          Spent so far: <strong>${state.educationSpent}</strong> of ${settings.educationFund}. Host families
          contribute up to $500 toward academic coursework.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course name, e.g. ESL at Bellevue College"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <PrimaryButton
            disabled={!course.trim()}
            onClick={() => {
              update((s) => ({ ...s, courses: [...s.courses, { id: uid(), name: course.trim(), credits: "—", done: false }] }));
              setCourse("");
            }}
          >
            Add
          </PrimaryButton>
        </div>
        <ul className="mt-3 space-y-2">
          {state.courses.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-sm">
              <span>{c.name}</span>
              <button
                type="button"
                onClick={() =>
                  update((s) => ({ ...s, courses: s.courses.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)) }))
                }
                className="font-semibold text-teal-700 underline"
              >
                {c.done ? "Completed" : "Mark complete"}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, educationSpent: Math.min(settings.educationFund, s.educationSpent + 50) }))}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold"
          >
            + $50 spent
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle>Monthly LCC check-in</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          Your Local Childcare Consultant contacts the family and au pair monthly. Log each contact here.
        </p>
        <div className="flex gap-2">
          <input
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            placeholder="e.g. Nov call with LCC — all good"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <PrimaryButton
            disabled={!checkin.trim()}
            onClick={() => {
              update((s) => ({
                ...s,
                lccCheckins: [{ id: uid(), date: new Date().toISOString().slice(0, 10), note: checkin.trim() }, ...s.lccCheckins],
              }));
              setCheckin("");
            }}
          >
            Log
          </PrimaryButton>
        </div>
        <ul className="mt-3 space-y-2">
          {state.lccCheckins.length === 0 ? (
            <li className="text-sm text-stone-500">No check-ins logged yet — the first is due within 2 weeks of arrival.</li>
          ) : (
            state.lccCheckins.map((c) => (
              <li key={c.id} className="rounded-xl bg-stone-50 px-3 py-2 text-sm">
                <strong>{c.date}</strong> · {c.note}
              </li>
            ))
          )}
        </ul>
      </Card>

      <Card>
        <SectionTitle>Sponsor report</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          Download a CSV summary of hours, stipend, vacation, education and time off — ready to share with your
          sponsor agency if asked.
        </p>
        <PrimaryButton onClick={exportCsv}>Download sponsor summary (CSV)</PrimaryButton>
        <p className="mt-2 text-xs text-stone-500">
          Printable view: use your browser&apos;s Print function on this page for a paper copy.
        </p>
      </Card>
    </main>
  );
}
