import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./lib/supabase/config";

export async function proxy(request: NextRequest) {
  // Without Supabase credentials there is no session to refresh; the app
  // renders its setup guide instead.
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const { createServerClient } = await import("@supabase/ssr");
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = await import(
    "./lib/supabase/config"
  );

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
