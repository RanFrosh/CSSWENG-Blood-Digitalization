import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function serverSupa() {
  const chips = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return chips.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              chips.set(name, value, options));
          } catch (error: any) {
            console.error(error)
          }
        },
      },
    }
  );
}