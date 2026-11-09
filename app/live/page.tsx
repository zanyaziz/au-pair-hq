"use client";

import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { Badge, Card, PrimaryButton, SectionTitle } from "@/components/ui";

export default function LivePage() {
  const { state, update } = useStore();
  const { settings } = state;
  const [locMsg, setLocMsg] = useState("");
  const [trip, setTrip] = useState({ purpose: "", miles: "", gas: "" });

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocMsg("This browser does not support geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update((s) => ({
          ...s,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            at: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          },
        }));
        setLocMsg("Location shared — visible to parents only while you are on duty.");
      },
      () => setLocMsg("Location permission denied. Check-ins still work without it."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <main className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Duty Mode / Live</h1>
        <p className="text-sm text-stone-500">
          Location is shared <strong>only while {settings.auPairName} is clocked in on duty</strong>. It stops
          automatically at clock-out and on days off — and she can see exactly what parents see here.
        </p>
      </header>

      <Card>
        <SectionTitle>Duty Mode</SectionTitle>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone={state.onDuty ? "green" : "grey"}>
              {state.onDuty ? "On duty — sharing" : "Off duty — not sharing"}
            </Badge>
            <p className="mt-2 text-sm text-stone-600">
              {state.location
                ? `Last shared location: ${state.location.lat.toFixed(4)}, ${state.location.lng.toFixed(4)} (±${state.location.accuracy} m) at ${state.location.at}.`
                : "No location shared yet this shift."}
            </p>
            {locMsg && <p className="mt-1 text-sm text-teal-800">{locMsg}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <PrimaryButton disabled={!state.onDuty} onClick={shareLocation}>
              Share my location
            </PrimaryButton>
            <button
              type="button"
              onClick={() => update((s) => ({ ...s, onDuty: !s.onDuty, location: !s.onDuty ? s.location : null }))}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold"
            >
              {state.onDuty ? "Clock out" : "Clock in"}
            </button>
          </div>
        </div>
        {!state.onDuty && (
          <p className="mt-2 text-xs text-stone-500">
            Clock in from Today or here first — location sharing is disabled while off duty by design.
          </p>
        )}
      </Card>

      <Card>
        <SectionTitle>Kids status board</SectionTitle>
        {settings.kids.map((k) => (
          <div key={k.id} className="mb-2 flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2">
            <div>
              <p className="font-semibold">{k.name}</p>
              <p className="text-xs text-stone-500">{k.school}</p>
            </div>
            <Badge tone={k.arrivingSoon ? "grey" : state.onDuty ? "teal" : "grey"}>
              {k.arrivingSoon ? "Arriving soon" : state.onDuty ? state.status : "With parents"}
            </Badge>
          </div>
        ))}
        <p className="mt-2 text-sm text-stone-600">
          Last check-in: <strong>{state.status}</strong>
          {state.statusAt ? ` at ${state.statusAt}` : " — none yet today."}
        </p>
      </Card>

      <Card>
        <SectionTitle>Car log</SectionTitle>
        <p className="mb-3 text-sm text-stone-600">
          Log every drive with the kids — purpose, miles, gas, and the car-seat check. Snoqualmie driving is
          essential, so this is the paper trail if anything is ever asked.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={trip.purpose}
            onChange={(e) => setTrip({ ...trip, purpose: e.target.value })}
            placeholder="Purpose, e.g. School pickup"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <input
            value={trip.miles}
            onChange={(e) => setTrip({ ...trip, miles: e.target.value })}
            placeholder="Miles"
            inputMode="decimal"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <input
            value={trip.gas}
            onChange={(e) => setTrip({ ...trip, gas: e.target.value })}
            placeholder="Gas $ (optional)"
            inputMode="decimal"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <PrimaryButton
            disabled={!trip.purpose || !trip.miles}
            onClick={() => {
              update((s) => ({
                ...s,
                carTrips: [
                  { id: uid(), date: new Date().toISOString().slice(0, 10), purpose: trip.purpose, miles: trip.miles, gas: trip.gas || "—", carSeat: true },
                  ...s.carTrips,
                ],
              }));
              setTrip({ purpose: "", miles: "", gas: "" });
            }}
          >
            Log trip (car seat checked)
          </PrimaryButton>
        </div>
        <ul className="mt-3 space-y-2">
          {state.carTrips.map((t) => (
            <li key={t.id} className="rounded-xl bg-stone-50 px-3 py-2 text-sm">
              <span className="font-semibold">{t.date}</span> · {t.purpose} · {t.miles} mi · gas {t.gas} ·{" "}
              {t.carSeat ? "car seat checked" : "car seat NOT checked"}
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
