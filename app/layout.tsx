import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Au Pair HQ — family au pair management",
  description:
    "One source of truth for your au pair: weekly schedule with J-1 compliance, kids' schedules, on-duty location, daily log, stipend and education tracking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 text-stone-900 flex flex-col">
        <StoreProvider>
          <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-4">
            {children}
          </div>
          <Nav />
        </StoreProvider>
      </body>
    </html>
  );
}
