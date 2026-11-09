import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white p-4 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-stone-500">{children}</h2>;
}

export function Badge({
  tone,
  children,
}: {
  tone: "green" | "red" | "amber" | "grey" | "teal";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-900",
    grey: "bg-stone-100 text-stone-600",
    teal: "bg-teal-100 text-teal-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Meter({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const over = value > max;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-stone-600">{label}</span>
        <span className={`text-lg font-bold ${over ? "text-red-700" : "text-stone-900"}`}>
          {value} / {max} hrs
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full rounded-full ${over ? "bg-red-600" : pct > 85 ? "bg-amber-500" : "bg-teal-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
