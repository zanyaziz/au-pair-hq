"use client";

import { useStore, uid, nowTime } from "@/lib/store";
import { Badge, Card, PrimaryButton, SectionTitle } from "@/components/ui";

const TIMELINE = [
  { time: "7:00 AM", text: "Wake Aydin, breakfast (oatmeal + banana)", done: true },
  { time: "8:15 AM", text: "Drop Aydin at Medina Academy", done: true },
  { time: "9:00 AM", text: "Your time — class / errands", done: false },
  { time: "2:30 PM", text: "Pick up Aydin from Medina Academy", done: false },
  { time: "3:00 PM", text: "Snack + homework / quiet play", done: false },
  { time: "5:00 PM", text: "Park or garden play", done: false },
  { time: "6:30 PM", text: "Dinner prep with the kids", done: false },
  { time: "7:30 PM", text: "Handoff to parents — day ends", done: false },
];

const STATUS_BUTTONS = ["Picked up", "Home", "At park", "At school", "In the car"];

export default function TodayPage() {
  const { state, update } = useStore();
  const { settings } = state;

  const setStatus = (status: string) => {
    const at = nowTime();
    update((s) => ({
      ...s,
      status,
      statusAt: at,
      log: [
        ...s.log,
        { id: uid(), time: at, kind: "Status", child: "Aydin", text: `${status} — set by ${settings.auPairName}.` },
      ],
    }));
  };

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-semibold text-teal-700">Today — au pair view</p>
        <h1 className="text-2xl font-bold">Hi, {settings.auPairName}</h1>
        <p className="text-sm text-stone-500">Monday, Nov 9 · Shift 7:00–9:00 AM + 2:30–7:30 PM (7 hrs)</p>
      </header>

      <Card className="border-teal-200 bg-teal-50">
        <SectionTitle>Note from the parents</SectionTitle>
        <p className="text-sm leading-relaxed">{settings.parentNote}</p>
      </Card>

      <Card>
        <SectionTitle>Clock in / out</SectionTitle>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone={state.onDuty ? "green" : "grey"}>{state.onDuty ? "On duty" : "Off duty"}</Badge>
            <p className="mt-2 text-sm text-stone-600">
              {state.onDuty
                ? "Location sharing is ON while you are on duty. It turns off automatically when you clock out."
                : "Location sharing is OFF. Clock in to start your shift."}
            </p>
          </div>
          <PrimaryButton
            onClick={() =>
              update((s) => ({
                ...s,
                onDuty: !s.onDuty,
                status: !s.onDuty ? "On duty" : "Off duty",
                statusAt: nowTime(),
                location: !s.onDuty ? s.location : null,
              }))
            }
          >
            {state.onDuty ? "Clock out" : "Clock in"}
          </PrimaryButton>
        </div>
      </Card>

      <Card>
        <SectionTitle>Where are the kids?</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          Tap one — it updates the parents&apos; Home and Live screens and the daily log instantly.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_BUTTONS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setStatus(b)}
              className={`rounded-xl border px-3 py-4 text-sm font-bold ${
                state.status === b
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-stone-300 bg-white text-stone-800"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-stone-600">
          Current status: <strong>{state.status}</strong>
          {state.statusAt ? ` · ${state.statusAt}` : ""}
        </p>
      </Card>

      <Card>
        <SectionTitle>Your timeline today</SectionTitle>
        <ul className="space-y-2">
          {TIMELINE.map((t) => (
            <li key={t.time} className="flex gap-3 rounded-xl bg-stone-50 px-3 py-2 text-sm">
              <span className="w-16 shrink-0 font-semibold">{t.time}</span>
              <span className={t.done ? "text-stone-400 line-through" : ""}>{t.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle>Kids — quick reference</SectionTitle>
        {settings.kids.map((k) => (
          <div key={k.id} className="mb-2 rounded-xl bg-stone-50 px-3 py-2 text-sm">
            <p className="font-semibold">{k.name} · {k.age}</p>
            <p className="text-stone-600">{k.school}</p>
            <p className="text-stone-600">Bedtime: {k.bedtime} · Allergies: {k.allergies}</p>
            <p className="text-stone-600">{k.notes}</p>
          </div>
        ))}
      </Card>
    </main>
  );
}
