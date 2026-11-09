"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DayPlan } from "./rules";

export type Kid = {
  id: string;
  name: string;
  age: string;
  school: string;
  allergies: string;
  meds: string;
  bedtime: string;
  pickup: string;
  notes: string;
  arrivingSoon?: boolean;
};

export type Settings = {
  familyName: string;
  parents: string;
  auPairName: string;
  agency: string;
  program: "Standard" | "EduCare";
  arrivalDate: string;
  stipendWeekly: number;
  educationFund: number;
  kids: Kid[];
  houseRules: string;
  parentNote: string;
};

export type LogEntry = {
  id: string;
  time: string;
  kind: string;
  child: string;
  text: string;
};

export type CarTrip = {
  id: string;
  date: string;
  purpose: string;
  miles: string;
  gas: string;
  carSeat: boolean;
};

export type StipendPayment = {
  id: string;
  weekOf: string;
  amount: number;
  paid: boolean;
  paidDate: string;
};

export type Course = { id: string; name: string; credits: string; done: boolean };
export type CheckIn = { id: string; date: string; note: string };

export type AppState = {
  settings: Settings;
  week: DayPlan[];
  published: boolean;
  auPairAck: boolean;
  onDuty: boolean;
  status: string;
  statusAt: string;
  location: { lat: number; lng: number; accuracy: number; at: string } | null;
  log: LogEntry[];
  carTrips: CarTrip[];
  stipends: StipendPayment[];
  vacationDaysUsed: number;
  educationSpent: number;
  courses: Course[];
  lccCheckins: CheckIn[];
  weekendOffDone: boolean;
  weekendOffNote: string;
};

const SAMPLE_WEEK: DayPlan[] = [
  { day: "Mon", off: false, shifts: [{ start: "07:00", end: "09:00" }, { start: "14:30", end: "19:30" }] },
  { day: "Tue", off: false, shifts: [{ start: "07:00", end: "09:00" }, { start: "14:30", end: "19:30" }] },
  { day: "Wed", off: false, shifts: [{ start: "07:00", end: "09:00" }, { start: "14:30", end: "19:30" }] },
  { day: "Thu", off: false, shifts: [{ start: "07:00", end: "09:00" }, { start: "14:30", end: "19:30" }] },
  { day: "Fri", off: false, shifts: [{ start: "07:00", end: "09:00" }, { start: "14:30", end: "18:30" }] },
  { day: "Sat", off: true, shifts: [] },
  { day: "Sun", off: true, shifts: [] },
];

const DEFAULT_STATE: AppState = {
  settings: {
    familyName: "Aziz Family",
    parents: "Zain & Umema Ahmed",
    auPairName: "Laura",
    agency: "Cultural Care",
    program: "Standard",
    arrivalDate: "2026-11-20",
    stipendWeekly: 195.75,
    educationFund: 500,
    kids: [
      {
        id: "aydin",
        name: "Aydin",
        age: "4",
        school: "Medina Academy (preschool)",
        allergies: "None known — confirm with parents",
        meds: "None",
        bedtime: "7:30 PM",
        pickup: "Medina Academy front office — ID may be asked",
        notes: "Loves the park after school. Snack at 3:00 PM. No peanuts at school.",
      },
      {
        id: "daughter",
        name: "Daughter",
        age: "—",
        school: "—",
        allergies: "—",
        meds: "—",
        bedtime: "—",
        pickup: "—",
        notes: "Update this profile in Settings with her name, school and routine before Laura arrives.",
      },
      {
        id: "baby",
        name: "Baby (arriving soon)",
        age: "Due early 2027",
        school: "—",
        allergies: "—",
        meds: "—",
        bedtime: "—",
        pickup: "—",
        notes: "Arriving soon. An au pair cannot be left alone with an infant under 3 months old — plan parent coverage for the first 3 months.",
        arrivingSoon: true,
      },
    ],
    houseRules:
      "Child-related duties only. No general housekeeping. Kids' laundry and meals are fine; parents' laundry is not. Screen time: 30 min max on school days. Always text parents before any schedule change.",
    parentNote:
      "Morning — Aydin has show-and-tell today, his dinosaur is in the blue backpack. Pickup at 2:30 PM sharp. Doctor at 4 PM — please text when you leave school.",
  },
  week: SAMPLE_WEEK,
  published: true,
  auPairAck: true,
  onDuty: false,
  status: "Off duty",
  statusAt: "",
  location: null,
  log: [
    { id: "l1", time: "7:05 AM", kind: "Meal", child: "Aydin", text: "Breakfast — oatmeal and banana, ate most of it." },
    { id: "l2", time: "8:15 AM", kind: "Drop-off", child: "Aydin", text: "Dropped at Medina Academy, on time." },
    { id: "l3", time: "2:42 PM", kind: "Pickup", child: "Aydin", text: "Picked up from school." },
    { id: "l4", time: "3:00 PM", kind: "Meal", child: "Aydin", text: "Snack — apple slices and crackers." },
  ],
  carTrips: [
    { id: "c1", date: "2026-11-09", purpose: "School drop-off + pickup", miles: "18", gas: "—", carSeat: true },
  ],
  stipends: [
    { id: "s1", weekOf: "2026-11-09", amount: 195.75, paid: true, paidDate: "2026-11-09" },
    { id: "s2", weekOf: "2026-11-16", amount: 195.75, paid: false, paidDate: "" },
  ],
  vacationDaysUsed: 0,
  educationSpent: 0,
  courses: [{ id: "co1", name: "English / community class (to be chosen)", credits: "—", done: false }],
  lccCheckins: [],
  weekendOffDone: false,
  weekendOffNote: "Not yet scheduled for November — pick a Fri night–Mon morning weekend.",
};

const KEY = "au-pair-hq-state-v1";

type Store = {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {
      // fall back to sample data
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        // storage full / unavailable — demo still works in memory
      }
    }
  }, [state, loaded]);

  const store = useMemo<Store>(
    () => ({
      state,
      update: (fn) => setState((s) => fn(s)),
      resetDemo: () => setState(DEFAULT_STATE),
    }),
    [state]
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
