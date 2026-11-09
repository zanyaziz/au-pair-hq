"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Week" },
  { href: "/today", label: "Today" },
  { href: "/live", label: "Live" },
  { href: "/log", label: "Log" },
  { href: "/compliance", label: "Pay" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {LINKS.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 py-3 text-center text-[11px] font-semibold leading-tight sm:text-xs ${
                active ? "text-teal-700" : "text-stone-500"
              }`}
            >
              <span
                className={`mx-auto mb-1 block h-1.5 w-8 rounded-full ${
                  active ? "bg-teal-600" : "bg-transparent"
                }`}
              />
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
