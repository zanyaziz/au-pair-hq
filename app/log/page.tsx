"use client";

import { useState } from "react";
import { useStore, uid, nowTime } from "@/lib/store";
import { Card, PrimaryButton, SectionTitle } from "@/components/ui";

const KINDS = ["Meal", "Nap", "Mood", "Homework", "Incident", "Note"];

export default function LogPage() {
  const { state, update } = useStore();
  const [kind, setKind] = useState("Meal");
  const [child, setChild] = useState("Aydin");
  const [text, setText] = useState("");

  const summary = [
    `Today ${state.settings.auPairName} was on duty and logged ${state.log.length} entries.`,
    `Last status: ${state.status}${state.statusAt ? ` at ${state.statusAt}` : ""}.`,
    "Meals, naps and any incidents are listed below — this is the 7 PM summary parents receive.",
  ];

  return (
    <main className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Daily Log</h1>
        <p className="text-sm text-stone-500">
          What the kids ate, how they napped, mood, homework, incidents — one private family feed, not scattered texts.
        </p>
      </header>

      <Card className="border-teal-200 bg-teal-50">
        <SectionTitle>7 PM summary for parents</SectionTitle>
        {summary.map((s) => (
          <p key={s} className="text-sm leading-relaxed text-teal-900">{s}</p>
        ))}
      </Card>

      <Card>
        <SectionTitle>Add an entry</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
            {KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <select value={child} onChange={(e) => setChild(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
            {state.settings.kids.map((k) => (
              <option key={k.id} value={k.name}>{k.name}</option>
            ))}
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Lunch — pasta, ate half. Nap 1:00–2:00 PM, slept well."
          rows={3}
          className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <PrimaryButton
          disabled={!text.trim()}
          className="mt-2"
          onClick={() => {
            update((s) => ({
              ...s,
              log: [{ id: uid(), time: nowTime(), kind, child, text: text.trim() }, ...s.log],
            }));
            setText("");
          }}
        >
          Add to log
        </PrimaryButton>
      </Card>

      <Card>
        <SectionTitle>Today&apos;s entries</SectionTitle>
        {state.log.length === 0 ? (
          <p className="text-sm text-stone-600">Nothing logged yet today.</p>
        ) : (
          <ul className="space-y-2">
            {state.log.map((e) => (
              <li key={e.id} className="rounded-xl bg-stone-50 px-3 py-2 text-sm">
                <p className="font-semibold">
                  {e.time} · {e.kind} · {e.child}
                </p>
                <p className="text-stone-700">{e.text}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
