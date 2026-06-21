import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {

    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, 
        {
            cookies: {
                getAll() {
                return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                // Update the request cookies so the rest of the app sees them
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                
                // Update the response so the browser saves the new cookies
                supabaseResponse = NextResponse.next({
                    request,
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
                },
            },
        }
    )

    await supabase.auth.getUser()

    return supabaseResponse
}

// Tell Next.js to run this on every page load
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}