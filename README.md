# Au Pair HQ

**One source of truth for your au pair — schedule, kids, on-duty location, daily log, and compliance.** Free and open source, MIT licensed.

Au Pair HQ is a mobile-first web app for host families. It replaces the scattered texts, screenshots, and calendar invites with one shared place: the parents publish the week, the au pair sees a simple Today view, and everyone can see where the kids are and what happened today.

Built for the Aziz family (Snoqualmie, WA) for Laura, arriving November 20, 2026, via Cultural Care, Standard program — but it works for any host family.

## Features

- **Parent dashboard (Home)** — "Where the kids are" status board, today's timeline, this-week hours meter, compliance checks, and the stipend due this week.
- **Week Builder** — Mon–Sun schedule builder with split shifts and a **hard validator** that refuses an invalid week (see Rules below). Publish the week and get the au pair's acknowledgement.
- **Today (au pair view)** — a simple timeline, the parents' note pinned on top, Clock In / Clock Out, and big status buttons — *Picked up / Home / At park / At school / In the car* — that update Home, Live, and the Daily Log at once.
- **Duty Mode / Live** — location sharing **on duty only** (see Privacy below), kids status board, and a car log (trip, mileage, gas, car-seat check).
- **Daily Log** — meals, naps, mood, homework, incidents, and notes, plus an auto 7 PM summary view for parents.
- **Compliance & Pay** — stipend log, vacation bank, $500 education fund + course progress, monthly LCC check-in log, full-weekend-off tracker, and a sponsor-report CSV export.
- **Settings** — family, au pair, agency, program, kids' profiles (school, allergies, meds, bedtime, pickup notes), and house rules — all editable in the app.

## The J-1 rules it enforces

These are U.S. Department of State Au Pair Program rules (22 CFR 62.31), not suggestions. The Week Builder blocks a week that breaks them:

| Rule | Limit |
| --- | --- |
| Hours per day | **max 10 hours** |
| Hours per week | **max 45 hours** (Standard) / **30 hours** (EduCare) |
| Days off | **at least 1.5 days off per week** |
| Full weekend off | **one complete weekend off per month** (Fri night–Mon morning) |
| Paid vacation | **2 weeks per year** |
| Weekly stipend | **at least $195.75/week**, paid even in light weeks |
| Education | host contributes **up to $500** toward academic coursework |
| Infant care | an au pair **cannot be left alone with an infant under 3 months old** |

Hours cannot be banked across weeks, and extra pay cannot buy extra hours. The app also warns when a week leaves less than 5 hours of cushion under the cap, so a sick day or late meeting doesn't push you over.

> Rules change — confirm the current requirements with your sponsor agency (Cultural Care, AuPairCare, etc.) and your Local Childcare Consultant. This app is a planning tool, not legal advice.

## Privacy: location is on-duty-only, by design

- Location sharing turns **on only when the au pair clocks in**, and **off automatically at clock-out and on days off**. There is no 24/7 tracking.
- The au pair can see exactly what the parents see on the Live screen — same status board, same last check-in.
- No real addresses, phone numbers, emails, or exact school addresses are in this repo. Family and child details live in Settings (in the app), and the sample data is clearly labelled demo data.

## Tech

Next.js 16 (App Router) + Tailwind CSS v4, Supabase (Postgres + Auth) when connected, localStorage demo mode when not. Same stack as [EvenUp](https://github.com/zanyaziz/evenup).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. It runs in **demo mode** with a sample week (Mon Nov 9–15, 2026, 34/45 hrs) stored in your browser's localStorage. Use **Settings → Reset demo data** to restore the sample.

## Supabase setup (one time, optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/migrations/001_au_pair_hq_schema.sql`](supabase/migrations/001_au_pair_hq_schema.sql). It creates the tables (`families`, `kids`, `week_days`, `daily_logs`, `status_checkins`, `car_trips`, `stipend_payments`, `education_courses`, `lcc_checkins`) and Row Level Security policies.
3. In **Project Settings → API**, copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL` and the anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. In **Authentication → URL Configuration**, add your site URL to **Redirect URLs**, e.g. `https://your-app.vercel.app/auth/callback` (magic links won't work without this).
5. Set the two env vars locally (`.env.local`, see `.env.example`) and on your host.

Without the env vars, the app boots in demo mode instead of crashing — see `/setup` for the same instructions in-app.

> Note: the shipped RLS policies allow any authenticated user to read/write family rows. That is fine for a single-family deployment; tighten them with a family-membership table before inviting other households.

## Deploying on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo (Next.js is auto-detected).
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables (or deploy without them for demo mode), then **Deploy**. Every push to `main` redeploys automatically.

## License

MIT — see [LICENSE](LICENSE).
