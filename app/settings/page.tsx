"use client";

import { useStore } from "@/lib/store";
import { Card, PrimaryButton, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const { state, update, resetDemo } = useStore();
  const { settings } = state;
  const set = (patch: Partial<typeof settings>) =>
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  return (
    <main className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-stone-500">
          Everything here is editable — no real addresses, phone numbers or emails are stored in the code. Fill in
          your real details here, in the app, not in the repo.
        </p>
      </header>

      <Card>
        <SectionTitle>Family &amp; au pair</SectionTitle>
        <div className="grid gap-3 text-sm">
          <label>Family name<input value={settings.familyName} onChange={(e) => set({ familyName: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
          <label>Parents<input value={settings.parents} onChange={(e) => set({ parents: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
          <label>Au pair name<input value={settings.auPairName} onChange={(e) => set({ auPairName: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
          <label>Agency<input value={settings.agency} onChange={(e) => set({ agency: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
          <label>
            Program
            <select value={settings.program} onChange={(e) => set({ program: e.target.value as "Standard" | "EduCare" })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2">
              <option value="Standard">Standard — 45 hrs/week max</option>
              <option value="EduCare">EduCare — 30 hrs/week max</option>
            </select>
          </label>
          <label>Arrival date<input type="date" value={settings.arrivalDate} onChange={(e) => set({ arrivalDate: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
          <label>Weekly stipend ($)<input type="number" step="0.01" value={settings.stipendWeekly} onChange={(e) => set({ stipendWeekly: Number(e.target.value) || 0 })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
        </div>
      </Card>

      <Card>
        <SectionTitle>Kids</SectionTitle>
        {settings.kids.map((k, i) => (
          <div key={k.id} className="mb-4 rounded-xl border border-stone-200 p-3">
            <div className="grid gap-2 text-sm">
              <label>Name<input value={k.name} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Age<input value={k.age} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, age: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>School<input value={k.school} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, school: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Allergies<input value={k.allergies} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, allergies: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Medications<input value={k.meds} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, meds: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Bedtime<input value={k.bedtime} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, bedtime: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Pickup notes<input value={k.pickup} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, pickup: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
              <label>Notes<textarea value={k.notes} rows={2} onChange={(e) => set({ kids: settings.kids.map((x, j) => (j === i ? { ...x, notes: e.target.value } : x)) })} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" /></label>
            </div>
          </div>
        ))}
        <p className="text-xs text-stone-500">
          Update your daughter&apos;s name, school and routine here before Laura arrives — the sample profile is a
          placeholder on purpose.
        </p>
      </Card>

      <Card>
        <SectionTitle>House rules / playbook</SectionTitle>
        <textarea
          value={settings.houseRules}
          rows={5}
          onChange={(e) => set({ houseRules: e.target.value })}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <label className="mt-3 block text-sm font-semibold">
          Default parent note (pinned on Today)
          <textarea
            value={settings.parentNote}
            rows={3}
            onChange={(e) => set({ parentNote: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-normal"
          />
        </label>
      </Card>

      <Card>
        <SectionTitle>Demo data</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          This build runs in demo mode (localStorage) until Supabase is connected. Resetting restores the sample week
          and sample log entries.
        </p>
        <PrimaryButton onClick={resetDemo}>Reset demo data</PrimaryButton>
      </Card>
    </main>
  );
}
