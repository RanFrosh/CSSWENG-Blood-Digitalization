import { createBrowserClient } from "@supabase/ssr"

export async function clientSupa() {

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)

}