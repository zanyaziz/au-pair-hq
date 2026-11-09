import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/setup");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { next } = await searchParams;
  if (user) {
    redirect(next && next.startsWith("/") ? next : "/");
  }
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 text-white text-2xl font-bold mb-4">
            E
          </div>
          <h1 className="text-2xl font-bold">Welcome to Au Pair HQ</h1>
          <p className="text-stone-500 mt-2">
            Enter your email and we&apos;ll send you a magic link. No password
            needed.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
