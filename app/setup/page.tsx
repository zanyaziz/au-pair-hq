import Link from "next/link";

export default function SetupPage() {
  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-2xl font-bold text-white">
            A
          </div>
          <h1 className="text-2xl font-bold">Au Pair HQ</h1>
          <p className="mt-2 text-stone-500">
            One source of truth for your au pair — schedule, kids, location on duty, log, and compliance.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 font-semibold text-amber-900">Optional: connect Supabase to go live</h2>
          <p className="mb-4 text-sm text-amber-800">
            This app works right now in demo mode (data is saved in your browser only). To share it between parents
            and your au pair with real accounts, connect a free Supabase project:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-amber-900">
            <li>Create a free project at <span className="font-mono">supabase.com</span>.</li>
            <li>
              In the SQL editor, run{" "}
              <span className="font-mono">supabase/migrations/001_au_pair_hq_schema.sql</span> from this repo.
            </li>
            <li>
              Copy your project URL and <span className="font-mono">anon</span> key from Project Settings → API.
            </li>
            <li>
              Add them as environment variables on your host:{" "}
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
              <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>, then redeploy.
            </li>
          </ol>
          <p className="mt-4 text-xs text-amber-700">Full instructions are in the repo README.</p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white">
            Continue in demo mode
          </Link>
        </div>

        <div className="mt-8 grid gap-3">
          {[
            ["Week Builder", "Schedule with hard J-1 caps: 10 hrs/day, 45 hrs/week (30 EduCare), 1.5 days off."],
            ["Today", "The au pair's simple timeline, clock in/out, and big status buttons."],
            ["Duty Mode", "Location sharing only while on duty — never 24/7."],
            ["Compliance & Pay", "Stipend log, vacation bank, $500 education fund, LCC check-ins, sponsor CSV export."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-stone-200 bg-white p-4">
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
